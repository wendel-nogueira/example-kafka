import React, { useEffect } from "react";
import "./styles.css";

export interface ChatProps {
  children: React.ReactNode;
  className?: string;
}

export default function Chat({ children, className }: ChatProps) {
  useEffect(() => {
    const chat = document.getElementById("chat");
    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  }, [children]);

  return (
    <div
      className={
        "w-full flex h-full overflow-hidden bg-[#0a0a0a] rounded-md shadow-2xl p-4" +
        className
      }
      style={{ height: "calc(100vh - 148px)" }}
    >
      <div
        id="chat"
        className="w-full h-full overflow-y-scroll flex flex-col justify-end gap-4 p-4"
      >
        {children}
      </div>
    </div>
  );
}
