import { getNextResponse } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { postId, content } = body;
    const userId = req.headers.get("x-user");

    if (userId) {
      const comment = await prisma.comment.create({
        data: {
          userId,
          postId: Number(postId),
          content,
        },
      });

      if (comment) {
        return getNextResponse(200, "Delete Comment Successfully", { comment });
      } else {
        return getNextResponse(404, "Comment does not exists");
      }
    } else {
      return getNextResponse(401, "unauthorized");
    }
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "Internal server error");
  }
}
