"use client"

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const LevelGeneratorPage = () => {
  const [formData, setFormData] = useState({
    theme: "fantasy",
    difficulty: "medium",
    elements: "",
    objectives: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // For demo purposes, simulate API call with timeout
    setTimeout(() => {
      const result = `
        <h3>${formData.theme} Level - ${formData.difficulty} Difficulty</h3>
        <hr/>
        <h4>Level Layout</h4>
        <p>A detailed ${formData.theme} environment with multiple pathways and hidden areas. The difficulty is calibrated for ${formData.difficulty} players.</p>
        
        <h4>Key Elements</h4>
        <ul>
          <li>Central hub area with 4 branching paths</li>
          <li>Progressive difficulty scaling</li>
          <li>Hidden bonus areas for exploration</li>
          ${formData.elements ? `<li>${formData.elements}</li>` : ''}
        </ul>
        
        <h4>Objectives</h4>
        <p>${formData.objectives || 'Primary objective is to reach the end while collecting key items. Secondary objectives include defeating mini-bosses and finding all hidden areas.'}</p>
        
        <h4>Level Preview</h4>
        <div style="border: 1px solid #444; padding: 10px; border-radius: 5px; background-color: rgba(0,0,0,0.2);">
          <p style="font-family: monospace; white-space: pre;">
           ┌─────────────────────┐
           │      START HERE     │
           │         ↓           │
           │     [Main Hub]      │
           │    ↙   ↓    ↘       │
           │ [Area1] [Area2] [Area3]
           │    ↓      ↓      ↓   │
           │ [Secret] [Boss] [Loot]
           │    ↘      ↓      ↙   │
           │       [FINISH]       │
           └─────────────────────┘
          </p>
        </div>
      `;

      setGenerationResult(result);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ai-tools"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to AI Tools</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Level Generator</h1>
          <p className="text-gray-400 text-lg">
            Generate game levels with custom themes and difficulty settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-800/30 rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1">
                  Level Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="post-apocalyptic">Post-Apocalyptic</option>
                  <option value="medieval">Medieval</option>
                  <option value="cyberpunk">Cyberpunk</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label htmlFor="elements" className="block text-sm font-medium text-gray-300 mb-1">
                  Key Elements (Optional)
                </label>
                <input
                  type="text"
                  id="elements"
                  name="elements"
                  value={formData.elements}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Secret rooms, traps, puzzles"
                />
              </div>

              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-300 mb-1">
                  Level Objectives (Optional)
                </label>
                <textarea
                  id="objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                  placeholder="Describe the objectives for this level"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-[#98ee2c] hover:bg-[#8de01f] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Level...
                  </>
                ) : "Generate Level"}
              </button>
            </form>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-800/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="h-6 w-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </span>
              Level Result
            </h2>

            {generationResult ? (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: generationResult }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 bg-blue-900/40 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Level Generated Yet</h3>
                <p className="text-gray-500">
                  Fill out the form and click &quot;Generate Level&quot; to create a new game level.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LevelGeneratorPage;
