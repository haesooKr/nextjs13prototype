"use client";

import usePostStore from "@/lib/zustand/usePostStore";

export default function TEST() {
  const { count, addCount } = usePostStore(); // Use the hook without the selector function

  return (
    <div>
      <button
        onClick={() => {
          addCount({ test: 1 });
          console.log(count);
        }}
      ></button>
    </div>
  );
}
