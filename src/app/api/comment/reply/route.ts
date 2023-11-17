import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    console.log(body);
    const { commentId, content } = body;
    const userId = req.headers.get("x-user");

    if (userId) {
      const comment = await prisma.comment.create({
        data: {
          parentId: commentId,
          content,
          userId,
        },
      });

      return getNextResponse(200, "Delete Comment Successfully", { comment });
    } else {
      return getNextResponse(401, "Unauthorized");
    }
  } catch (error) {
    return getNextResponse(500, "Internal server error");
  }
}
