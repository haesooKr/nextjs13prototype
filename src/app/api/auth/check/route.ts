import { getNextResponse } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    return getNextResponse(200, "user is logged in");
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getNextResponse(400, "failed validations", null, error);
    }

    return getNextResponse(500, error.message);
  }
}
