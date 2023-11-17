import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { postId } = await req.json();

    const userId = req.headers.get("x-user");

    if (userId) {
      const post = await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: Number(postId),
            userId,
          },
        },
      });

      return getNextResponse(200, "Upload Like Successfully", { post });
    }

    return getNextResponse(500, "Internal server error");
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "Internal server error");
  }
}