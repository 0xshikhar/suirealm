"use client"

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Check, Info, X } from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    Separator,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/index';
import gameWords from '@/data/words.json';       // Wordle answers
import validWords from '@/data/validWords.json'; // Valid dictionary words

// Types
type GameStatus = 'playing' | 'won' | 'lost';
type LetterState = 'correct' | 'present' | 'absent' | 'empty';

type GameState = {
    guesses: string[];
    currentGuess: string;
    dailyWord: string;
    gameStatus: GameStatus;
    currentRow: number;
    letterStates: Record<string, LetterState>;
};

type GameContextType = {
    gameState: GameState;
    handleKeyPress: (key: string) => void;
    resetGame: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
};

// Word list - use imported gameWords or fallback
const WORD_LIST = gameWords || [
    'react', 'state', 'props', 'hooks', 'redux',
    'query', 'build', 'shade', 'music', 'light',
    'games', 'tower', 'audio', 'piano', 'dream',
    'cloud', 'brain', 'plant', 'earth', 'water',
    'frame', 'point', 'swift', 'style', 'modal'
];

// Create game context
const GameContext = createContext<GameContextType | null>(null);

// Get the daily word based on the date
const getDailyWord = (): string => {
    const today = new Date();
    const index = (today.getFullYear() * 100 + today.getMonth() * 31 + today.getDate()) % WORD_LIST.length;
    return WORD_LIST[index];
};

// Initial state
const getInitialState = (): GameState => {
    return {
        guesses: Array(6).fill(''),
        currentGuess: '',
        dailyWord: getDailyWord(),
        gameStatus: 'playing',
        currentRow: 0,
        letterStates: {},
    };
};

const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

// Game Provider Component
const GameProvider: React.FC<{
    children: React.ReactNode;
    gameWords?: string[];
    validWords?: string[];
}> = ({ children, gameWords: propGameWords, validWords: propValidWords }) => {
    const [gameState, setGameState] = useState<GameState>(getInitialState);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Use the props if provided, otherwise use the imported values
    const gameWordsToUse = propGameWords || gameWords;
    const validWordsToUse = propValidWords || validWords;

    // Update the WORD_LIST to use the provided gameWords
    const WORD_LIST = gameWordsToUse || [
        'react', 'state', 'props', 'hooks', 'redux',
        'query', 'build', 'shade', 'music', 'light',
        'games', 'tower', 'audio', 'piano', 'dream',
        'cloud', 'brain', 'plant', 'earth', 'water',
        'frame', 'point', 'swift', 'style', 'modal'
    ];

    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // Initialize dark mode from system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    }, []);

    const resetGame = useCallback(() => {
        setGameState(getInitialState());
    }, []);

    const updateLetterStates = useCallback((guess: string, word: string) => {
        const newLetterStates = { ...gameState.letterStates };

        // First, mark all correct positions
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            if (letter === word[i]) {
                newLetterStates[letter] = 'correct';
            }
        }

        // Then, handle present and absent letters
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];

            // Skip if already marked as correct
            if (letter === word[i]) continue;

            if (word.includes(letter)) {
                // Only mark as present if not already marked as correct
                if (newLetterStates[letter] !== 'correct') {
                    newLetterStates[letter] = 'present';
                }
            } else {
                // Only mark as absent if not already marked as something else
                if (!newLetterStates[letter]) {
                    newLetterStates[letter] = 'absent';
                }
            }
        }

        return newLetterStates;
    }, [gameState.letterStates]);

    const handleKeyPress = useCallback((key: string) => {
        if (gameState.gameStatus !== 'playing') return;

        if (key === 'Backspace') {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess.slice(0, -1)
            }));
        } else if (key === 'Enter') {
            if (gameState.currentGuess.length !== 5) return;

            // Check if the word is a valid word from our list
            const validWordsList = validWordsToUse || WORD_LIST;
            if (!validWordsList.includes(gameState.currentGuess.toLowerCase())) {
                // In a real app, you'd show a toast/alert here
                console.log('Not a valid word');
                return;
            }

            const newGuesses = [...gameState.guesses];
            newGuesses[gameState.currentRow] = gameState.currentGuess;

            const isCorrect = gameState.currentGuess.toLowerCase() === gameState.dailyWord;
            const isLastGuess = gameState.currentRow === 5;

            const newLetterStates = updateLetterStates(
                gameState.currentGuess.toLowerCase(),
                gameState.dailyWord
            );

            setGameState(prev => ({
                ...prev,
                guesses: newGuesses,
                currentGuess: '',
                currentRow: prev.currentRow + 1,
                gameStatus: isCorrect ? 'won' : isLastGuess ? 'lost' : 'playing',
                letterStates: newLetterStates
            }));
        } else if (/^[a-zA-Z]$/.test(key) && gameState.currentGuess.length < 5) {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess + key.toLowerCase()
            }));
        }
    }, [gameState, updateLetterStates, validWordsToUse]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            handleKeyPress(e.key);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [handleKeyPress]);

    return (
        <GameContext.Provider value={{
            gameState,
            handleKeyPress,
            resetGame,
            isDarkMode,
            toggleDarkMode
        }}>
            {children}
        </GameContext.Provider>
    );
};

