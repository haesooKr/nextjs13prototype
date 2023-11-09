"use client";

import styles from "./home.module.css";
import useStore from "@/lib/zustand/useStore";
import useAuthStore from "@/lib/zustand/useAuthStore";

export default function Home() {
  const user = useStore(useAuthStore, (state) => state.user);

  return (
    <main>
      <div className={styles.homeContainer}>
        <h1 className={styles.welcomeEffect} style={{ zIndex: 1 }}>
          Welcome, you are {user ? user.role : "nobody"}
        </h1>
      </div>
    </main>
  );
}
