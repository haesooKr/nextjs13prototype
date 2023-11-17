import { getEnvVariable, getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import redisClient from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginUserInput;
    const data = LoginUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user || !(await compare(data.password, user.password))) {
      return getNextResponse(400, "Invalid email or password");
    }

    const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
      getEnvVariable("ACCESS_TOKEN_SECRET")
    );
    const ACCESS_TOKEN_EXPIRY = getEnvVariable("ACCESS_TOKEN_EXPIRY");

    const accessTokenUUID = uuidv4();
    const accessToken = await signJWT(
      ACCESS_TOKEN_SECRET,
      { sub: user.id, jti: accessTokenUUID },
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

    const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
      getEnvVariable("REFRESH_TOKEN_SECRET")
    );
    const REFRESH_TOKEN_EXPIRY = getEnvVariable("REFRESH_TOKEN_EXPIRY");

    const refreshTokenUUID = uuidv4();
    const refreshToken = await signJWT(
      REFRESH_TOKEN_SECRET,
      { sub: user.id, jti: refreshTokenUUID },
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

    await redisClient.set(
      `${accessTokenUUID}`,
      user.id,
      "EX",
      accessTokenMaxAge
    );
    await redisClient.set(
      `${refreshTokenUUID}`,
      user.id,
      "EX",
      refreshTokenMaxAge
    );

    const response = getNextResponse(200, "login successfully", {
      user: { ...user, password: undefined },
    });

    await Promise.all([
      response.cookies.set(accessTokenCookieOptions),
      response.cookies.set(refreshTokenCookieOptions),
    ]);

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getNextResponse(400, "failed validations", null, error);
    }

    return getNextResponse(500, error.message);
  }
}
