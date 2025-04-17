// Types for the Crypto Crossword game
export type Direction = 'across' | 'down';

export interface Word {
    id: number;
    word: string;
    clue: string;
    startRow: number;
    startCol: number;
    direction: Direction;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Cell {
    row: number;
    col: number;
    value: string;
    correct: string;
    number?: number;
    isActive: boolean;
    isHighlighted: boolean;
    isEmpty: boolean;
    isRevealed?: boolean;
}

export interface GameState {
    grid: Cell[][];
    words: Word[];
    currentCell: { row: number; col: number } | null;
    currentDirection: Direction;
    currentWordId: number | null;
    solved: boolean;
    completedWords: number[];
    hints: number;
    isComplete: boolean;
    startTime: number;
    endTime: number | null;
    moves: number;
    score: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export type GameAction =
    | { type: 'SET_CELL_VALUE'; row: number; col: number; value: string }
    | { type: 'SET_ACTIVE_CELL'; row: number; col: number }
    | { type: 'SET_DIRECTION'; direction: Direction }
    | { type: 'SET_WORD'; wordId: number }
    | { type: 'TOGGLE_DIRECTION' }
    | { type: 'CHECK_SOLUTIONS' }
    | { type: 'MOVE_NEXT_CELL' }
    | { type: 'MOVE_PREV_CELL' }
    | { type: 'USE_HINT' }
    | { type: 'RESET_GAME' }
    | { type: 'REVEAL_CELL' }
    | { type: 'REVEAL_WORD' }
    | { type: 'END_GAME' }
    | { type: 'INCREMENT_MOVES' };

export interface Word {
    id: number;
    word: string;
    clue: string;
    startRow: number;
    startCol: number;
    direction: Direction;
}

export interface Cell {
    row: number;
    col: number;
    value: string;
    correct: string;
    number?: number;
    isActive: boolean;
    isHighlighted: boolean;
    isEmpty: boolean;
}

export interface GameState {
    grid: Cell[][];
    words: Word[];
    currentCell: { row: number; col: number } | null;
    currentDirection: Direction;
    currentWordId: number | null;
    solved: boolean;
    completedWords: number[];
    hints: number;
    isComplete: boolean;
}
