"use client"

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}

const AIToolCard: React.FC<AIToolCardProps> = ({
  id,
  title,
  description,
  icon,
  color,
  iconBg,
}) => {
  const handleUseTool = (toolId: string) => {
    // Handle tool usage - can be expanded to integrate with OpenAI
    console.log(`Using tool: ${toolId}`);
    // Future implementation will call OpenAI APIs
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-gradient-to-br",
        color,
        "border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl"
      )}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start mb-4">
          <div className={cn("p-3 rounded-lg", iconBg)}>
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        
        <p className="text-gray-300 mb-6 flex-grow">
          {description}
        </p>
        
        <button
          onClick={() => handleUseTool(id)}
          className="w-full py-2.5 px-4 bg-[#98ee2c] hover:bg-[#8de01f] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          Use Tool
        </button>
      </div>
    </motion.div>
  );
};

export default AIToolCard;
