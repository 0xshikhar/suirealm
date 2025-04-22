"use client"
// Game logic and state management
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LetterState, GameStatus, WordleState, UserStats, WordDefinition, GameContextType } from './WordleTypes';

// Create context
export const GameContext = createContext<GameContextType>({} as GameContextType);

interface GameProviderProps {
    children: ReactNode;
    gameWords: string[];    // words.json - Words used as Wordle answers
    validWords: string[];   // validWords.json - All valid 5-letter dictionary words
}


// Initial game state
const initialGameState: WordleState = {
    dailyWord: '',
    guesses: [],
    currentGuess: '',
    currentRow: 0,
    gameStatus: 'playing',
    usedKeys: {}
};

// Initial user stats
const initialUserStats: UserStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayed: ''
};

interface GameProviderProps {
    children: ReactNode;
    gameWords: string[]; // Words from JSON file
    validWords: string[]; // Valid words from JSON file
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, gameWords, validWords }) => {
    // State
    const [gameState, setGameState] = useState<WordleState>(() => {
        const savedState = localStorage.getItem('wordleGameState');
        return savedState ? JSON.parse(savedState) : { ...initialGameState, dailyWord: getRandomWord() };
    });

    const [userStats, setUserStats] = useState<UserStats>(() => {
        const savedStats = localStorage.getItem('wordleUserStats');
        return savedStats ? JSON.parse(savedStats) : initialUserStats;
    });

    const [dictionary, setDictionary] = useState<WordDefinition | null>(null);
    const [loadingDefinition, setLoadingDefinition] = useState<boolean>(false);
    const [definitionError, setDefinitionError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [showToastNotification, setShowToastNotification] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');

    // Initialize dark mode on first render
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    // Save game state and stats to localStorage
    useEffect(() => {
        localStorage.setItem('wordleGameState', JSON.stringify(gameState));
        localStorage.setItem('wordleUserStats', JSON.stringify(userStats));
    }, [gameState, userStats]);

    // Get a random word for the game (only from gameWords)
    function getRandomWord(): string {
        return gameWords[Math.floor(Math.random() * gameWords.length)].toLowerCase();
    }

    // Handle key press
    const handleKeyPress = (key: string) => {
        if (gameState.gameStatus !== 'playing') return;

        switch (key) {
            case 'enter':
                submitGuess();
                break;
            case 'backspace':
                deleteLetter();
                break;
            default:
                if (/^[a-z]$/.test(key) && gameState.currentGuess.length < 5) {
                    addLetter(key);
                }
        }
    };

    // Add letter to current guess
    const addLetter = (letter: string) => {
        if (gameState.currentGuess.length < 5) {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess + letter
            }));
        }
    };

    // Delete letter from current guess
    const deleteLetter = () => {
        setGameState(prev => ({
            ...prev,
            currentGuess: prev.currentGuess.slice(0, -1)
        }));
    };

    // Submit guess
    const submitGuess = () => {
        const guess = gameState.currentGuess.toLowerCase();

        // Check if word is 5 letters
        if (guess.length !== 5) {
            showToast('Word must be 5 letters');
            return;
        }

        // Check if word is a valid dictionary word (from validWords)
        if (!validWords.includes(guess) && !gameWords.includes(guess)) {
            showToast('Not in word list');
            return;
        }

        // Process valid guess
        const newGuesses = [...gameState.guesses, guess];
        const newCurrentRow = gameState.currentRow + 1;

        // Calculate used keys states
        const newUsedKeys = { ...gameState.usedKeys };

        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            const targetLetter = gameState.dailyWord[i];

            if (!newUsedKeys[letter] || newUsedKeys[letter] === 'absent') {
                if (letter === targetLetter) {
                    newUsedKeys[letter] = 'correct';
                } else if (gameState.dailyWord.includes(letter)) {
                    newUsedKeys[letter] = 'present';
                } else {
                    newUsedKeys[letter] = 'absent';
                }
            } else if (newUsedKeys[letter] === 'present' && letter === targetLetter) {
                newUsedKeys[letter] = 'correct';
            }
        }

        // Check game status
        let newGameStatus: GameStatus = 'playing';
        if (guess === gameState.dailyWord) {
            newGameStatus = 'won';
            updateStats(newCurrentRow);
        } else if (newCurrentRow >= 6) {
            newGameStatus = 'lost';
            updateStats(0);
        }

        // Update game state
        setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
            currentRow: newCurrentRow,
            gameStatus: newGameStatus,
            usedKeys: newUsedKeys
        }));
    };

    // Update user statistics
    const updateStats = (guessCount: number) => {
        const today = new Date().toLocaleDateString();

        setUserStats(prev => {
            const newGuessDistribution = [...prev.guessDistribution];

            if (guessCount > 0) {
                newGuessDistribution[guessCount - 1]++;
            }

            const isNewStreak = prev.lastPlayed === '' ||
                new Date(prev.lastPlayed).toLocaleDateString() !== new Date(Date.now() - 86400000).toLocaleDateString();

            const newCurrentStreak = (guessCount > 0 && !isNewStreak) ? prev.currentStreak + 1 : guessCount > 0 ? 1 : 0;

            return {
                gamesPlayed: prev.gamesPlayed + 1,
                gamesWon: guessCount > 0 ? prev.gamesWon + 1 : prev.gamesWon,
                currentStreak: newCurrentStreak,
                maxStreak: Math.max(prev.maxStreak, newCurrentStreak),
                guessDistribution: newGuessDistribution,
                lastPlayed: today
            };
        });
    };

    // Reset game
    const resetGame = () => {
        setGameState({
            ...initialGameState,
            dailyWord: getRandomWord()
        });
    };

    // Look up word in dictionary
    const lookupWord = (word: string) => {
        setLoadingDefinition(true);
        setDefinitionError(null);

        // Check if word exists in the valid words list
        if (!validWords.includes(word) && !gameWords.includes(word)) {
            setDefinitionError(`Definition for "${word}" not found`);
            setLoadingDefinition(false);
            return;
        }

        // Simulate fetching word definition from an API
        setTimeout(() => {
            // Mock dictionary response for demonstration
            const mockDefinition: WordDefinition = {
                word: word,
                definition: `A 5-letter word used in the Wordle game.`,
                partOfSpeech: 'noun',
                example: `The word "${word}" was used as an answer in Wordle.`
            };

            setDictionary(mockDefinition);
            setLoadingDefinition(false);
        }, 800);
    };


    // Show toast notification
    const showToast = (message: string) => {
        setToastMessage(message);
        setShowToastNotification(true);

        setTimeout(() => {
            setShowToastNotification(false);
        }, 2000);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', JSON.stringify(newMode));
        }
        document.documentElement.classList.toggle('dark', newMode);
    };

    // Context value
    const contextValue: GameContextType = {
        gameState,
        userStats,
        dictionary,
        loadingDefinition,
        definitionError,
        isDarkMode,
        handleKeyPress,
        resetGame,
        toggleDarkMode,
        lookupWord,
        showToast
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
            {showToastNotification &&
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="px-4 py-2 rounded-md bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-center min-w-[200px]">
                        <p className="font-medium">{toastMessage}</p>
                    </div>
                </div>
            }
        </GameContext.Provider>
    );
};