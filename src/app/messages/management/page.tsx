"use client";

import TableGenerator from "@/app/components/tableTest/tableTest";
import responseHandler from "@/lib/response";
import styles from "./management.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function fetchMessages(router: AppRouterInstance, setMessages: any): any {
  fetch("/api/message/getMessage", {
    method: "POST",
  })
    .then((data) => data.json())
    .then((response) => {
      responseHandler(response, router, setMessages, response?.data?.messages);
    });
}

function MessageManagementPage() {
  const router = useRouter();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchMessages(router, setMessages);
  }, []);

  return (
    <div className={styles.management}>
      <TableGenerator data={messages} />
    </div>
  );
}

export default MessageManagementPage;
