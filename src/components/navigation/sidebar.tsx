"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { User, Home, Layout, Gamepad2, Calendar, Zap, Trophy, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectButton, useWallet } from '@suiet/wallet-kit'

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, connected, disconnect } = useWallet();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "Dashboard", icon: <Layout size={20} />, path: "/dashboard" },
    { name: "Games", icon: <Gamepad2 size={20} />, path: "/games" },
    { name: "AI Tools", icon: <Sparkles size={20} />, path: "/ai-tools" },
    { name: "Events", icon: <Calendar size={20} />, path: "/events" },
    { name: "Tournaments", icon: <Trophy size={20} />, path: "/tournaments" },
    { name: "Mint Profile", icon: <User size={20} />, path: "/nft" },
    { name: "Profile", icon: <User size={20} />, path: "/profile" },
    { name: "Token", icon: <Zap size={20} />, path: "/token" }
  ];

  // Desktop sidebar view
  const DesktopSidebar = () => (
    <div className="h-screen w-72 bg-gradient-to-b from-gray-900 to-black fixed left-0 top-0 z-40 flex flex-col shadow-xl border-r border-gray-800/50">
      {/* Logo */}
      <Link href="/" className="flex items-center p-6 border-b border-gray-800/50">
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl mr-3">
          <Image src="/core.png" alt="SuiRealm" width={32} height={32} className="rounded-lg" />
        </div>
        <div className="text-[26px] text-white font-bold">
          SuiRealm
        </div>
      </Link>

      {/* Menu Items */}
      <div className="flex flex-col p-4 flex-grow overflow-y-auto custom-scrollbar">
        <div className="mb-6 mt-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Main</h3>
          {menuItems.slice(0, 3).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                pathname === item.path
                  ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                  : "hover:bg-gray-800/40"
              )}
            >
              <div className={cn(
                "mr-3 p-2 rounded-lg transition-all duration-200",
                pathname === item.path
                  ? "bg-[#98ee2c] text-white"
                  : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Gaming</h3>
          {menuItems.slice(3, 5).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                pathname === item.path
                  ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                  : "hover:bg-gray-800/40"
              )}
            >
              <div className={cn(
                "mr-3 p-2 rounded-lg transition-all duration-200",
                pathname === item.path
                  ? "bg-[#98ee2c] text-white"
                  : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Account</h3>
          {menuItems.slice(5).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                pathname === item.path
                  ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                  : "hover:bg-gray-800/40"
              )}
            >
              <div className={cn(
                "mr-3 p-2 rounded-lg transition-all duration-200",
                pathname === item.path
                  ? "bg-[#98ee2c] text-white"
                  : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Wallet Section */}
      <div className="p-5 border-t border-gray-800/50 bg-gray-900/50">
        {connected ? (
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="h-10 w-10 bg-[#98ee2c] rounded-full flex items-center justify-center text-white font-bold">
              {address?.slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <div className="text-xs text-gray-400">Connected</div>
            </div>
            <button
              onClick={() => disconnect?.()}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-700/50"
              title="Disconnect Wallet"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-full">
            <ConnectButton className="w-full bg-green-600">Connect Wallet</ConnectButton>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile sidebar + toggle button
  const MobileSidebar = () => (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-green-600 p-3 rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300"
      >
        {sidebarOpen ?
          <AiOutlineClose className="text-white text-xl" /> :
          <AiOutlineMenu className="text-white text-xl" />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "h-screen w-full max-w-[280px] bg-gradient-to-b from-gray-900 to-black fixed left-0 top-0 z-50 flex flex-col shadow-2xl transition-transform duration-300 border-r border-gray-800/50",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="relative p-6 border-b border-gray-800/50 flex items-center">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl mr-3">
            <Image src="/core.png" alt="SuiRealm" width={28} height={28} className="rounded-lg" />
          </div>
          <div className="text-[22px] text-white font-bold">
            SuiRealm
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col p-3 flex-grow overflow-y-auto custom-scrollbar">
          <div className="mb-6 mt-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Main</h3>
            {menuItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                  pathname === item.path
                    ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                    : "hover:bg-gray-800/40"
                )}
              >
                <div className={cn(
                  "mr-3 p-2 rounded-lg transition-all duration-200",
                  pathname === item.path
                    ? "bg-[#98ee2c] text-white"
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Gaming</h3>
            {menuItems.slice(3, 5).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                  pathname === item.path
                    ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                    : "hover:bg-gray-800/40"
                )}
              >
                <div className={cn(
                  "mr-3 p-2 rounded-lg transition-all duration-200",
                  pathname === item.path
                    ? "bg-[#98ee2c] text-white"
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Account</h3>
            {menuItems.slice(5).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center text-gray-400 hover:text-white px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                  pathname === item.path
                    ? "bg-gradient-to-r from-green-500/20 to-green-500/5 text-white border-l-2 border-green-500"
                    : "hover:bg-gray-800/40"
                )}
              >
                <div className={cn(
                  "mr-3 p-2 rounded-lg transition-all duration-200",
                  pathname === item.path
                    ? "bg-[#98ee2c] text-white"
                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
                )}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Wallet Section */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
          {connected ? (
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
              <div className="h-10 w-10 bg-[#98ee2c] rounded-full flex items-center justify-center text-white font-bold">
                {address?.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white font-medium">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <div className="text-xs text-gray-400">Connected</div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ConnectButton>Connect Wallet</ConnectButton>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;
