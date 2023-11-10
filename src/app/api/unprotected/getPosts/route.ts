import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

type Request = NextRequest & NextApiRequest;

export async function GET(req: Request): Promise<NextResponse> {
  const preventCaching = new URL(req.url);

  try {
    const posts = await prisma.post.findMany({
      take: 10,
      where: {
        viewYn: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        postViews: true,
        postLikes: true,
        comments: true,
        topic: true,
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(posts);

    return getNextResponse(200, null, { posts });
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "internal server error");
  }
}
