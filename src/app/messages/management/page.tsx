"use client";

import TableGenerator from "@/app/components/tableHS/tableHS";
import { useEffect, useState } from "react";

function fetchMessages(setMessages: any): any {
  console.log("FETCH");
  fetch("/api/message/getMessage", {
    method: "POST",
  })
    .then((data) => data.json())
    .then((response) => {
      console.log("fetch: ", response);
      setMessages(response.data.messages);
    });
}

function MessageManagementPage() {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchMessages(setMessages);
  }, []);

  return (
    <div>
      <TableGenerator data={messages} />
    </div>
  );
}

export default MessageManagementPage;
