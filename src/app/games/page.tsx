"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BsArrowRight } from "react-icons/bs"
import { BiHeart } from "react-icons/bi"
import { FaGamepad } from "react-icons/fa"
import { FaChess, FaRegLightbulb } from "react-icons/fa"
import { GamePaymentModal } from "@/components/games/GamePaymentModal"

// Game data structure
interface Game {
    id: string
    name: string
    description: string
    image: string
    path: string
    players: string
    likes: number
    isPopular?: boolean
    isNew?: boolean
}

const GamesPage = () => {
    // State for payment modal
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Game data
    const featuredGames: Game[] = [
        {
            id: "chess",
            name: "Chess",
            description: "Classic Chess game with AI opponent",
            image: "/images/game/chess.jpeg",
            path: "/games/chess",
            players: "15K+ players",
            likes: 312,
            isPopular: true
        },
        {
            id: "tetris",
            name: "Tetris",
            description: "Arrange falling blocks to create complete lines",
            image: "/images/game/tetris.jpg",
            path: "/games/tetris",
            players: "12K+ players",
            likes: 278,
            isPopular: true
        },
        {
            id: "wordle",
            name: "Wodle",
            description: "Onchain game based on the popular word game - Wordle",
            image: "/images/game/wordle.jpg",
            path: "/games/wordle",
            players: "5K+ players",
            likes: 189
        },
        {
            id: "sudoku",
            name: "Sudoku",
            description: "Fill the grid with numbers following sudoku rules",
            image: "/images/game/sudoko.jpg",
            path: "/games/sudoku",
            players: "7K+ players",
            likes: 203
        },
        {
            id: "snake-ladder",
            name: "Snake & Ladder",
            description: "Classic board game of luck and strategy",
            image: "/images/game/snake.png",
            path: "/games/snake-ladder",
            players: "4K+ players",
            likes: 156,
            isNew: true
        },
        {
            id: "crypto-crossword",
            name: "Crypto Crossword",
            description: "Solve crossword puzzles with blockchain terminology",
            image: "/images/game/crossword.jpg",
            path: "/games/crypto-crossword",
            players: "2K+ players",
            likes: 98,
            isNew: true
        }
    ]

    // Handle play now button click
    const handlePlayNow = (game: Game) => {
        setSelectedGame(game)
        setIsModalOpen(true)
    }

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedGame(null)
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Updated with more modern design */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('/puzzle.jpg')] bg-cover bg-center"></div>
                <div className="container mx-auto px-4 py-20 relative z-20">
                    <div className="max-w-3xl">
                        <h1 className="text-white font-Agda text-5xl md:text-7xl uppercase mb-4 leading-tight">
                            Puzzle Games <span className="text-[#98ee2c]">Collection</span>
                        </h1>
                        <p className="text-white font-Outfit text-xl font-light mb-8 max-w-2xl">
                            Challenge your mind with our collection of strategy and puzzle games designed to sharpen your cognitive skills
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/event"
                                className="inline-flex items-center text-lg px-8 py-3 bg-white uppercase font-Agda font-bold text-black hover:bg-[#f0f0f0] transition-colors rounded-md"
                            >
                                Create Game Event
                                <BsArrowRight className="ml-2" />
                            </Link>
                            <Link
                                href="#featured"
                                className="inline-flex items-center text-lg px-8 py-3 bg-transparent border-2 border-white text-white uppercase font-Agda font-bold hover:bg-white/10 transition-colors rounded-md"
                            >
                                Explore Games
                                <BsArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Games Grid - Updated with new games */}
            <div id="featured" className="container mx-auto max-w-7xl px-4 py-16">
                <h2 className="text-4xl font-Agda text-white mb-2">Featured Games</h2>
                <p className="text-gray-400 mb-10">Our most popular brain-training games</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredGames.map((game) => (
                        <div key={game.id} className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                            <div className="relative">
                                <Image
                                    src={game.image}
                                    alt={game.name}
                                    width={500}
                                    height={300}
                                    className="w-full h-60 object-cover"
                                />
                                {(game.isPopular || game.isNew) && (
                                    <div className={`absolute top-2 right-2 ${game.isNew ? 'bg-[#ff6b6b] text-white' : 'bg-[#98ee2c] text-black'} px-2 py-1 rounded text-sm font-bold`}>
                                        {game.isNew ? 'New' : 'Popular'}
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-white">{game.name}</h3>
                                    <div className="flex items-center text-gray-400">
                                        <BiHeart className="mr-1" />
                                        <span>{game.likes}</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4">{game.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <FaGamepad className="mr-1" />
                                        <span>{game.players}</span>
                                    </div>
                                    <button
                                        onClick={() => handlePlayNow(game)}
                                        className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                    >
                                        Play Now
                                        <BsArrowRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Game Benefits Section - New section */}
            <div className="bg-[#151515] py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-Agda text-white mb-12 text-center">Benefits of Puzzle Games</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#202020] p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-[#98ee2c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#98ee2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Enhanced Problem-Solving</h3>
                            <p className="text-gray-400">Puzzle games challenge players to think critically and develop strategies.</p>
                        </div>

                        <div className="bg-[#202020] p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-[#98ee2c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#98ee2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Cognitive Skill Development</h3>
                            <p className="text-gray-400">Regular gameplay can enhance memory, attention, and logical reasoning.</p>
                        </div>

                        <div className="bg-[#202020] p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-[#98ee2c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#98ee2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Stress Relief</h3>
                            <p className="text-gray-400">Engaging in puzzle games can provide a mental break and reduce stress.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Games Section - Updated with Puzzle Games */}
            <div className="container mx-auto px-4 py-16 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-Agda text-white">Coming Soon</h2>
                    <Link
                        href="/games/#"
                        className="text-[#98ee2c] hover:text-[#7bc922] flex items-center"
                    >
                        View all upcoming games
                        <BsArrowRight className="ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upcoming Game 1 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden border border-gray-700 p-6 flex items-center group hover:border-[#98ee2c] transition-all duration-300">
                        <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center mr-6 group-hover:bg-[#98ee2c]/20 transition-all duration-300">
                            <FaGamepad className="text-[#98ee2c] text-4xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Multi player Games</h3>
                            <p className="text-gray-400 mb-3">Test your logic and reasoning skills with Sudoku puzzles.</p>
                            <div className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                                Release: Q2 2025
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Game 2 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden border border-gray-700 p-6 flex items-center group hover:border-[#98ee2c] transition-all duration-300">
                        <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center mr-6 group-hover:bg-[#98ee2c]/20 transition-all duration-300">
                            <FaGamepad className="text-[#98ee2c] text-4xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Market Puzzle Game</h3>
                            <p className="text-gray-400 mb-3">Dive into a fun and challenging puzzle game where you match market items to complete transactions and build your virtual marketplace.</p>
                            <div className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                                Release: Q2 2025
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action - New section */}
            <div className="bg-gradient-to-r from-[#202020] to-[#151515] py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-Agda text-white mb-4">Ready to Challenge Your Mind?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of players improving their cognitive skills while having fun with our collection of puzzle games.
                    </p>
                    <Link
                        href="#featured"
                        className="inline-flex items-center text-lg px-8 py-3 bg-[#98ee2c] text-black uppercase font-Agda font-bold hover:bg-[#7bc922] transition-colors rounded-md"
                    >
                        Start Playing Now
                        <BsArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedGame && (
                <GamePaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    gamePath={selectedGame.path}
                    gameName={selectedGame.name}
                />
            )}
        </div>
    )
}

export default GamesPage
