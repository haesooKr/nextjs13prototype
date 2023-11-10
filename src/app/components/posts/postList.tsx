"use client";

import { Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import styles from "./post.module.css";

export default function PostList({
  name,
  posts,
}: {
  name: string;
  posts: any[];
}) {
  const router = useRouter();

  return (
    <div className={styles.postsList}>
      <h2>{name}</h2>
      <ul>
        {posts &&
          posts.map((post: Post) => {
            return <PostItem key={post.id} post={post} router={router} />;
          })}
      </ul>
    </div>
  );
}

export function PostItem({ post, router }: { post: any; router: any }) {
  const handleOnClick = (postId: number) => {
    router.push(`post/${postId}`);
  };

  return (
    <li>
      <div className={styles.post}>
        <p onClick={() => handleOnClick(post.id)}>{post.title}</p>
        <div>
          {post.postLikes.length > 0 && (
            <>
              <div>👍</div>
              <div>{post.postLikes.length}</div>
            </>
          )}
        </div>
        <div>
          <div>💬</div>
          <div>{post.comments.length}</div>
        </div>
      </div>
    </li>
  );
}

// {posts &&
//   posts.map((post: Post) => {
//     return (
//       <li key={post.id}>
//         <h1>{post.title}</h1>
//       </li>
//     );
//   })}
