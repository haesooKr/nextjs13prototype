import { prisma } from "../../src/lib/prisma";
import { Prisma } from "@prisma/client";

const topicSeed = async () => {
  try {
    const data: Prisma.TopicCreateArgs["data"][] = [
      {
        id: 1,
        name: "ALL",
      },
      {
        id: 2,
        name: "ACC",
      },
      {
        id: 3,
        name: "BI",
      },
      {
        id: 4,
        name: "CES",
      },
      {
        id: 5,
        name: "CLIA",
      },
      {
        id: 6,
        name: "IT",
      },
      {
        id: 7,
        name: "NGS",
      },
      {
        id: 8,
        name: "SALES",
      },
    ];

    console.log("Seeding topics...");

    prisma.topic
      .createMany({
        data,
      })
      .then(() => {
        console.log("[!] Database topics seeded");
      })
      .catch((error) => {
        console.log("[!] Error seeding database topics", error);
      });
  } catch (error) {
    console.warn("Please define your seed data.");
    console.error(error);
  }
};

export default topicSeed;
