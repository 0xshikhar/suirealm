"use client"

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AIToolCard from "@/components/ai-tools/tool-card";
import RequestCustomTool from "@/components/ai-tools/request-custom-tool";
import { useRouter } from "next/navigation";

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
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Character Creator
    characterName: "",
    gameType: "rpg",
    personality: "",
    abilities: "",
    background: "",
    
    // Level Generator
    theme: "fantasy",
    difficulty: "medium",
    elements: "",
    objectives: "",
    
    // Generic fields for other tools
    codeInput: "",
    description: "",
    target: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleToolClick = (id: string) => {
    setActiveToolId(id);
    setShowDialog(true);
    setResult(null);
  };
  
  const closeDialog = () => {
    setShowDialog(false);
    setActiveToolId(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      let generatedResult = "";
      
      // Generate different results based on the active tool
      switch (activeToolId) {
        case "character-creator":
          generatedResult = `
            <h3>${formData.characterName}</h3>
            <hr/>
            <h4>Physical Appearance</h4>
            <p>A tall, imposing figure with glowing cyan eyes and battle-worn armor that has seen countless conflicts. ${formData.characterName}'s design incorporates elements of futuristic technology with ancient warrior aesthetics.</p>
            
            <h4>Personality</h4>
            <p>${formData.personality || 'Strategic and calculating, but with a strong moral code that guides all decisions. Values loyalty above all else and never leaves allies behind.'}</p>
            
            <h4>Abilities & Skills</h4>
            <ul>
              <li><strong>Tactical Mastery:</strong> Can analyze battlefield conditions and provide combat bonuses to allies</li>
              <li><strong>Energy Projection:</strong> Channels powerful energy blasts from specialized gauntlets</li>
              <li><strong>Adaptive Shield:</strong> Force field that adapts to different types of attacks</li>
              ${formData.abilities ? `<li><strong>Custom Abilities:</strong> ${formData.abilities}</li>` : ''}
            </ul>
            
            <h4>Background</h4>
            <p>${formData.background || 'Once a decorated general who was betrayed by their own government, now seeking redemption while helping those who cannot help themselves. Has a mysterious connection to ancient technology that grants enhanced abilities.'}</p>
            
            <h4>Role in Game</h4>
            <p>Ideal as a ${formData.gameType === 'rpg' ? 'versatile support character with leadership abilities' :
              formData.gameType === 'strategy' ? 'commander unit with area-of-effect buffs' :
                formData.gameType === 'action' ? 'balanced fighter with special abilities' :
                  'adaptable character suitable for various gameplay styles'}.</p>
          `;
          break;
          
        case "level-generator":
          generatedResult = `
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
          break;
          
        case "tutorial-builder":
          generatedResult = `
            <h3>Generated Tutorial</h3>
            <hr/>
            <h4>Getting Started</h4>
            <p>This tutorial will guide you through the key components of your game.</p>
            
            <h4>Step 1: Setup</h4>
            <pre class="bg-gray-900 p-4 rounded text-gray-300 overflow-auto">
// Initialize the game environment
const game = new GameEngine();
game.init();
            </pre>
            
            <h4>Step 2: Adding Player Controls</h4>
            <pre class="bg-gray-900 p-4 rounded text-gray-300 overflow-auto">
// Player movement controls
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp': player.move('up'); break;
    case 'ArrowDown': player.move('down'); break;
    case 'ArrowLeft': player.move('left'); break;
    case 'ArrowRight': player.move('right'); break;
  }
});
            </pre>
            
            <h4>Step 3: Game Loop</h4>
            <pre class="bg-gray-900 p-4 rounded text-gray-300 overflow-auto">
// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
            </pre>
          `;
          break;
          
        case "game-debugger":
          generatedResult = `
            <h3>Debugging Results</h3>
            <hr/>
            <h4>Issues Found</h4>
            <ul>
              <li class="text-red-400"><strong>Infinite Loop:</strong> In function <code>updateGameState()</code> at line 47</li>
              <li class="text-yellow-400"><strong>Memory Leak:</strong> Event listeners not being removed in <code>componentWillUnmount</code></li>
              <li class="text-orange-400"><strong>Performance Issue:</strong> Excessive DOM manipulation in render loop</li>
            </ul>
            
            <h4>Recommended Fixes</h4>
            <pre class="bg-gray-900 p-4 rounded text-gray-300 overflow-auto">
// Fix for infinite loop
function updateGameState() {
  if (gameState.isRunning) { // Add condition to prevent infinite loop
    // Update game logic here
    
    // Make sure to have a termination condition
    if (gameState.score >= MAX_SCORE) {
      gameState.isRunning = false;
    }
  }
}
            </pre>
          `;
          break;
          
        case "game-enhancer":
          generatedResult = `
            <h3>Game Enhancement Suggestions</h3>
            <hr/>
            <h4>Graphics Improvements</h4>
            <ul>
              <li><strong>Lighting Effects:</strong> Add dynamic lighting to create mood and atmosphere</li>
              <li><strong>Particle Systems:</strong> Implement particles for explosions, magic effects, etc.</li>
              <li><strong>Post-Processing:</strong> Add bloom, color grading, and motion blur</li>
            </ul>
            
            <h4>Performance Optimizations</h4>
            <pre class="bg-gray-900 p-4 rounded text-gray-300 overflow-auto">
