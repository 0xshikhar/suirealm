"use client"

import React from "react";
import { usePathname } from "next/navigation";

export default function AIToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRootPage = pathname === "/ai-tools";

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-black ${isRootPage ? "" : "pt-0"}`}>
      {children}
    </div>
  );
}
