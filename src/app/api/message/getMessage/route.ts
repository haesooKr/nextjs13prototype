import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const preventCaching = new URL(req.url);

  const messages = await prisma.message.findMany({
    orderBy: {
      code: "desc",
    },
  });

  // await prisma.$queryRaw`SELECT * FROM public.MESSAGE M ORDER BY CAST(CODE AS INTEGER)`;

  return getNextResponse(200, null, { messages });
}
