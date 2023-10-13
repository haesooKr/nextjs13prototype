import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const preventCaching = new URL(req.url);

  const messages = await prisma.message.findMany({});

  return getNextResponse(200, null, { messages });
}
