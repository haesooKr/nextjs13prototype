import { NextResponse } from "next/server";
import { ZodError } from "zod";

type EnvVariableKey =
  | "REDIS_URL"
  | "ACCESS_TOKEN_SECRET"
  | "REFRESH_TOKEN_SECRET"
  | "ACCESS_TOKEN_EXPIRY"
  | "REFRESH_TOKEN_EXPIRY";

export function getEnvVariable(key: EnvVariableKey): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

type statusCode = "success" | "error" | "fail" | "unauthorized";

export interface JSONResponse {
  status: statusCode;
  message: string | [] | null;
  data: {} | null;
  error: ZodError | string | null;
}

export function getNextResponse(
  status: number = 200,
  message: string | [] | null,
  data: {} | null = null,
  error: ZodError | string | null = null
): NextResponse<JSONResponse> {
  return new NextResponse(
    JSON.stringify({
      status:
        status > 300
          ? status < 500
            ? status === 401
              ? "unauthorized"
              : "fail"
            : "error"
          : "success",
      message,
      data,
      error: error
        ? typeof error === "string"
          ? error
          : error.flatten()
        : null,
    })
  );
}
