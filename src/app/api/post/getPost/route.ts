import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { postId } = body;

    if (postId != null) {
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(postId),
          viewYn: true,
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
              childComments: true,
            },
          },
        },
      });

      if (post === null) {
        return getNextResponse(404, "not found error");
      }

      return getNextResponse(200, null, { post });
    } else {
      return getNextResponse(404, "not found error");
    }
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "internal server error");
  }
}
