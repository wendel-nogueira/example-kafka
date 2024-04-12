import React from "react";
import "./styles.css";
import { IMessage } from "@/intefaces/IMessage";

export interface bubbleSpeechProps {
  message: IMessage;
  className?: string;
  type?: "request" | "response";
}

export default function BubbleSpeech({
  message,
  className,
  type = "request",
}: bubbleSpeechProps) {
  return (
    <div
      className={`px-4 py-2 rounded-md max-w-sm flex flex-col items-end animate-fade-in-0.2 ${type} ${className}`}
    >
      <p className="text-base text-white word-wrap break-words w-full">{message.text}</p>

      <span className="text-xs text-gray-200 font-light">
        {
          message.date.toLocaleTimeString().slice(0, 5)
        }
      </span>
    </div>
  );
}
