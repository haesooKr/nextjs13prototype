// types/next.d.ts

import { NextResponse } from "next/server";

declare type CustomResponse<T> = NextResponse & {
  status: string; // status 필드를 필수 필드로 설정
  data: T;
};
