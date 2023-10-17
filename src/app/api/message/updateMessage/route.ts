import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import {
  UpdateMessageInput,
  UpdateMessageSchema,
} from "@/lib/validations/message.schema";
import { NextRequest, NextResponse } from "next/server";
import { getNextResponse } from "@/lib/helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as UpdateMessageInput;
    console.log(body);
    const data = UpdateMessageSchema.parse(body);
    console.log(data);

    await prisma.message.update({
      where: {
        code_language: {
          code: data.originalRow.code,
          language: data.originalRow.language,
        },
      },
      data: {
        code: data.updatedRow.code
          ? data.updatedRow.code
          : data.originalRow.code,
        language: data.updatedRow.language
          ? data.updatedRow.language
          : data.originalRow.code,
        category: data.updatedRow.category
          ? data.updatedRow.category
          : data.originalRow.category,
        content: data.updatedRow.content
          ? data.updatedRow.content
          : data.originalRow.content,
      },
    });

    return getNextResponse(200, "successfully updated Message");
  } catch (error) {
    if (error instanceof ZodError) {
      return getNextResponse(400, "validation error", null, error);
    }

    return getNextResponse(500, "internal server error");
  }
}
