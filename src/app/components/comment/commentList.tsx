"use client";

import Comment from "./comment";

export default function CommentList({
  childComments,
  level,
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
  isModify,
}) {
  console.log(
    "🚀 ~ file: childCommentList.tsx:7 ~ ChildCommentList ~ childComments:",
    childComments
  );
  return (
    <div style={{ paddingLeft: level * 7 }}>
      {childComments.map((comment: any) => (
        <Comment
          key={comment.id}
          comment={comment}
          level={level}
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
      ))}
    </div>
  );
}
