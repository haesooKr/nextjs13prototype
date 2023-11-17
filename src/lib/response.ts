import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { JSONResponse } from "./helpers";

interface ResponseDataWithCallback {
  callbackUrl: string;
}

export default async function responseHandler(
  response: JSONResponse,
  router: AppRouterInstance,
  cb: { success: () => void; fail: () => void }
) {
  if (response.status === "unauthorized") {
    if (
      response.data &&
      (response.data as ResponseDataWithCallback).callbackUrl
    ) {
      const { callbackUrl } = response.data as ResponseDataWithCallback;
      console.log("🚀 ~ file: response.ts:23 ~ callback");

      router.push(`login?unauthorized=true&callbackUrl=${callbackUrl}`);
      return false;
    } else {
      console.log("🚀 ~ file: response.ts:23 ~ login page");
      router.push(`login?unauthorized=true`);
      return false;
    }
  } else if (response.status === "not-found") {
    router.push("/404");
    return false;
  } else if (response.status === "success") {
    cb.success();
    return true;
  } else {
    cb.fail();
    return false;
  }
}
