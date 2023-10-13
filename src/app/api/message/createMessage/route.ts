import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import {
  SetMessageInput,
  SetMessageSchema,
} from "@/lib/validations/message.schema";
import { NextRequest, NextResponse } from "next/server";
import { getNextResponse } from "@/lib/helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("API 호출???");

    const body = (await req.json()) as SetMessageInput;
    const data = SetMessageSchema.parse(body);

    await prisma.message.create({
      data: {
        code: data.code,
        language: data.language,
        category: data.category,
        content: data.content,
        createdBy: "haesoo",
        updatedBy: "haesoo",
      },
    });

    return getNextResponse(200, "successfully created message", {
      code: data.code,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return getNextResponse(400, "validation error", null, error);
    }

    return getNextResponse(500, "internal server error");
  }
}
