import redisClient from "@/lib/redis";
import { SetRedisInput, SetRedisSchema } from "@/lib/validations/redis.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as SetRedisInput;
  const data = SetRedisSchema.parse(body);

  try {
    await redisClient.set(
      data.key,
      data.value,
      data.secondsToken,
      data.seconds
    );

    return NextResponse.json({
      status: "success",
      data: { id: data.value },
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
    });
  }
}
