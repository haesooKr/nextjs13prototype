"use client";

import Link from "next/link";
import styles from "./navigation.module.css";
import useStore from "@/lib/zustand/useStore";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { useState } from "react";

export default function Navigation() {
  const user = useStore(useAuthStore, (state) => state.user);
  const { logout } = useAuthStore();
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle(!menuToggle);
  };

  return (
    <div className={styles.navContainer}>
      <header>
        <h1>웹사이트</h1>
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
                  <Link href="/messages/management">Admin</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link href="/messages">Messages (server)</Link>
                </li>
                <li onClick={toggleMenu}>
                  <Link href="/messages/admin">Messages (client)</Link>
                </li>
              </>
            )}

            {!user ? (
              <li onClick={toggleMenu}>
                <Link href="/login">Sign in</Link>
              </li>
            ) : (
              <>
                <li onClick={toggleMenu}>
                  <span onClick={logout}>Sign Out</span>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}
