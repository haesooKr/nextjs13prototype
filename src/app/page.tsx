import Image from "next/image";
import styles from "./home.module.css";
import Background from "public/bg.jpg";

export default function Home() {
  return (
    <main>
      <div className={styles.homeContainer}>
        <h1 className={styles.welcomeEffect} style={{ zIndex: 1 }}>
          Welcome
        </h1>
        <Image
          src={Background}
          alt="pixel"
          placeholder="blur"
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    </main>
  );
}
