"use client";

import { JSONResponse } from "@/lib/helpers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AddMessagePage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();

    fetch("/api/message/createMessage", {
      method: "POST",
      body: JSON.stringify({ code, language, category, content }),
    })
      .then((data) => data.json())
      .then((response: JSONResponse) =>
        responseHandler(response, router, () => alert("FINISHED"))
      );
  }

  return (
    <>
      <h1>Create New Message</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="text"
          id="language"
          name="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <input
          type="text"
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSubmit}>Access</button>
      </form>
    </>
  );
}

export default AddMessagePage;

function responseHandler(
  response: JSONResponse,
  router: AppRouterInstance,
  cb: Function
) {
  if (response.status === "success") {
    router.push("/messages");
  } else if (response.status === "unauthorized") {
    // delete global state user
    router.push("/login?unauthorized=true");
  } else {
    alert("FAIL");
  }

  cb();
}
