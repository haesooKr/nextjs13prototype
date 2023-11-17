"use client";

import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/lib/zustand/useAuthStore";
import responseHandler from "@/lib/response";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, logout } = useAuthStore();
  const router = useRouter();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("unauthorized")) {
      logout();
    }
  }, [searchParams, logout]);

  let url = "/";

  let callBackUrl = searchParams.get("callbackUrl");
  if (callBackUrl != null) {
    url = callBackUrl;
  }

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();
    await responseHandler(data, router, {
      success: () => {
        login(data.data.user);
        router.push("/");
        toast("Welcome Back!", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      },
      fail: () => {
        toast("Wrong ID / Password", {
          icon: "⛔",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      },
    });
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={(e) => e.preventDefault()}>
        <input
          id="text"
          name="id"
          placeholder="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
}
