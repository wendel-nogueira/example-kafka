import React from "react";

export interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function Body({ children, className }: BodyProps) {
  return (
    <main
      className={"w-full max-w-5xl h-full text-white" + className}
    >
      {children}
    </main>
  );
}
