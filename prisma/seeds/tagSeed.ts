import { prisma } from "../../src/lib/prisma";
import { Prisma } from "@prisma/client";

const tagSeed = async () => {
  try {
    const data: Prisma.TagCreateArgs["data"][] = [
      {
        name: "공지사항",
      },
    ];

    console.log("Seeding tags...");

    prisma.tag
      .createMany({
        data,
      })
      .then((createdTags) => {
        console.log("[!] Database tags seeded");
        console.log("Created Tags:", createdTags);
      })
      .catch((error) => {
        console.log("[!] Error seeding database tags", error);
      });
  } catch (error) {
    console.warn("Please define your seed data.");
    console.error(error);
  }
};

export default tagSeed;
