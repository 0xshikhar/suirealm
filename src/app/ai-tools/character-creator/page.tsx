"use client"

import React, { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { openai } from "@/lib/openai";

const CharacterCreatorPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    gameType: "rpg",
    personality: "",
    abilities: "",
    background: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [characterResult, setCharacterResult] = useState<string | null>(null);

  // Inline implementation of character generation
  const generateCharacter = useCallback(async (params: {
    name: string;
    gameType: string;
    personality?: string;
    abilities?: string;
    background?: string;
  }) => {
    // This is a mock implementation that would normally use OpenAI
    // In a real implementation, this would use the OpenAI client

    // Mock response for demonstration purposes
    const mockResponse = `
      <h3>${params.name}</h3>
      <hr/>
      <h4>Physical Appearance</h4>
      <p>A tall, imposing figure with glowing cyan eyes and battle-worn armor that has seen countless conflicts. ${params.name}'s design incorporates elements of futuristic technology with ancient warrior aesthetics.</p>
      
      <h4>Personality</h4>
      <p>${params.personality || 'Strategic and calculating, but with a strong moral code that guides all decisions. Values loyalty above all else and never leaves allies behind.'}</p>
      
      <h4>Abilities & Skills</h4>
      <ul>
        <li><strong>Tactical Mastery:</strong> Can analyze battlefield conditions and provide combat bonuses to allies</li>
        <li><strong>Energy Projection:</strong> Channels powerful energy blasts from specialized gauntlets</li>
        <li><strong>Adaptive Shield:</strong> Force field that adapts to different types of attacks</li>
        ${params.abilities ? `<li><strong>Custom Abilities:</strong> ${params.abilities}</li>` : ''}
      </ul>
      
      <h4>Background</h4>
      <p>${params.background || 'Once a decorated general who was betrayed by their own government, now seeking redemption while helping those who cannot help themselves. Has a mysterious connection to ancient technology that grants enhanced abilities.'}</p>
      
      <h4>Role in Game</h4>
      <p>Ideal as a ${params.gameType === 'rpg' ? 'versatile support character with leadership abilities' :
        params.gameType === 'strategy' ? 'commander unit with area-of-effect buffs' :
          params.gameType === 'action' ? 'balanced fighter with special abilities' :
            'adaptable character suitable for various gameplay styles'}.</p>
      
      <h4>Suggested Stats</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <th style="text-align:left; padding:5px; border:1px solid #444;">Attribute</th>
          <th style="text-align:left; padding:5px; border:1px solid #444;">Value</th>
        </tr>
        <tr>
          <td style="padding:5px; border:1px solid #444;">Strength</td>
          <td style="padding:5px; border:1px solid #444;">7/10</td>
        </tr>
        <tr>
          <td style="padding:5px; border:1px solid #444;">Intelligence</td>
          <td style="padding:5px; border:1px solid #444;">9/10</td>
        </tr>
        <tr>
          <td style="padding:5px; border:1px solid #444;">Agility</td>
          <td style="padding:5px; border:1px solid #444;">6/10</td>
        </tr>
        <tr>
          <td style="padding:5px; border:1px solid #444;">Charisma</td>
          <td style="padding:5px; border:1px solid #444;">8/10</td>
        </tr>
      </table>
    `;

    return mockResponse;
  }, []);

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

    try {
      const result = await generateCharacter({
        name: formData.name,
        gameType: formData.gameType,
        personality: formData.personality,
        abilities: formData.abilities,
        background: formData.background,
      });

      setCharacterResult(result);
    } catch (error) {
      console.error("Error generating character:", error);
    } finally {
      setIsGenerating(false);
    }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Character Creator</h1>
          <p className="text-gray-400 text-lg">
            Create game characters with customizable abilities and personalities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-800/30 rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g. Commander Zara"
                  required
                />
              </div>

              <div>
                <label htmlFor="gameType" className="block text-sm font-medium text-gray-300 mb-1">
                  Game Type
                </label>
                <select
                  id="gameType"
                  name="gameType"
                  value={formData.gameType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="rpg">RPG</option>
                  <option value="strategy">Strategy</option>
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="simulation">Simulation</option>
                </select>
              </div>

              <div>
                <label htmlFor="personality" className="block text-sm font-medium text-gray-300 mb-1">
                  Personality Traits
                </label>
                <input
                  type="text"
                  id="personality"
                  name="personality"
                  value={formData.personality}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g. Brave, Strategic, Impulsive"
                />
              </div>

              <div>
                <label htmlFor="abilities" className="block text-sm font-medium text-gray-300 mb-1">
                  Abilities
                </label>
                <textarea
                  id="abilities"
                  name="abilities"
                  value={formData.abilities}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px]"
                  placeholder="Describe the character's abilities or skills"
                />
              </div>

              <div>
                <label htmlFor="background" className="block text-sm font-medium text-gray-300 mb-1">
                  Background (Optional)
                </label>
                <textarea
                  id="background"
                  name="background"
                  value={formData.background}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                  placeholder="Optional backstory or context for the character"
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
                    Generating Character...
                  </>
                ) : "Generate Character"}
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
              <span className="h-6 w-6 bg-purple-500 rounded-full mr-2 flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </span>
              Character Result
            </h2>

            {characterResult ? (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: characterResult }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 bg-purple-900/40 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Character Generated Yet</h3>
                <p className="text-gray-500">
                  Fill out the form and click &quot;Generate Character&quot; to create a new game character.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreatorPage;
