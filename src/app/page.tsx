import styles from "./home.module.css";
import PostList from "./components/posts/postList";
async function fetchPosts() {
  const url = "http://localhost:3000/api/unprotected/getPosts";

  const response = await fetch(url, { next: { revalidate: 5 } });

  const data = await response.json();
  return data.data.posts;
}

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main>
      <div className={styles.homeContainer}>
        <PostList name="전체게시판" posts={posts} />
      </div>
    </main>
  );
}
