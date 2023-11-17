import { getNextResponse } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const formDataEntryValues = Array.from(formData.values());
    for (const formDataEntryValue of formDataEntryValues) {
      if (
        typeof formDataEntryValue === "object" &&
        "arrayBuffer" in formDataEntryValue
      ) {
        const file = formDataEntryValue as unknown as Blob;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(`public/${file.name}`, buffer);

        return getNextResponse(200, "image uploaded", {
          imageUrl: `/${file.name}`,
        });
      }
    }

    return getNextResponse(500, "Internal server error");
  } catch (error) {
    return getNextResponse(500, "Internal server error");
  }
}
