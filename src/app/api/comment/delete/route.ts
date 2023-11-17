import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    console.log(body);
    const { commentId } = body;

    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    console.log(comment);

    if (comment) {
      return getNextResponse(200, "Delete Comment Successfully", { comment });
    } else {
      return getNextResponse(404, "Comment does not exists");
    }
  } catch (error) {
    return getNextResponse(500, "Internal server error");
  }
}
