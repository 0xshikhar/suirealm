"use client"
import { createContext, useState, useEffect, useContext } from 'react';
import { CellValue, BoardType, Difficulty, GameContextType } from './SudokoTypes';
import { toast } from "sonner"

const GameContext = createContext<GameContextType | null>(null);

// Custom hook to use the game context
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

// Game Provider component
const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [board, setBoard] = useState<BoardType>(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [originalBoard, setOriginalBoard] = useState<BoardType>(Array(9).fill(null).map(() => Array(9).fill(null)));
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [noteMode, setNoteMode] = useState(false);
    const [notes, setNotes] = useState<Record<string, number[]>>({});
    const [isPaused, setIsPaused] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [hintsAvailable, setHintsAvailable] = useState(3);

    // Generate a new Sudoku board
    const generateBoard = (difficulty: Difficulty) => {
        // For simplicity, using a predefined board
        // In a real app, you would use an algorithm to generate valid Sudoku puzzles
        const fullBoard: BoardType = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ];

        // Create a copy of the full board
        const newBoard: BoardType = fullBoard.map(row => [...row]);

        // Define how many cells to remove based on difficulty
        const cellsToRemove = {
            easy: 30,
            medium: 40,
            hard: 50,
        };

        // Remove cells to create the puzzle
        let removed = 0;
        while (removed < cellsToRemove[difficulty]) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (newBoard[row][col] !== null) {
                newBoard[row][col] = null;
                removed++;
            }
        }

        // Create the original board (with fixed cells)
        const original: BoardType = newBoard.map(row => [...row]);

        setBoard(newBoard);
        setOriginalBoard(original);
        setSelectedCell(null);
        setIsGameComplete(false);
        setTimer(0);
        setIsRunning(true);
        setMistakes(0);
        setNotes({});
        setHintsUsed(0);
        setHintsAvailable(3);
        setIsPaused(false);
    };

    // Initialize game
    useEffect(() => {
        // Load saved game on initial render
        const savedGame = localStorage.getItem('sudokuGame');
        if (savedGame) {
            try {
                const {
                    board: savedBoard,
                    originalBoard: savedOriginalBoard,
                    difficulty: savedDifficulty,
                    timer: savedTimer,
                    mistakes: savedMistakes,
                    notes: savedNotes
                } = JSON.parse(savedGame);

                setBoard(savedBoard);
                setOriginalBoard(savedOriginalBoard);
                setDifficulty(savedDifficulty);
                setTimer(savedTimer);
                setMistakes(savedMistakes);
                setNotes(savedNotes);
                setIsRunning(true);

                toast.info("Game Restored", {
                    description: "Your previous game has been loaded.",
                });
            } catch (error) {
                console.error('Error loading saved game:', error);
                generateBoard(difficulty);

                toast.error("Error Loading Game", {
                    description: "Could not restore your previous game. Starting a new one.",
                });
            }
        } else {
            generateBoard(difficulty);

            toast.info("Good luck and have fun!", {
                description: "Good luck and have fun!",
            });
        }
    }, []);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && !isGameComplete) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isGameComplete]);

    // Save game state when it changes
    useEffect(() => {
        if (board.some(row => row.some(cell => cell !== null))) {
            localStorage.setItem('sudokuGame', JSON.stringify({
                board,
                originalBoard,
                difficulty,
                timer,
                mistakes,
                notes
            }));
        }
    }, [board, originalBoard, difficulty, timer, mistakes, notes]);

    // Update a cell value
    const updateCell = (value: CellValue) => {
        if (!selectedCell) {
            if (!isPaused) {
                toast.error("No cell selected", {
                    description: "Please select a cell on the board first.",
                });
            }
            return;
        }

        if (isOriginalCell(selectedCell[0], selectedCell[1])) {
            toast.error("Cannot modify original cells", {
                description: "This cell is part of the original puzzle and cannot be changed.",
            });
            return;
        }

        if (isGameComplete) return;

        const [row, col] = selectedCell;

        if (noteMode) {
            // Handle notes mode
            const cellKey = `${row}-${col}`;
            const currentNotes = notes[cellKey] || [];

            if (value === null) {
                // Clear notes for this cell
                const newNotes = { ...notes };
                delete newNotes[cellKey];
                setNotes(newNotes);
                return;
            }

            const newNotes = { ...notes };
            if (currentNotes.includes(value)) {
                // Remove the note if it already exists
                newNotes[cellKey] = currentNotes.filter(n => n !== value);
                if (newNotes[cellKey].length === 0) {
                    delete newNotes[cellKey];
                }
            } else {
                // Add the note
                newNotes[cellKey] = [...currentNotes, value].sort((a, b) => a - b);
            }

            setNotes(newNotes);

            // Clear the actual cell value if there are notes
            const newBoard = [...board];
            newBoard[row][col] = null;
            setBoard(newBoard);
        } else {
            // Regular mode - update the cell value
            const newBoard = [...board];
            newBoard[row][col] = value;
            setBoard(newBoard);

            // Clear notes for this cell
            const cellKey = `${row}-${col}`;
            if (notes[cellKey]) {
                const newNotes = { ...notes };
                delete newNotes[cellKey];
                setNotes(newNotes);
            }

            // Check if the move is valid
            if (value !== null && !isCellValueValid(row, col, value)) {
                setMistakes(prev => prev + 1);

                if (mistakes + 1 >= 3) {
                    toast.error("Watch out!", {
                        description: `You've made ${mistakes + 1} mistakes. Try using the Check button to verify your moves.`,
                    });
                }
            }

            // Check if the game is complete
            if (isBoardFilled(newBoard) && isValidBoard()) {
                setIsGameComplete(true);
                setIsRunning(false);

                // Calculate score based on difficulty, time, and mistakes
                const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
                const timeDeduction = Math.floor(timer / 60); // Deduct points for each minute
                const mistakeDeduction = mistakes * 5;
                const hintDeduction = hintsUsed * 10;

                const baseScore = 1000;
                const score = Math.max(0, Math.floor((baseScore * difficultyMultiplier) - timeDeduction - mistakeDeduction - hintDeduction));

                toast.success("Congratulations!", {
                    description: `You've completed the puzzle! Your score: ${score}`,
                });
            }
        }
    };

    // Check if a cell is part of the original puzzle
    const isOriginalCell = (row: number, col: number) => {
        if (row < 0 || col < 0) return false;
        return originalBoard[row][col] !== null;
    };

    // Check if the board is completely filled
    const isBoardFilled = (board: BoardType) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === null) return false;
            }
        }
        return true;
    };

    // Check if a cell value is valid
    const isCellValueValid = (row: number, col: number, value: number) => {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (i !== col && board[row][i] === value) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (i !== row && board[i][col] === value) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (i !== row && j !== col && board[i][j] === value) return false;
            }
        }

        return true;
    };

    // Check if the entire board is valid
    const isValidBoard = () => {
        // Create a copy of the board to avoid modifying the original during validation
        const boardCopy = board.map(row => [...row]);

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = boardCopy[row][col];
                if (value !== null) {
                    // Temporarily remove the value to check if it's valid
                    boardCopy[row][col] = null;
                    const isValid = isCellValueValid(row, col, value as number);
                    boardCopy[row][col] = value;

                    if (!isValid) return false;
                }
            }
        }
        return true;
    };

    // Reset the game to the original state
    const resetGame = () => {
        setBoard(originalBoard.map(row => [...row]));
        setSelectedCell(null);
        setIsGameComplete(false);
        setTimer(0);
        setIsRunning(true);
        setMistakes(0);
        setNotes({});
        setIsPaused(false);
    };

    // Start a new game
    const newGame = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        generateBoard(newDifficulty);

        toast.info(`Difficulty: ${newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1)}`, {
            description: "New Game Started",
        });
    };

    // Toggle note mode
    const toggleNote = () => {
        setNoteMode(!noteMode);

        toast.info(noteMode ? "Notes Mode Off" : "Notes Mode On", {
            description: noteMode
                ? "You are now entering numbers directly."
                : "You can now add multiple small numbers as notes in each cell.",
        });
    };

    // Add hint functionality
    const getHint = () => {
        if (hintsAvailable <= 0) return;

        if (!selectedCell) {
            toast.error("No cell selected", {
                description: "Please select an empty cell to get a hint.",
            });
            return;
        }

        if (isGameComplete) return;

        const [row, col] = selectedCell;

        if (isOriginalCell(row, col)) {
            toast.error("Cannot use hint here", {
                description: "This cell is already part of the original puzzle.",
            });
            return;
        }

        if (board[row][col] !== null) {
            toast.error("Cell already filled", {
                description: "Select an empty cell to use a hint.",
            });
            return;
        }

        // Find the correct value for this cell from the solution
        const fullBoard = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ];

        const correctValue = fullBoard[row][col];

        // Update the board with the correct value
        const newBoard = [...board];
        newBoard[row][col] = correctValue;
        setBoard(newBoard);

        // Clear any notes for this cell
        const cellKey = `${row}-${col}`;
        if (notes[cellKey]) {
            const newNotes = { ...notes };
            delete newNotes[cellKey];
            setNotes(newNotes);
        }

        // Update hints used and available
        setHintsUsed(prev => prev + 1);
        setHintsAvailable(prev => prev - 1);

        // Check if the game is complete
        if (isBoardFilled(newBoard) && isValidBoard()) {
            setIsGameComplete(true);
            setIsRunning(false);
        }
    };

    // Add keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPaused || isGameComplete) return;

            // Number keys (both main keyboard and numpad)
            if (/^[1-9]$/.test(e.key)) {
                updateCell(parseInt(e.key) as CellValue);
            }
            // Arrow keys for navigation
            else if (e.key.startsWith('Arrow')) {
                if (!selectedCell) {
                    setSelectedCell([0, 0]);
                    return;
                }

                const [currentRow, currentCol] = selectedCell;
                let newRow = currentRow;
                let newCol = currentCol;

                switch (e.key) {
                    case 'ArrowUp':
                        newRow = Math.max(0, currentRow - 1);
                        break;
                    case 'ArrowDown':
                        newRow = Math.min(8, currentRow + 1);
                        break;
                    case 'ArrowLeft':
                        newCol = Math.max(0, currentCol - 1);
                        break;
                    case 'ArrowRight':
                        newCol = Math.min(8, currentCol + 1);
                        break;
                }

                if (newRow !== currentRow || newCol !== currentCol) {
                    setSelectedCell([newRow, newCol]);
                }
            }
            // Delete or Backspace for erasing
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                updateCell(null);
            }
            // 'n' key for toggling note mode
            else if (e.key.toLowerCase() === 'n') {
                toggleNote();
            }
            // 'p' key for pausing
            else if (e.key.toLowerCase() === 'p') {
                togglePause();
            }
            // 'h' key for hint
            else if (e.key.toLowerCase() === 'h') {
                if (hintsAvailable > 0) {
                    getHint();
                } else {
                    toast.error("No hints available", {
                        description: "You've used all your available hints for this game.",
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, isGameComplete, updateCell, toggleNote, isPaused, hintsAvailable]);

    // Toggle pause functionality
    const togglePause = () => {
        setIsPaused(!isPaused);
        setIsRunning(isPaused);

        toast.info(isPaused ? "Timer is now running." : "Timer has been paused.", {
            description: isPaused ? "Timer is now running." : "Timer has been paused.",
        });
    };

    // Context value
    const contextValue: GameContextType = {
        board,
        originalBoard,
        selectedCell,
        setSelectedCell,
        updateCell,
        isValidBoard,
        resetGame,
        newGame,
        isGameComplete,
        difficulty,
        timer,
        isRunning,
        mistakes,
        toggleNote,
        noteMode,
        notes,
        isPaused,
        togglePause,
        hintsAvailable,
        hintsUsed,
        getHint,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;