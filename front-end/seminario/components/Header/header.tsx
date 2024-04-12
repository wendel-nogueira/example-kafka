"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [linkActive, setLinkActive] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== null) setLinkActive(pathname);
  }, [pathname]);

  return (
    <header
      className={
        "w-full my-4 flex items-center justify-center px-6 text-xl font-serif font-semibold text-gray-200 [&>*]:transition-colors [&>*]:duration-300 " +
        className
      }
    >
      <nav>
        <ul className="flex items-center gap-12 [&>*]transition-colors [&>*]:duration-300">
          <li
            className={`hover:text-blue-500 ${
              linkActive === "/calculate" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/calculate">calculate</Link>
          </li>
          <li
            className={`hover:text-blue-500 ${
              linkActive === "/file" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/file">file</Link>
          </li>{" "}
          <li
            className={`hover:text-blue-500 ${
              linkActive === "/message" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/message">message</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
