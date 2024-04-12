import React, { useState, useEffect } from "react";
import Container from "@/components/Container/container";
import Chat from "@/components/Chat/chat";
import Form from "@/components/Form/form";
import BubbleSpeech from "@/components/BubbleSpeech/bubbleSpeech";
import IMessage from "@/intefaces/IMessage";
import IResponse from "@/intefaces/IResponse";
import IRequest from "@/intefaces/IRequest";

export default function Calculate() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");

    ws.onopen = () => {
      console.log("WebSocket connected!");
    };

    ws.onmessage = (message) => {
      try {
        console.log(`Received: ${message.data}`);
        const messageData = JSON.parse(message.data) as IResponse;

        if (
          messageData.type === "success" &&
          (messageData.channel === "calculate" || messageData.channel === "all")
        ) {
          setMessages((prev) => [
            ...prev,
            { text: messageData.message, type: "response", date: new Date() },
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    setWs(ws);

    return () => {
      ws.close();
    };
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const value = (e.target as any)[0].value;
    const request: IRequest = {
      channel: "calculate",
      message: value,
    };

    if (ws) {
      ws.send(JSON.stringify(request));

      setMessages((prev) => [
        ...prev,
        { text: value, type: "request", date: new Date() },
      ]);
    }
  };

  return (
    <Container>
      <Chat className="[&>*]:text-white">
        {messages.map((message, index) => (
          <BubbleSpeech key={index} type={message.type} message={message} />
        ))}
      </Chat>

      <Form onSubmit={onSubmit} />
    </Container>
  );
}
