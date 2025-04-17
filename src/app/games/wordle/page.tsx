"use client"

import React from 'react';
import { WordleGame } from '@/components/wordle-game';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';
import gameWords from '@/data/words.json';
import validWords from '@/data/validWords.json';

// For now, we'll use placeholder data
// const gameWords = [
//     "apple", "beach", "chair", "dance", "eagle", "flame", "ghost", "heart", "igloo", "joker",
//     "knife", "lemon", "music", "night", "ocean", "piano", "queen", "river", "snake", "tiger",
//     "umbra", "voice", "water", "xenon", "yacht", "zebra", "brave", "cloud", "dream", "earth"
// ];
// const validWords = [
//  
//     ...gameWords,
//     "about", "above", "abuse", "actor", "adapt", "admit", "adopt", "adult", "after", "again",
//     "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone",
//     "along", "alter", "among", "anger", "angle", "angry", "ankle", "apart", "apple", "apply"
// ];

export default function WordlePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/games"
                    className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
                >
                    <BsArrowLeft className="mr-2" /> Back to Games
                </Link>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">Wordle Game</h1>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <WordleGame />
                    </div>
                </div>
            </div>
        </div>
    );
}