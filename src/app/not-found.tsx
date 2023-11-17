"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./notfound.module.css";

export default function NotFound() {
  console.log("가가가", new Date().toTimeString());
  const router = useRouter();

  useEffect(() => {
    console.log("가가가222", new Date().toTimeString());
    router.push("/404");
  }, []);

  return (
    <div className={styles.notFound}>
      <h2>NotFound</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}

// 404 -> 서버
// not-found -> client -> 404
