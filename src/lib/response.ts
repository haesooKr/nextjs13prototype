import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { JSONResponse } from "./helpers";
import { useRouter } from "next/navigation";

interface ResponseDataWithCallback {
  callbackUrl: string;
}

export default function responseHandler(
  response: JSONResponse,
  router: AppRouterInstance,
  cb: Function,
  cbv: any = null
) {
  console.log(response);

  if (response.status === "unauthorized") {
    if (
      response.data &&
      (response.data as ResponseDataWithCallback).callbackUrl
    ) {
      const { callbackUrl } = response.data as ResponseDataWithCallback;

      router.push(`login?unauthorized=true&callbackUrl=${callbackUrl}`);
      return;
    } else {
      router.push(`login?unauthorized=true`);
    }
  } else {
    if (cbv == null) {
      cb();
    } else {
      cb(cbv);
    }
  }
}
