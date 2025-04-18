export type CellValue = number | null;
export type BoardType = CellValue[][];
export type Difficulty = "easy" | "medium" | "hard";

export interface GameContextType {
    board: BoardType;
    originalBoard: BoardType;
    selectedCell: [number, number] | null;
    setSelectedCell: (cell: [number, number] | null) => void;
    updateCell: (value: CellValue) => void;
    isValidBoard: () => boolean;
    resetGame: () => void;
    newGame: (difficulty: Difficulty) => void;
    isGameComplete: boolean;
    difficulty: Difficulty;
    timer: number;
    isRunning: boolean;
    mistakes: number;
    toggleNote: () => void;
    noteMode: boolean;
    notes: Record<string, number[]>;
    isPaused: boolean;
    togglePause: () => void;
    hintsAvailable: number;
    hintsUsed: number;
    getHint: () => void;
}
