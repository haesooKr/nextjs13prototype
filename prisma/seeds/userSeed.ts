import { prisma } from "../../src/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const userSeed = async () => {
  const password = await hash("1234", 12);

  try {
    const data: Prisma.UserCreateArgs["data"][] = [
      {
        id: "user",
        name: "NONAME-USER",
        email: "user",
        password: password,
        role: "user",
      },
      {
        id: "admin",
        name: "NONAME-ADMIN",
        email: "admin",
        password: password,
        role: "user",
      },
    ];

    console.log("Seeding users...");

    // Create the default users
    prisma.user
      .createMany({
        data,
      })
      .then(() => {
        console.log("[!] Database users seeded");
      })
      .catch((error) => {
        console.log("[!] Error seeding database users", error);
      });
  } catch (error) {
    console.warn("Please define your seed data.");
    console.error(error);
  }
};

export default userSeed;
