"use client"
import React, { useContext } from 'react';
import { GameContext } from './WordleContext';
import { LetterState } from './WordleTypes';

// Board Tile Component
export const BoardTile: React.FC<{ letter: string; state: LetterState }> = ({ letter, state }) => {
    const getBackgroundColor = () => {
        switch (state) {
            case 'correct': return 'bg-green-500 dark:bg-green-600';
            case 'present': return 'bg-yellow-500 dark:bg-yellow-600';
            case 'absent': return 'bg-gray-400 dark:bg-gray-600';
            default: return 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700';
        }
    };

    const getFontColor = () => {
        if (state === 'empty') return 'text-gray-900 dark:text-gray-100';
        return 'text-white';
    };

    return (
        <div
            className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-2xl md:text-3xl font-bold rounded-md
            transition-all duration-500 ${getBackgroundColor()} ${getFontColor()}`}
        >
            {letter.toUpperCase()}
        </div>
    );
};

// Game Board Component
export const GameBoard: React.FC = () => {
    const { gameState } = useContext(GameContext);

    return (
        <div className="mb-8">
            {Array(6).fill(null).map((_, rowIndex) => {
                const guess = gameState.guesses[rowIndex] || '';
                const isCurrentRow = rowIndex === gameState.currentRow;

                return (
                    <div key={rowIndex} className="flex justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                        {Array(5).fill(null).map((_, colIndex) => {
                            let letter = '';
                            let state: LetterState = 'empty';

                            if (rowIndex < gameState.currentRow) {
                                letter = guess[colIndex] || '';
                                const targetLetter = gameState.dailyWord[colIndex];

                                if (letter === targetLetter) {
                                    state = 'correct';
                                } else if (gameState.dailyWord.includes(letter)) {
                                    state = 'present';
                                } else {
                                    state = 'absent';
                                }
                            } else if (isCurrentRow) {
                                letter = gameState.currentGuess[colIndex] || '';
                            }

                            return <BoardTile key={colIndex} letter={letter} state={state} />;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

// Keyboard Component
export const Keyboard: React.FC = () => {
    const { gameState, handleKeyPress } = useContext(GameContext);

    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
    ];

    const getKeyState = (key: string): LetterState => {
        if (key === 'enter' || key === 'backspace') return 'empty';
        return gameState.usedKeys[key] || 'empty';
    };

    const getKeyBackground = (key: string) => {
        const state = getKeyState(key);
        switch (state) {
            case 'correct': return 'bg-green-500 hover:bg-green-600 text-white';
            case 'present': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
            case 'absent': return 'bg-gray-400 hover:bg-gray-500 text-white dark:bg-gray-600 dark:hover:bg-gray-700';
            default: return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200';
        }
    };

    return (
        <div className="w-full max-w-md mx-auto md:max-w-lg">
            {keyboard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                    {row.map((key) => {
                        const isSpecialKey = key === 'enter' || key === 'backspace';
                        const width = isSpecialKey ? 'w-16 md:w-20' : 'w-8 md:w-12';
                        const displayText = key === 'backspace' ? '⌫' : key.toUpperCase();

                        return (
                            <button
                                key={key}
                                onClick={() => handleKeyPress(key)}
                                className={`${width} h-12 md:h-14 rounded-md font-medium transition-colors ${getKeyBackground(key)}`}
                                aria-label={key}
                            >
                                {displayText}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// Stats Display Component
export const StatsDisplay: React.FC = () => {
    const { userStats, resetGame } = useContext(GameContext);

    const winPercentage = userStats.gamesPlayed > 0
        ? Math.round((userStats.gamesWon / userStats.gamesPlayed) * 100)
        : 0;

    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">{userStats.gamesPlayed}</span>
                    <span className="text-xs md:text-sm">Played</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">{winPercentage}</span>
                    <span className="text-xs md:text-sm">Win %</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">{userStats.currentStreak}</span>
                    <span className="text-xs md:text-sm">Current</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">{userStats.maxStreak}</span>
                    <span className="text-xs md:text-sm">Max</span>
                </div>
            </div>

            <h3 className="font-bold mb-2">Guess Distribution</h3>
            <div className="space-y-1 mb-6">
                {userStats.guessDistribution.map((count, index) => {
                    const percentage = userStats.gamesWon > 0
                        ? Math.max(10, Math.round((count / userStats.gamesWon) * 100))
                        : 0;

                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className="text-sm w-3">{index + 1}</div>
                            <div className="flex-1 h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                <div
                                    className="h-full bg-green-500 dark:bg-green-600 px-2 flex items-center justify-end text-white text-xs md:text-sm font-bold"
                                    style={{ width: `${percentage}%` }}
                                >
                                    {count > 0 ? count : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={resetGame}
                className="w-full py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-bold transition-colors"
            >
                New Game
            </button>
        </div>
    );
};

// Word Definition Component
export const WordDefinition: React.FC = () => {
    const { dictionary, loadingDefinition, definitionError, gameState } = useContext(GameContext);

    if (loadingDefinition) {
        return (
            <div className="p-4 text-center">
                <div className="animate-pulse">Loading definition...</div>
            </div>
        );
    }

    if (definitionError) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500">{definitionError}</p>
            </div>
        );
    }

    if (!dictionary) {
        return (
            <div className="p-4 text-center">
                <p>The word was: <span className="font-bold">{gameState.dailyWord.toUpperCase()}</span></p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xl">{dictionary.word.toUpperCase()}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{dictionary.partOfSpeech}</span>
            </div>
            <p>{dictionary.definition}</p>
            {dictionary.example && (
                <p className="italic text-gray-600 dark:text-gray-400">
                    &quot;{dictionary.example}&quot;
                </p>
            )}
        </div>
    );
};

// Settings Component
export const SettingsComponent: React.FC = () => {
    const { isDarkMode, toggleDarkMode, resetGame } = useContext(GameContext);

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <span className="font-medium">Dark Mode</span>
                <button
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 rounded-full transition-colors p-1 ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'transform translate-x-6' : ''
                            }`}
                    />
                </button>
            </div>

            <div className="pt-4 border-t">
                <button
                    onClick={resetGame}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-bold transition-colors"
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

// Game Header Component
export const GameHeader: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useContext(GameContext);

    // Helper functions to handle modal operations with proper typing
    const openStatsModal = () => {
        const modal = document.getElementById('stats-modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const openSettingsModal = () => {
        const modal = document.getElementById('settings-modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const closeStatsModal = () => {
        const modal = document.getElementById('stats-modal') as HTMLDialogElement;
        if (modal) modal.close();
    };

    const closeSettingsModal = () => {
        const modal = document.getElementById('settings-modal') as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <header className="flex justify-between items-center w-full max-w-md mx-auto p-4 border-b">
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md"
            >
                {isDarkMode ? '🌙' : '☀️'}
            </button>

            <h1 className="text-3xl font-bold tracking-widest">WORDLE</h1>

            <div className="flex space-x-2">
                <button
                    className="p-2 rounded-md"
                    aria-label="Statistics"
                    onClick={openStatsModal}
                >
                    📊
                </button>
                <button
                    className="p-2 rounded-md"
                    aria-label="Settings"
                    onClick={openSettingsModal}
                >
                    ⚙️
                </button>
            </div>

            {/* Stats Modal */}
            <dialog id="stats-modal" className="rounded-xl p-0 bg-white dark:bg-gray-800 shadow-xl w-80 md:w-96">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Statistics</h2>
                        <button
                            onClick={closeStatsModal}
                            className="p-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <StatsDisplay />
            </dialog>

            {/* Settings Modal */}
            <dialog id="settings-modal" className="rounded-xl p-0 bg-white dark:bg-gray-800 shadow-xl w-80 md:w-96">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Settings</h2>
                        <button
                            onClick={closeSettingsModal}
                            className="p-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <SettingsComponent />
            </dialog>
        </header>
    );
};