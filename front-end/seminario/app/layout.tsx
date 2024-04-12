"use client";
import "./globals.css";
import Header from "@/components/Header/header";
import Body from "@/components/Body/body";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = window.location.origin + "/api/websocket";
    fetch(url)
      .then(() => setLoading(false))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-screen overflow-y-hidden flex flex-col items-center gap-2 pb-6 bg-black">
      {loading ? (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center">
          <p className="text-white text-2xl">Loading...</p>
        </div>
      ) : (
        <>
          <Header className="[&>*]:animate-fade-in-0.5" />
          <Body className="[&>*]:animate-fade-in-1">{children}</Body>
        </>
      )}
    </div>
  );
}
