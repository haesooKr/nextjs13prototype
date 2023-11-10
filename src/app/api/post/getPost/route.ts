import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        postViews: true,
        postLikes: true,
        topic: true,
        postTags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return getNextResponse(200, null, { post });
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "internal server error");
  }
}
