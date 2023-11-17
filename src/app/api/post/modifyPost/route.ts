import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { html, title, topicId, tags, id } = body;
    const userId = req.headers.get("x-user");

    if (userId) {
      const post = await prisma.post.update({
        where: {
          id,
        },
        data: {
          title: title,
          content: html,
          userId,
          topicId: Number(topicId),
          postTags: {
            deleteMany: {},
            create: tags.map((tag: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            })),
          },
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

      return getNextResponse(200, "Upload Post Successfully", { post });
    }

    return getNextResponse(500, "Internal server error");
  } catch (error) {
    console.log(error);
    return getNextResponse(500, "Internal server error");
  }
}
