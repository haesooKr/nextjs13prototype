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

    const updatedRows = data.updatedRows;
    const originalRows = data.originalRows;

    // Transaction Commit Rollback 자동
    const transaction = await prisma.$transaction(async (tx) => {
      for (let key in updatedRows) {
        await tx.message.update({
          where: {
            code_language: {
              code: originalRows[key].code,
              language: originalRows[key].language,
            },
          },
          data: {
            code: updatedRows[key].code
              ? updatedRows[key].code
              : originalRows[key].code,
            language: updatedRows[key].language
              ? updatedRows[key].language
              : originalRows[key].code,
            category: updatedRows[key].category
              ? updatedRows[key].category
              : originalRows[key].category,
            content: updatedRows[key].content
              ? updatedRows[key].content
              : originalRows[key].content,
          },
        });
      }
    });

    return getNextResponse(200, "successfully updated Message");
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return getNextResponse(400, "validation error", null, error);
    }

    return getNextResponse(500, "internal server error");
  }
}
