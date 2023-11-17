import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const topics = await prisma.topic.findMany();

    return getNextResponse(404, null, { topics });
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "internal server error");
  }
}
