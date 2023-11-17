"use client";

import Link from "next/link";
import styles from "./navigation.module.css";
import useStore from "@/lib/zustand/useStore";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const user = useStore(useAuthStore, (state) => state.user);
  const { logout } = useAuthStore();
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle(!menuToggle);
  };

  const handleClickHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className={styles.navContainer}>
      <header>
        <h2 onClick={handleClickHome}>grooveware</h2>
        <a
          href="#"
          className={`${styles.menuBtn} ${menuToggle ? `${styles.act}` : ""}`}
          onClick={toggleMenu}
        >
          <span className={styles.lines}></span>
        </a>
        <nav
          className={`${styles.mainMenu} ${menuToggle ? `${styles.act}` : ""}`}
        >
          <ul>
            {user && user.role === "admin" && (
              <>
                <li onClick={toggleMenu}>
                  <Link href="/messages">Messages (server)</Link>
                </li>
              </>
            )}

            {!user ? (
              <>
                <li onClick={toggleMenu}>
                  <Link href="/login">Sign in</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li onClick={toggleMenu}>
                  <Link href="/post/writePost">Write Post</Link>
                </li>
                <li onClick={toggleMenu}>
                  <span onClick={handleLogout}>Sign Out</span>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}