// Implement object pooling for frequently created/destroyed objects
class ObjectPool {
  constructor(objectType, initialSize) {
    this.objectType = objectType;
    this.pool = [];
    
    // Initialize pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new objectType());
    }
  }
  
  get() {
    // Get object from pool or create new if pool is empty
    return this.pool.pop() || new this.objectType();
  }
  
  release(object) {
    // Return object to pool
    this.pool.push(object);
  }
}
            </pre>
          `;
          break;
          
        case "asset-generator":
          generatedResult = `
            <h3>Generated Game Assets</h3>
            <hr/>
            <h4>Sprite Sheet</h4>
            <div class="bg-gray-800 p-4 rounded-lg mb-4">
              <div class="grid grid-cols-4 gap-2">
                <div class="bg-blue-500 h-16 w-16 rounded-lg flex items-center justify-center text-xs">Frame 1</div>
                <div class="bg-blue-500 h-16 w-16 rounded-lg flex items-center justify-center text-xs">Frame 2</div>
                <div class="bg-blue-500 h-16 w-16 rounded-lg flex items-center justify-center text-xs">Frame 3</div>
                <div class="bg-blue-500 h-16 w-16 rounded-lg flex items-center justify-center text-xs">Frame 4</div>
              </div>
            </div>
            
            <h4>Background</h4>
            <div class="bg-gradient-to-r from-indigo-900 to-purple-900 h-32 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-white text-opacity-50">Generated Background Preview</span>
            </div>
            
            <h4>Sound Effects</h4>
            <ul>
              <li><strong>Jump Sound:</strong> Short, bouncy synthesized effect</li>
              <li><strong>Explosion:</strong> Low frequency boom with particle decay</li>
              <li><strong>Power-up:</strong> Ascending musical scale with sparkle effect</li>
            </ul>
          `;
          break;
          
        default:
          generatedResult = "<p>No content generated. Please try again.</p>";
      }
      
      setResult(generatedResult);
      setLoading(false);
    }, 1500);
  };
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
            <AIToolCard 
              key={tool.id} 
              {...tool} 
              onClick={() => handleToolClick(tool.id)} 
            />
          ))}
        </div>

        {/* Request Custom Tool Section */}
        <RequestCustomTool />
      </div>

      {/* Tool Dialog */}
      {showDialog && activeToolId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-6xl w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {tools.find(tool => tool.id === activeToolId)?.title || "AI Tool"}
              </h2>
              <button 
                onClick={closeDialog}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              {/* Form Section */}
              <div className="p-6 border-r border-gray-700 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Render different form inputs based on the active tool */}
                  {activeToolId === "character-creator" && (
                    <>
                      <div>
                        <label htmlFor="characterName" className="block text-sm font-medium text-gray-300 mb-1">
                          Character Name
                        </label>
                        <input
                          type="text"
                          id="characterName"
                          name="characterName"
                          value={formData.characterName}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[80px]"
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
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[80px]"
                          placeholder="Optional backstory or context for the character"
                        />
                      </div>
                    </>
                  )}

                  {activeToolId === "level-generator" && (
                    <>
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
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                          placeholder="Describe the objectives for this level"
                        />
                      </div>
                    </>
                  )}

                  {activeToolId === "tutorial-builder" && (
                    <>
                      <div>
                        <label htmlFor="codeInput" className="block text-sm font-medium text-gray-300 mb-1">
                          Game Code
                        </label>
                        <textarea
                          id="codeInput"
                          name="codeInput"
                          value={formData.codeInput}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px] font-mono"
                          placeholder="Paste your game code here..."
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-1">
                          Target Audience
                        </label>
                        <select
                          id="target"
                          name="target"
                          value={formData.target}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeToolId === "game-debugger" && (
                    <>
                      <div>
                        <label htmlFor="codeInput" className="block text-sm font-medium text-gray-300 mb-1">
                          Code to Debug
                        </label>
                        <textarea
                          id="codeInput"
                          name="codeInput"
                          value={formData.codeInput}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[200px] font-mono"
                          placeholder="Paste the code with bugs here..."
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                          Issue Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[80px]"
                          placeholder="Describe the issue you're experiencing..."
                          required
                        />
                      </div>
                    </>
                  )}

                  {activeToolId === "game-enhancer" && (
                    <>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                          Game Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[80px]"
                          placeholder="Describe your game and what you want to enhance..."
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="codeInput" className="block text-sm font-medium text-gray-300 mb-1">
                          Game Code (Optional)
                        </label>
                        <textarea
                          id="codeInput"
                          name="codeInput"
                          value={formData.codeInput}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[150px] font-mono"
                          placeholder="Paste relevant game code here..."
                        />
                      </div>
                    </>
                  )}

                  {activeToolId === "asset-generator" && (
                    <>
                      <div>
                        <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-1">
                          Asset Type
                        </label>
                        <select
                          id="target"
                          name="target"
                          value={formData.target}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="sprite">Character Sprite</option>
                          <option value="background">Background</option>
                          <option value="ui">UI Elements</option>
                          <option value="sound">Sound Effects</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1">
                          Theme
                        </label>
                        <select
                          id="theme"
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="fantasy">Fantasy</option>
                          <option value="sci-fi">Sci-Fi</option>
                          <option value="post-apocalyptic">Post-Apocalyptic</option>
                          <option value="medieval">Medieval</option>
                          <option value="cyberpunk">Cyberpunk</option>
                          <option value="pixel-art">Pixel Art</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[80px]"
                          placeholder="Describe the asset you want to generate..."
                          required
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#98ee2c] hover:bg-[#8de01f] text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center mt-6"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Generate ${tools.find(tool => tool.id === activeToolId)?.title.split(' ')[0] || "Result"}`
                    )}
                  </button>
                </form>
              </div>

              {/* Result Section */}
              <div className="p-6 bg-gray-900/50 overflow-y-auto max-h-[70vh] md:max-h-none">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="h-6 w-6 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">AI</span>
                  </span>
                  Result
                </h3>

                {result ? (
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-gray-400 mb-2">Ready to Generate</h4>
                    <p className="text-gray-500">
                      Fill out the form and click generate to create your content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIToolsPage;
