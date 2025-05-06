"use client"

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

interface ConditionalNavigationProps {
  children: React.ReactNode;
}

export default function ConditionalNavigation({ children }: ConditionalNavigationProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isHomePage ? (
        <>
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </>
      ) : (
        <>
          <Sidebar />
          <main className={`flex-1 relative z-10 transition-all duration-300 ${isMobile ? 'px-4 pt-16' : 'md:ml-72 px-6 py-6'}`}>
            {children}
          </main>
        </>
      )}
    </div>
  );
}
