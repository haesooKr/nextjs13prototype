"use client";

import { useEffect, useState } from "react";

async function fetchPost(postId: string) {
  try {
    const url = `http://localhost:3000/api/post/getPost?postId=${postId}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.data.post;
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState();
  const { postId } = params;

  // 페이지가 로딩될 때 데이터를 불러올 수 있도록 useEffect 사용
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPost(postId);

      console.log(data);

      setPost(data);
    };

    fetchData();
  }, [postId]);

  return (
    <>
      {post ? (
        <div>
          <h1>{post.title}</h1>
          <p>{post.createdAt}</p>
          <p>{post.topic.name}</p>
          <p>{post.postLikes.length}</p>
          <p>{post.postViews.length}</p>
          <p>{post.content}</p>
          {post.comments.map((comment) => {
            return (
              <div>
                {comment.content}
                {comment.createdAt}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
