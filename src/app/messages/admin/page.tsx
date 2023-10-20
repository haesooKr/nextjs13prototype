// Client Rendering Message

"use client";

import { useState } from "react";

function fetchMessages(setMessages: any): any {
  console.log("FETCH");
  fetch("/api/message/getMessage", {
    method: "POST",
  })
    .then((data) => data.json())
    .then((response) => {
      console.log(response);
      setMessages(response.data.messages);
    });
}

export default function AllMessagesPage() {
  const [messages, setMessages] = useState([]);

  return (
    <>
      <button onClick={() => fetchMessages(setMessages)}>조회</button>

      <ul>
        {messages &&
          messages.map((message: any) => {
            return <li key={message.code}>{message.content}</li>;
          })}
      </ul>
    </>
  );
}
