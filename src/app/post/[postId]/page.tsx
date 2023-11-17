"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcFilledFilter, FcSearch, FcLike } from "react-icons/fc";
import styles from "./post.module.css";
import sanitizeHtml from "sanitize-html";
import toast from "react-hot-toast";
import useStore from "@/lib/zustand/useStore";
import useAuthStore from "@/lib/zustand/useAuthStore";
import usePostStore from "@/lib/zustand/usePostStore";
import responseHandler from "@/lib/response";
import Comment from "@/app/components/comment/comment";

function toDateString(date: string) {
  const temp = new Date(date);
  return `${temp.getFullYear()}.${temp.getMonth()}.${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}:${temp.getSeconds()}`;
}

export default function Page({ params }: { params: { postId: string } }) {
  const user = useStore(useAuthStore, (state) => state.user);
  const { savedPost, updatePost } = usePostStore((state) => state);
  const router = useRouter();
  const [post, setPost] = useState();
  const [html, setHtml] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [selectedCommentContent, setSelectedCommentContent] = useState("");
  const [postComment, setPostComment] = useState("");
  const [isModify, setIsModify] = useState(false);
  const [liked, setLiked] = useState(false);
  const [visible, setVisible] = useState(false);
  const { postId } = params;

  const handleCommentButton = async (commentId: string, option: number) => {
    if (option == 1) {
      // Reply
      // Comment Box open
      // addComment
      setIsModify(false);
      setSelectedComment(commentId);
      setSelectedCommentContent("");
      if (commentId == selectedComment) {
        setVisible(!visible);
      } else {
        setVisible(true);
      }
    } else if (option == 2) {
      // Modify
      // modifyComment
      setIsModify(true);
      setSelectedComment(commentId);
      if (commentId == selectedComment) {
        setVisible(!visible);
      } else {
        setVisible(true);
      }
    } else if (option == 3) {
      // Like
      // likeComment
    } else {
      // Delete
      // deleteComment
      const response = await fetch("/api/comment/delete", {
        method: "POST",
        body: JSON.stringify({ commentId }),
      });

      const data = await response.json();

      await responseHandler(data, router, {
        success: () => {
          toast("Comment deleted", {
            icon: "✅",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        },
        fail: () => {
          toast("Comment does not exist", {
            icon: "⛔",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        },
      });
    }
  };

  const handleOnChangeContent = (e) => {
    setSelectedCommentContent(e.target.value);
  };

  const handleModifyCommentSubmit = async () => {
    const response = await fetch("/api/comment/modify", {
      method: "POST",
      body: JSON.stringify({
        commentId: selectedComment,
        content: selectedCommentContent,
      }),
    });

    const data = await response.json();
    await responseHandler(data, router, {
      success: () => {
        setVisible(false);
        toast("Comment updated", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      },
      fail: () => {
        toast("Comment cannot be modified", {
          icon: "⛔",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      },
    });

    if (data.data) {
      return data.data.comment;
    } else {
      return null;
    }
  };

  const handlePostLike = async () => {
    const option = liked ? "Disliked" : "Like";
    const url = liked ? "/api/post/dislike" : "/api/post/like";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        postId,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      toast(`Successfully ${option}`, {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      if (liked) {
        // Dislike 눌렀을 때
        const postLikes = post.postLikes.filter(
          (like) => like.userId !== user.id
        );
        console.log(postLikes);
        const updatedPost = {
          ...post,
          postLikes,
        };
        setPost(updatedPost);
        setLiked(false);
      } else {
        // like 눌렀을 때
        const postLikes = post.postLikes.filter(() => true);
        postLikes.push(data.data.postLike);
        const updatedPost = {
          ...post,
          postLikes,
        };
        setPost(updatedPost);
        setLiked(true);
      }
    } else {
      toast("Server Error", {
        icon: "⛔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const handlePostModify = async () => {
    router.push("/post/modifyPost");
  };
  const handlePostDelete = async () => {
    const response = await fetch("/api/post/delete", {
      method: "POST",
      body: JSON.stringify({
        postId,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      toast("Deleted Post", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      router.push("/");
    } else {
      toast("Cannot delete post", {
        icon: "⛔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handlePostCommentSubmit = async () => {
    if (postComment.length < 1) {
      toast("Cannot upload empty comment", {
        icon: "⛔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return;
    }

    const response = await fetch("/api/post/uploadComment", {
      method: "POST",
      body: JSON.stringify({
        content: postComment,
        postId,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      const comments = post.comments.filter(() => true);
      comments.push(data.data.comment);
      const updatedPost = {
        ...post,
        comments,
      };

      // setPost로 업데이트
      setPostComment("");
      setPost(updatedPost);

      toast("Comment successfully added", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast("Cannot add comment", {
        icon: "⛔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleReplyCommentSubmit = async () => {
    const response = await fetch("/api/comment/reply", {
      method: "POST",
      body: JSON.stringify({
        commentId: selectedComment,
        content: selectedCommentContent,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      setVisible(false);
      toast("Replied successfully", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast("Cannot reply comment", {
        icon: "⛔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return null;
    }

    return data.data.comment;
  };

  // 페이지가 로딩될 때 데이터를 불러올 수 있도록 useEffect 사용
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/post/getPost", {
          method: "POST",
          body: JSON.stringify({ postId }),
        });

        const data = await response.json();

        await responseHandler(data, router, {
          success: () => {
            const cleanHtml = sanitizeHtml(data.data.post.content, {
              allowedTags: [
                "b",
                "i",
                "p",
                "em",
                "s",
                "u",
                "string",
                "span",
                "ol",
                "li",
                "ul",
                "li",
                "a",
                "img",
              ],
              allowedAttributes: {
                a: ["href", "rel", "target"],
                img: ["src", "width", "style"],
                span: ["style"],
              },
            });

            setHtml(cleanHtml);
            setPost(data.data.post);
            updatePost(data.data.post);
          },
          fail: () => {
            toast("Cannot load the post", {
              icon: "⛔",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [postId]);

  useEffect(() => {
    if (post) {
      post.postLikes.map((like) => {
        console.log(like.userId, user.id);
        if (like.userId === user.id) {
          setLiked(true);
        }
      });
    }
  }, [post, user]);

  return (
    <>
      {post ? (
        <div className={styles.postContainer}>
          <div className={styles.title}>
            <h1>{post.title}</h1>
          </div>
          <div className={styles.info}>
            <div>
              <p>
                <FcFilledFilter /> {post.topic.name}
              </p>
              <p>
                <FcLike /> {post.postLikes.length}
              </p>
              <p>
                <FcSearch /> {post.postViews.length}
              </p>
            </div>
            <p>{toDateString(post.createdAt)}</p>
          </div>
          <div className={styles.postButtons}>
            <button onClick={handlePostLike}>
              {liked ? "Dislike" : "Like"}
            </button>
            <button onClick={handlePostModify}>Modify</button>
            <button onClick={handlePostDelete}>Delete</button>
          </div>
          <div
            className={styles["ql-editor"]}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
          <div className={styles.tags}>
            {post.postTags.map((tag) => {
              return <div key={tag.tagId}>{tag.tag.name}</div>;
            })}
          </div>
          <div className={styles.postComment}>
            <h4>Comment:</h4>
            <input
              onChange={(e) => setPostComment(e.target.value)}
              value={postComment}
            />
            <button onClick={handlePostCommentSubmit}>Add Comment</button>
          </div>
          <div className={styles.comments}>
            {post.comments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  userId={user.id}
                  handleCommentButton={handleCommentButton}
                  handleOnChangeContent={handleOnChangeContent}
                  handleModifyCommentSubmit={handleModifyCommentSubmit}
                  handleReplyCommentSubmit={handleReplyCommentSubmit}
                  selectedCommentContent={selectedCommentContent}
                  setSelectedCommentContent={setSelectedCommentContent}
                  selectedComment={selectedComment}
                  toDateString={toDateString}
                  visible={visible}
                  level={0} 
                  isModify={isModify}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
