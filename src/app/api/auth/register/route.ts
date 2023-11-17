import { getNextResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const hashedPassword = await hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        photo: data.photo,
      },
    });

    return getNextResponse(201, "create user successfully", {
      user: { ...user, password: undefined },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getNextResponse(400, "failed validations", null, error);
    }

    if (error.code === "P2002") {
      return getNextResponse(409, "user with that email already exists");
    }

    return getNextResponse(500, error.message);
  }
}