// Tile Component
const Tile: React.FC<{
    letter: string;
    state: LetterState;
    isRevealing?: boolean;
    index?: number;
}> = ({ letter, state, isRevealing = false, index = 0 }) => {
    const getBackgroundColor = () => {
        switch (state) {
            case 'correct':
                return 'bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600';
            case 'present':
                return 'bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-500 dark:border-yellow-600';
            case 'absent':
                return 'bg-gray-400 dark:bg-gray-600 text-white border-gray-400 dark:border-gray-600';
            default:
                return 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
        }
    };

    const animationDelay = isRevealing ? `${index * 0.15}s` : '0s';

    return (
        <div
            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-bold border-2 rounded-md ${getBackgroundColor()} transition-all duration-500`}
            style={{
                animationDelay,
                transform: isRevealing ? 'rotateX(360deg)' : 'rotateX(0)',
                transition: `transform 0.5s ease ${animationDelay}, background-color 0.3s ease ${animationDelay}`
            }}
        >
            {letter.toUpperCase()}
        </div>
    );
};

// Row Component
const Row: React.FC<{
    guess: string;
    currentGuess?: string;
    isCurrentRow?: boolean;
    isCompleted?: boolean;
    dailyWord: string;
}> = ({ guess, currentGuess = '', isCurrentRow = false, isCompleted = false, dailyWord }) => {
    const letters = isCurrentRow ? currentGuess.split('').concat(Array(5 - currentGuess.length).fill('')) : guess.split('');

    const getLetterState = (letter: string, index: number): LetterState => {
        if (!letter) return 'empty';
        if (!isCompleted) return 'empty';

        if (letter.toLowerCase() === dailyWord[index]) {
            return 'correct';
        } else if (dailyWord.includes(letter.toLowerCase())) {
            return 'present';
        } else {
            return 'absent';
        }
    };

    return (
        <div className="flex gap-2 mb-2">
            {Array(5).fill(null).map((_, i) => {
                const letter = letters[i] || '';
                return (
                    <Tile
                        key={i}
                        letter={letter}
                        state={getLetterState(letter, i)}
                        isRevealing={isCompleted && !isCurrentRow}
                        index={i}
                    />
                );
            })}
        </div>
    );
};

// Keyboard Component
const Keyboard: React.FC = () => {
    const { gameState, handleKeyPress } = useGame();

    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
    ];

    const getKeyColor = (key: string) => {
        if (key === 'Enter' || key === 'Backspace') {
            return 'bg-gray-300 dark:bg-gray-700';
        }

        const state = gameState.letterStates[key];
        switch (state) {
            case 'correct':
                return 'bg-green-500 dark:bg-green-600 text-white';
            case 'present':
                return 'bg-yellow-500 dark:bg-yellow-600 text-white';
            case 'absent':
                return 'bg-gray-400 dark:bg-gray-600 text-white';
            default:
                return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto mt-8">
            {rows.map((row, i) => (
                <div key={i} className={`flex justify-center gap-1 mb-2 ${i === 1 ? 'ml-5' : ''}`}>
                    {row.map(key => (
                        <button
                            key={key}
                            className={`${key === 'Enter' ? 'w-16' : key === 'Backspace' ? 'w-16' : 'w-10'} h-14 flex items-center justify-center rounded font-bold text-sm transition-colors ${getKeyColor(key)}`}
                            onClick={() => handleKeyPress(key)}
                        >
                            {key === 'Backspace' ? (
                                <X size={20} />
                            ) : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

// Game Status Component
const GameStatus: React.FC = () => {
    const { gameState, resetGame } = useGame();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (gameState.gameStatus !== 'playing') {
            // Show the result modal with a slight delay to allow for tile animations
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [gameState.gameStatus]);

    return (
        <>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {gameState.gameStatus === 'won' ? 'Congratulations! 🎉' : 'Better luck next time! 😊'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-center text-lg mb-4">
                            {gameState.gameStatus === 'won'
                                ? `You guessed the word in ${gameState.currentRow} ${gameState.currentRow === 1 ? 'try' : 'tries'}!`
                                : `The word was: ${gameState.dailyWord.toUpperCase()}`}
                        </p>
                        <div className="flex justify-center">
                            <Button onClick={resetGame}>Play Again</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

// Instructions Modal Component
const InstructionsModal: React.FC = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="absolute top-4 right-20">
                    <Info size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>How to Play</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p>Guess the word in 6 tries.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Each guess must be a valid 5-letter word.</li>
                        <li>The color of the tiles will change to show how close your guess was.</li>
                    </ul>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tile letter="W" state="correct" />
                            <span>W is in the word and in the correct spot.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tile letter="I" state="present" />
                            <span>I is in the word but in the wrong spot.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tile letter="N" state="absent" />
                            <span>N is not in the word.</span>
                        </div>
                    </div>

                    <p>A new word will be available each day!</p>
                </div>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button>Got it!</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Dark Mode Toggle Component
const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useGame();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="absolute top-4 right-4 flex items-center">
                        <Switch
                            checked={isDarkMode}
                            onCheckedChange={toggleDarkMode}
                            id="dark-mode"
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Toggle {isDarkMode ? 'Light' : 'Dark'} Mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

// Game Board Component
const GameBoard: React.FC = () => {
    const { gameState } = useGame();

    return (
        <div className="flex flex-col items-center justify-center mb-8">
            {Array(6).fill(null).map((_, i) => (
                <Row
                    key={i}
                    guess={gameState.guesses[i]}
                    currentGuess={i === gameState.currentRow ? gameState.currentGuess : ''}
                    isCurrentRow={i === gameState.currentRow}
                    isCompleted={i < gameState.currentRow}
                    dailyWord={gameState.dailyWord}
                />
            ))}
        </div>
    );
};

// Main App Component
const WordleGame: React.FC<{
    gameWords?: string[];
    validWords?: string[];
}> = ({ gameWords: propGameWords, validWords: propValidWords }) => {
    // Use the props if provided, otherwise use the imported values
    const gameWordsToUse = propGameWords || gameWords;
    const validWordsToUse = propValidWords || validWords;

    return (
        <GameProvider gameWords={gameWordsToUse} validWords={validWordsToUse}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <div className="container mx-auto px-4 py-8 flex flex-col items-center relative">
                    <InstructionsModal />
                    <DarkModeToggle />

                    <h1 className="text-4xl font-bold mb-8 text-center">Wordle</h1>
                    <Separator className="mb-8" />

                    <Card className="w-full max-w-xl mb-8">
                        <CardContent className="pt-6">
                            <GameBoard />
                        </CardContent>
                    </Card>

                    <Keyboard />
                    <GameStatus />
                </div>
            </div>
        </GameProvider>
    );
};

export default WordleGame;