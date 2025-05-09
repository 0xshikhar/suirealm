"use client"

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AIToolCard from "@/components/ai-tools/tool-card";
import RequestCustomTool from "@/components/ai-tools/request-custom-tool";

// Icons for the tools
import {
  UserCircle,
  BookOpen,
  Wand2,
  Bug,
  LayoutGrid,
  Image,
} from "lucide-react";

const AIToolsPage = () => {
  const tools = [
    {
      id: "character-creator",
      title: "Character Creator",
      icon: <UserCircle className="w-10 h-10 text-purple-400" />,
      description: "Create game characters with customizable abilities and personalities.",
      color: "from-purple-500/20 to-purple-800/20",
      iconBg: "bg-purple-800/50",
    },
    {
      id: "level-generator",
      title: "Level Generator",
      icon: <LayoutGrid className="w-10 h-10 text-blue-400" />,
      description: "Generate game levels with custom themes and difficulty settings",
      color: "from-blue-500/20 to-blue-800/20",
      iconBg: "bg-blue-800/50",
    },
    {
      id: "tutorial-builder",
      title: "Tutorial Builder",
      icon: <BookOpen className="w-10 h-10 text-green-400" />,
      description: "Generate comprehensive game tutorials from your code",
      color: "from-green-500/20 to-green-800/20",
      iconBg: "bg-green-800/50",
    },
    {
      id: "game-debugger",
      title: "Game Debugger",
      icon: <Bug className="w-10 h-10 text-red-400" />,
      description: "Find and fix bugs in your game code with AI assistance",
      color: "from-red-500/20 to-red-800/20",
      iconBg: "bg-red-800/50",
    },
    {
      id: "game-enhancer",
      title: "Game Enhancer",
      icon: <Wand2 className="w-10 h-10 text-amber-400" />,
      description: "Improve graphics, gameplay, and performance of existing games.",
      color: "from-amber-500/20 to-amber-800/20",
      iconBg: "bg-amber-800/50",
    },
    {
      id: "asset-generator",
      title: "Asset Generator",
      icon: <Image className="w-10 h-10 text-teal-400" />,
      description: "Create game assets including sprites, backgrounds, and sound effects.",
      color: "from-teal-500/20 to-teal-800/20",
      iconBg: "bg-teal-800/50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Tools</h1>
          <p className="text-gray-400 text-lg">
            Enhance your game development with our suite of AI-powered tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <AIToolCard key={tool.id} {...tool} />
          ))}
        </div>

        {/* Request Custom Tool Section */}
        <RequestCustomTool />
      </div>
    </div>
  );
};

export default AIToolsPage;
