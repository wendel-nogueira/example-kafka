import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={
        "w-full h-full flex flex-col gap-4 [&>*]:animate-fade-in-0.5 " +
        className
      }
    >
      {children}
    </div>
  );
}
