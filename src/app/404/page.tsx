"use client";

import Link from "next/link";
import styles from "./notfound.module.css";

export default function ForbiddenPage() {
  console.log("나나나", new Date().toTimeString());
  return (
    <div className={styles.notFound}>
      <h2>NotFound</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
