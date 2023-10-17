import { NextRequest, NextResponse } from "next/server";
import { getEnvVariable, getNextResponse } from "./lib/helpers";
import { signJWT, verifyJWT } from "@/lib/token";
import { v4 as uuidv4 } from "uuid";

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/api/auth/login") ||
    req.nextUrl.pathname.includes("unprotected")
  ) {
    return NextResponse.next();
  }

  let loggedIn: string | undefined;
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  const tokens = {
    accessToken: {
      sub: "",
      jti: "",
      redis: false,
    },
    refreshToken: {
      sub: "",
      jti: "",
      redis: false,
    },
  };

  let ACTVerfiy: any;
  let RFTVerify: any;

  if (req.nextUrl.pathname.startsWith("/api")) {
    if (req.cookies.has("logged-in")) {
      loggedIn = req.cookies.get("logged-in")?.value;
    }

    if (req.cookies.has("act")) {
      accessToken = req.cookies.get("act")?.value;
    }

    if (req.cookies.has("rft")) {
      refreshToken = req.cookies.get("rft")?.value;
    }

    if (!accessToken && !refreshToken) {
      console.log("referer", req.referrer);
      const response = getNextResponse(401, "unauthorized");
      return response;
    }

    if (accessToken) {
      ACTVerfiy = await verifyJWT<{
        sub: string;
        jti: string;
      }>(accessToken, getEnvVariable("ACCESS_TOKEN_SECRET"));
    }

    if (refreshToken) {
      RFTVerify = await verifyJWT<{
        sub: string;
        jti: string;
      }>(refreshToken, getEnvVariable("REFRESH_TOKEN_SECRET"));
    }

    if (ACTVerfiy && ACTVerfiy.verified && RFTVerify && RFTVerify.verified) {
      return NextResponse.next();
    } else if (ACTVerfiy && ACTVerfiy.verified) {
      console.log("RFT 재발급");
      return issueNewRefreshToken(tokens, req);
    } else if (RFTVerify && RFTVerify.verified) {
      // TODO: ACT 재발급 (재발급전에 RFT redis 체크 필요.)
      console.log("RFT REDIS Verfiy 실패");
      const RftRedis = await redisCheck(req, RFTVerify.jti);
      if (RftRedis) {
        return issueNewAccessToken(tokens, req);
      } else {
        return destroyAllCookies(req);
      }
    } else {
      return destroyAllCookies(req);
    }
  } else {
    const url =
      req.nextUrl.origin +
      "/login?callbackUrl=" +
      encodeURIComponent(req.nextUrl.pathname);

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path", "/user/:path*", "/api/:path*"],
};

/* custom functions below */

async function redisCheck(req: NextRequest, jti: string) {
  const res = await fetch(`${req.nextUrl.origin}${"/api/redis/get/"}${jti}`);
  const data = await res.json();

  if (data.status != "success") {
    return false;
  }

  return true;
}

const issueNewRefreshToken = async (tokens: any, req: NextRequest) => {
  const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
    getEnvVariable("REFRESH_TOKEN_SECRET")
  );
  const REFRESH_TOKEN_EXPIRY = getEnvVariable("REFRESH_TOKEN_EXPIRY");

  const refreshTokenUUID = uuidv4();
  const refreshToken = await signJWT(
    REFRESH_TOKEN_SECRET,
    { sub: tokens.accessToken.sub, jti: refreshTokenUUID },
    { exp: `${REFRESH_TOKEN_EXPIRY}m` }
  );

  const refreshTokenMaxAge = parseInt(REFRESH_TOKEN_EXPIRY);

  const refreshTokenCookieOptions = {
    name: "rft",
    value: refreshToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    maxAge: refreshTokenMaxAge,
  };

  await fetch(`${req.nextUrl.origin}/api/redis/set/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: refreshTokenUUID,
      value: tokens.accessToken.sub,
      secondsToken: "EX",
      seconds: refreshTokenMaxAge,
    }),
  });

  const response = NextResponse.next();
  response.cookies.set(refreshTokenCookieOptions);

  return response;
};

const issueNewAccessToken = async (tokens: any, req: NextRequest) => {
  const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
    getEnvVariable("ACCESS_TOKEN_SECRET")
  );
  const ACCESS_TOKEN_EXPIRY = getEnvVariable("ACCESS_TOKEN_EXPIRY");

  const accessTokenUUID = uuidv4();
  const accessToken = await signJWT(
    ACCESS_TOKEN_SECRET,
    { sub: tokens.refreshToken.sub, jti: accessTokenUUID },
    { exp: `${ACCESS_TOKEN_EXPIRY}m` }
  );
  const accessTokenMaxAge = parseInt(ACCESS_TOKEN_EXPIRY);

  const accessTokenCookieOptions = {
    name: "act",
    value: accessToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    maxAge: accessTokenMaxAge,
  };

  await fetch(`${req.nextUrl.origin}/api/redis/set/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: accessTokenUUID,
      value: tokens.accessToken.sub,
      secondsToken: "EX",
      seconds: accessTokenMaxAge,
    }),
  });
  const response = NextResponse.next();
  response.cookies.set(accessTokenCookieOptions);

  return response;
};

const destroyAllCookies = (req: NextRequest) => {
  console.log("CALLED");
  const response = getNextResponse(401, "unauthorized", {
    callbackUrl: encodeURIComponent(req.nextUrl.pathname),
  });

  response.cookies.set({
    name: "act",
    value: "",
    maxAge: -1,
  }),
    response.cookies.set({
      name: "rft",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "logged-in",
      value: "",
      maxAge: -1,
    });

  return response;
};
