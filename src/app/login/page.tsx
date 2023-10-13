"use client";

import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/lib/zustand/useAuthStore";

export default function LoginPage() {
  const { login, logout } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
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
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.user) {
      login(data.user);
      router.push(url);
    } else {
      alert("Login Fail");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginBox} onSubmit={(e) => e.preventDefault()}>
        <input
          id="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
