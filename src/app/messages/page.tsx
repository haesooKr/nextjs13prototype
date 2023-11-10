// Server Rendering Message

import { Message } from "@prisma/client";

async function fetchMessages() {
  const url = "http://localhost:3000/api/unprotected/getMessage";

  const response = await fetch(url, { next: { revalidate: 5 } });

  const data = await response.json();
  return data.data.messages;
}

export default async function AllMessagesPage() {
  const lastRenderedTime = new Date().toLocaleDateString();
  const messages = await fetchMessages();
  return (
    <div>
      <h1>All Messages</h1>
      <p>Last Rendered Time: {lastRenderedTime}</p>

      <ul>
        {messages &&
          messages.map((message: Message) => {
            return (
              <>
                <h1>Message: </h1>
                <li key={message.code}>{message.content}</li>
              </>
            );
          })}
      </ul>
    </div>
  );
}
