export type LetterState = 'empty' | 'absent' | 'present' | 'correct';

export type GameStatus = 'playing' | 'won' | 'lost';


export interface WordleState {
    dailyWord: string;
    guesses: string[];
    currentGuess: string;
    currentRow: number;
    gameStatus: GameStatus;
    usedKeys: Record<string, LetterState>;
}

export interface UserStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    lastPlayed: string;
}

export interface WordDefinition {
    word: string;
    definition: string;
    partOfSpeech: string;
    example?: string;
}

export interface GameContextType {
    gameState: WordleState;
    userStats: UserStats;
    dictionary: WordDefinition | null;
    loadingDefinition: boolean;
    definitionError: string | null;
    isDarkMode: boolean;
    handleKeyPress: (key: string) => void;
    resetGame: () => void;
    toggleDarkMode: () => void;
    lookupWord: (word: string) => void;
    showToast: (message: string) => void;
}