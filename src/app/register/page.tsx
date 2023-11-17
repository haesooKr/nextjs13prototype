"use client";

import React, { useState } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import responseHandler from "@/lib/response";

export default function RegisterPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, email, password, passwordConfirm }),
    });

    const data = await res.json();
    console.log(data);
    await responseHandler(data, router, {
      success: () => {
        router.push("/login");
        toast("User created", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      },
      fail: () => {
        const errors = Object.keys(data.error.fieldErrors);
        for (let error of errors) {
          console.log(data.error.fieldErrors[error]);
          toast(data.error.fieldErrors[error][0], {
            icon: "⛔",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      },
    });
  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerBox} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          id="id"
          name="id"
          placeholder="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          placeholder="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
}
