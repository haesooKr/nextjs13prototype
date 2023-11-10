import { prisma } from "../src/lib/prisma";
import postSeed from "./seeds/postSeed";
import tagSeed from "./seeds/tagSeed";
import topicSeed from "./seeds/topicSeed";
import userSeed from "./seeds/userSeed";

const seed = async () => {
  await userSeed();
  await tagSeed();
  await topicSeed();
  await postSeed();
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
