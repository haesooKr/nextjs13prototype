"use client";

import { useEffect, useState } from "react";
import CommentList from "./commentList";
import styles from "./post.module.css";

export default function Comment({
  comment,
  userId,
  handleCommentButton,
  handleOnChangeContent,
  handleModifyCommentSubmit,
  handleReplyCommentSubmit,
  selectedCommentContent,
  setSelectedCommentContent,
  selectedComment,
  toDateString,
  visible,
  level,
  isModify,
}) {
  const [childComments, setChildComments] = useState();
  const [content, setContent] = useState();
  const [hidden, setHidden] = useState(false);
  console.log("CHILDCOMMENT START");

  useEffect(() => {
    setContent(comment.content);

    const fetchData = async () => {
      const response = await fetch("/api/comment/getChildComment", {
        method: "POST",
        body: JSON.stringify({ commentId: comment.id }),
      });

      const data = await response.json();
      setChildComments(data.data.comment.childComments);
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        key={comment.id}
        className={styles.comment}
        style={{ display: hidden ? "none" : "block" }}
      >
        <div className={styles.row1}>
          {userId == comment.userId ? (
            <>
              <button
                onClick={() => {
                  setSelectedCommentContent(content);
                  handleCommentButton(comment.id, 2);
                }}
              >
                Modify
              </button>
              <button
                onClick={() => {
                  handleCommentButton(comment.id, 4);
                  setHidden(true);
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleCommentButton(comment.id, 1)}>
                Reply
              </button>
            </>
          )}
        </div>
        <div className={styles.row2}>
          <div>{comment.userId}</div>
          <div>{toDateString(comment.createdAt)}</div>
        </div>
        <div className={styles.row3}>
          {content}
          <div
            className={`${
              selectedComment === comment.id && visible
                ? styles.commentForm
                : styles.hidden
            }`}
            id={`comment${comment.id}`}
          >
            <div>
              <input
                value={selectedCommentContent}
                onChange={(e) => handleOnChangeContent(e)}
              ></input>
            </div>
            <div>
              {isModify ? (
                <button
                  onClick={async () => {
                    const updatedComment = await handleModifyCommentSubmit();
                    console.log(
                      "🚀 ~ file: comment.tsx:101 ~ onClick={ ~ updatedComment:",
                      updatedComment
                    );

                    setContent(updatedComment.content);
                  }}
                >
                  OK
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const comment = await handleReplyCommentSubmit();
                    if (comment != null) {
                      const updatedChildComments = childComments.filter(
                        () => true
                      );
                      updatedChildComments.push(comment);
                      setChildComments(updatedChildComments);
                    }
                  }}
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {childComments && childComments.length > 0 ? (
        <CommentList
          childComments={childComments}
          level={level + 1}
          comment={comment}
          userId={userId}
          handleCommentButton={handleCommentButton}
          handleOnChangeContent={handleOnChangeContent}
          handleModifyCommentSubmit={handleModifyCommentSubmit}
          handleReplyCommentSubmit={handleReplyCommentSubmit}
          selectedCommentContent={selectedCommentContent}
          setSelectedCommentContent={setSelectedCommentContent}
          selectedComment={selectedComment}
          toDateString={toDateString}
          visible={visible}
          isModify={isModify}
        />
      ) : null}
    </>
  );
}
