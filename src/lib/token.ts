import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (
  secret: Uint8Array,
  payload: { sub: string; jti: string },
  options: { exp: string }
) => {
  try {
    const alg = "HS256";

    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async <T>(
  token: string,
  secret: string
): Promise<T | { verified: false }> => {
  try {
    const result = await jwtVerify(token, new TextEncoder().encode(secret));
    const payload = result.payload as T;

    return {
      ...payload,
      verified: true,
    };
  } catch (error: any) {
    return {
      verified: false,
    };
  }
};
