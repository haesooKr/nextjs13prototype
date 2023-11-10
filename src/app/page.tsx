import { Post } from "@prisma/client";
import styles from "./home.module.css";
import PostList from "./components/posts/postList";

async function fetchPosts() {
  const url = "http://localhost:3000/api/unprotected/getPosts";

  const response = await fetch(url, { next: { revalidate: 5 } });

  const data = await response.json();
  console.log("DATA: ", data);
  return data.data.posts;
}

export default async function Home() {
  const posts = await fetchPosts();
  console.log(posts);

  return (
    <main>
      <div className={styles.homeContainer}>
        <PostList name="전체게시판" posts={posts} />
      </div>
    </main>
  );
}
