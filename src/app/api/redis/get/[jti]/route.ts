import { getNextResponse } from "@/lib/helpers";
import redisClient from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { jti: string } }
): Promise<NextResponse> {
  const user = await redisClient.get(params.jti);

  if (user == null) {
    return getNextResponse(500, "Redis Client Error");
  }

  return NextResponse.json({
    status: "success",
    data: { user },
  });
}
