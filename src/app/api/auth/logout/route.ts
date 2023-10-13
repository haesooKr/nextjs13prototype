import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = new NextResponse(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  await Promise.all([
    response.cookies.set({
      name: "act",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "rft",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "logged-in",
      value: "",
      maxAge: -1,
    }),
  ]);

  return response;
}
