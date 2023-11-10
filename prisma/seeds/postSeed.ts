import { prisma } from "../../src/lib/prisma";
import { Prisma } from "@prisma/client";

const postSeed = async () => {
  try {
    const data: Prisma.PostCreateArgs["data"][] = [
      {
        id: 1,
        title: "Accounting 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 2,
      },
      {
        id: 2,
        title: "BI 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 3,
      },
      {
        id: 3,
        title: "CES 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 4,
      },
      {
        id: 4,
        title: "CLIA 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 5,
      },
      {
        id: 5,
        title: "IT 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 6,
      },
      {
        id: 6,
        title: "NGS 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 7,
      },
      {
        id: 7,
        title: "SALES 부서 게시판 입니다.",
        content: "",
        userId: "admin",
        topicId: 8,
      },
    ];

    console.log("Seeding posts...");

    const createdPosts = await prisma.post
      .createMany({
        data: data as any,
      })
      .catch((error) => {
        console.log("[!] Error seeding database users", error);
      });

    if (createdPosts) {
      console.log("[!] Database posts seeded");

      console.log("Seeding post views and likes...");

      const postIds = data.map((_, index) => index + 1); // Assuming id starts from 1 and increments

      for (const postId of postIds) {
        // Create post views
        await prisma.postView.create({
          data: {
            postId: postId,
            userId: "admin",
          },
        });

        await prisma.comment.create({
          data: {
            content: "기본 게시글입니다.", // Adjust as per your needs
            userId: "admin", // Assuming 'haesoo' as commenter
            postId: postId,
          },
        });

        // Create post likes
        await prisma.postLike.create({
          data: {
            postId: postId,
            userId: "admin", // Assuming haesoo likes all the posts
          },
        });

        await prisma.postTag.create({
          data: {
            postId: postId,
            tagId: 1,
          },
        });
      }

      console.log("[!] Database post views and likes seeded");
    }
  } catch (error) {
    console.warn("Please define your seed data.");
    console.error(error);
  }
};

export default postSeed;
