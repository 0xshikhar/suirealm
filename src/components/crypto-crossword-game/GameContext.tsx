import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, GameAction, Cell, Word, Direction } from "./types";
import { crosswordData } from "./crosswordData";

// Game Context
interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType>({
    state: {
        grid: [],
        words: [],
        currentCell: null,
        currentDirection: 'across',
        currentWordId: null,
        solved: false,
        completedWords: [],
        hints: 3,
        isComplete: false,
        startTime: Date.now(),
        endTime: null,
        moves: 0,
        score: 0,
        difficulty: 'medium'
    },
    dispatch: () => { },
});

// Helper functions
function findWordAtCell(words: Word[], row: number, col: number, direction: Direction): Word | undefined {
    return words.find(word => {
        if (word.direction !== direction) return false;

        if (direction === 'across') {
            return (
                row === word.startRow &&
                col >= word.startCol &&
                col < word.startCol + word.word.length
            );
        } else { // direction === 'down'
            return (
                col === word.startCol &&
                row >= word.startRow &&
                row < word.startRow + word.word.length
            );
        }
    });
}

function checkIfWordComplete(grid: Cell[][], word: Word): boolean {
    const { startRow, startCol, direction, word: correctWord } = word;

    if (direction === 'across') {
        for (let c = 0; c < correctWord.length; c++) {
            if (grid[startRow][startCol + c].value.toUpperCase() !== correctWord[c]) {
                return false;
            }
        }
    } else { // direction === 'down'
        for (let r = 0; r < correctWord.length; r++) {
            if (grid[startRow + r][startCol].value.toUpperCase() !== correctWord[r]) {
                return false;
            }
        }
    }

    return true;
}

// Calculate score based on game performance
function calculateScore(
    completedWords: number,
    totalWords: number,
    hintsRemaining: number,
    moves: number,
    usedReveal: boolean = false,
    usedWordReveal: boolean = false
): number {
    // Base score from completed words
    const baseScore = Math.round((completedWords / totalWords) * 1000);

    // Bonus for hints not used
    const hintBonus = hintsRemaining * 50;

    // Efficiency bonus (inverse to moves)
    const efficiency = Math.max(0, 500 - Math.min(moves, 500));

    // Penalties for using reveals
    const revealPenalty = usedReveal ? 100 : 0;
    const wordRevealPenalty = usedWordReveal ? 300 : 0;

    return Math.max(0, baseScore + hintBonus + efficiency - revealPenalty - wordRevealPenalty);
}

// Game Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SET_CELL_VALUE': {
            const { row, col, value } = action;
            if (state.grid[row][col].isEmpty) return state;

            const newGrid = [...state.grid];
            newGrid[row][col] = { ...newGrid[row][col], value };

            // Check if the current word is complete
            const currentWord = state.words.find(w => w.id === state.currentWordId);
            let newCompletedWords = [...state.completedWords];

            if (currentWord) {
                const isWordComplete = checkIfWordComplete(newGrid, currentWord);
                if (isWordComplete && !newCompletedWords.includes(currentWord.id)) {
                    newCompletedWords.push(currentWord.id);
                }
            }

            // Check if all words are complete
            const isComplete = state.words.every(word => {
                return checkIfWordComplete(newGrid, word);
            });

            // Calculate score
            const newScore = calculateScore(newCompletedWords.length, state.words.length, state.hints, state.moves);

            return {
                ...state,
                grid: newGrid,
                completedWords: newCompletedWords,
                isComplete,
                score: newScore,
                endTime: isComplete && !state.isComplete ? Date.now() : state.endTime
            };
        }

        case 'SET_ACTIVE_CELL': {
            const { row, col } = action;
            if (state.grid[row][col].isEmpty) return state;

            const newGrid = [...state.grid];

            // Clear previous highlighting
            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[r].length; c++) {
                    newGrid[r][c] = { ...newGrid[r][c], isActive: false, isHighlighted: false };
                }
            }

            // Set active cell
            newGrid[row][col] = { ...newGrid[row][col], isActive: true };

            // Find and highlight current word
            const currentWord = findWordAtCell(state.words, row, col, state.currentDirection);

            if (currentWord) {
                const { startRow, startCol, direction, word } = currentWord;

                if (direction === 'across') {
                    for (let c = 0; c < word.length; c++) {
                        if (startCol + c < newGrid[startRow].length) {
                            newGrid[startRow][startCol + c] = {
                                ...newGrid[startRow][startCol + c],
                                isHighlighted: true
                            };
                        }
                    }
                } else { // direction === 'down'
                    for (let r = 0; r < word.length; r++) {
                        if (startRow + r < newGrid.length) {
                            newGrid[startRow + r][startCol] = {
                                ...newGrid[startRow + r][startCol],
                                isHighlighted: true
                            };
                        }
                    }
                }

                return {
                    ...state,
                    grid: newGrid,
                    currentCell: { row, col },
                    currentWordId: currentWord.id,
                };
            }

            return {
                ...state,
                grid: newGrid,
                currentCell: { row, col },
            };
        }

        case 'SET_DIRECTION': {
            const direction = action.direction;

            if (state.currentCell) {
                const { row, col } = state.currentCell;
                const currentWord = findWordAtCell(state.words, row, col, direction);

                if (currentWord) {
                    const newGrid = [...state.grid];

                    // Clear previous highlighting
                    for (let r = 0; r < newGrid.length; r++) {
                        for (let c = 0; c < newGrid[r].length; c++) {
                            newGrid[r][c] = { ...newGrid[r][c], isHighlighted: false };
                        }
                    }

                    // Highlight current word
                    const { startRow, startCol, direction: wordDirection, word } = currentWord;

                    if (wordDirection === 'across') {
                        for (let c = 0; c < word.length; c++) {
                            if (startCol + c < newGrid[startRow].length) {
                                newGrid[startRow][startCol + c] = {
                                    ...newGrid[startRow][startCol + c],
                                    isHighlighted: true
                                };
                            }
                        }
                    } else { // direction === 'down'
                        for (let r = 0; r < word.length; r++) {
                            if (startRow + r < newGrid.length) {
                                newGrid[startRow + r][startCol] = {
                                    ...newGrid[startRow + r][startCol],
                                    isHighlighted: true
                                };
                            }
                        }
                    }

                    return {
                        ...state,
                        grid: newGrid,
                        currentDirection: direction,
                        currentWordId: currentWord.id,
                    };
                }
            }

            return {
                ...state,
                currentDirection: direction,
            };
        }

        case 'TOGGLE_DIRECTION': {
            const newDirection = state.currentDirection === 'across' ? 'down' : 'across';

            if (state.currentCell) {
                const { row, col } = state.currentCell;
                const currentWord = findWordAtCell(state.words, row, col, newDirection);

                if (currentWord) {
                    const newGrid = [...state.grid];

                    // Clear previous highlighting
                    for (let r = 0; r < newGrid.length; r++) {
                        for (let c = 0; c < newGrid[r].length; c++) {
                            newGrid[r][c] = { ...newGrid[r][c], isHighlighted: false };
                        }
                    }

                    // Highlight current word
                    const { startRow, startCol, direction, word } = currentWord;

                    if (direction === 'across') {
                        for (let c = 0; c < word.length; c++) {
                            if (startCol + c < newGrid[startRow].length) {
                                newGrid[startRow][startCol + c] = {
                                    ...newGrid[startRow][startCol + c],
                                    isHighlighted: true
                                };
                            }
                        }
                    } else { // direction === 'down'
                        for (let r = 0; r < word.length; r++) {
                            if (startRow + r < newGrid.length) {
                                newGrid[startRow + r][startCol] = {
                                    ...newGrid[startRow + r][startCol],
                                    isHighlighted: true
                                };
                            }
                        }
                    }

                    return {
                        ...state,
                        grid: newGrid,
                        currentDirection: newDirection,
                        currentWordId: currentWord.id,
                    };
                }
            }

            return {
                ...state,
                currentDirection: newDirection,
            };
        }

        case 'SET_WORD': {
            const wordId = action.wordId;
            const word = state.words.find(w => w.id === wordId);

            if (word) {
                const { startRow, startCol, direction } = word;

                // Create a SET_ACTIVE_CELL action for the first cell of the word
                return gameReducer(
                    {
                        ...state,
                        currentDirection: direction,
                    },
                    { type: 'SET_ACTIVE_CELL', row: startRow, col: startCol }
                );
            }

            return state;
        }

        case 'MOVE_NEXT_CELL': {
            if (!state.currentCell) return state;

            const { row, col } = state.currentCell;
            const { currentDirection } = state;

            let nextRow = row;
            let nextCol = col;

            if (currentDirection === 'across') {
                nextCol = col + 1;
            } else {
                nextRow = row + 1;
            }

            // Check if next cell is within grid bounds and not empty
            if (
                nextRow >= 0 &&
                nextRow < state.grid.length &&
                nextCol >= 0 &&
                nextCol < state.grid[0].length &&
                !state.grid[nextRow][nextCol].isEmpty
            ) {
                return gameReducer(state, { type: 'SET_ACTIVE_CELL', row: nextRow, col: nextCol });
            }

            return state;
        }

        case 'MOVE_PREV_CELL': {
            if (!state.currentCell) return state;

            const { row, col } = state.currentCell;
            const { currentDirection } = state;

            let prevRow = row;
            let prevCol = col;

            if (currentDirection === 'across') {
                prevCol = col - 1;
            } else {
                prevRow = row - 1;
            }

            // Check if prev cell is within grid bounds and not empty
            if (
                prevRow >= 0 &&
                prevRow < state.grid.length &&
                prevCol >= 0 &&
                prevCol < state.grid[0].length &&
                !state.grid[prevRow][prevCol].isEmpty
            ) {
                return gameReducer(state, { type: 'SET_ACTIVE_CELL', row: prevRow, col: prevCol });
            }

            return state;
        }

        case 'CHECK_SOLUTIONS': {
            const newGrid = [...state.grid];
            let allCorrect = true;

            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[r].length; c++) {
                    if (!newGrid[r][c].isEmpty) {
                        const isCorrect = newGrid[r][c].value.toUpperCase() === newGrid[r][c].correct;
                        if (!isCorrect) {
                            allCorrect = false;
                            // Clear incorrect values
                            newGrid[r][c] = { ...newGrid[r][c], value: '' };
                        }
                    }
                }
            }

            // Recalculate completed words
            const completedWords: number[] = [];
            state.words.forEach(word => {
                if (checkIfWordComplete(newGrid, word)) {
                    completedWords.push(word.id);
                }
            });

            return {
                ...state,
                grid: newGrid,
                solved: allCorrect,
                completedWords,
                isComplete: completedWords.length === state.words.length,
                endTime: completedWords.length === state.words.length ? Date.now() : state.endTime
            };
        }

        case 'USE_HINT': {
            if (state.hints <= 0 || !state.currentCell) return state;

            const { row, col } = state.currentCell;
            const newGrid = [...state.grid];
            const correctValue = newGrid[row][col].correct;

            newGrid[row][col] = {
                ...newGrid[row][col],
                value: correctValue,
                isRevealed: true
            };

            // Check if the current word is complete after using hint
            const currentWord = state.words.find(w => w.id === state.currentWordId);
            let newCompletedWords = [...state.completedWords];

            if (currentWord) {
                const isWordComplete = checkIfWordComplete(newGrid, currentWord);
                if (isWordComplete && !newCompletedWords.includes(currentWord.id)) {
                    newCompletedWords.push(currentWord.id);
                }
            }

            // Check if all words are complete
            const isComplete = state.words.every(word => {
                return checkIfWordComplete(newGrid, word);
            });

            // Calculate score
            const newScore = calculateScore(newCompletedWords.length, state.words.length, state.hints - 1, state.moves);

            return {
                ...state,
                grid: newGrid,
                hints: state.hints - 1,
                completedWords: newCompletedWords,
                isComplete,
                score: newScore,
                endTime: isComplete && !state.isComplete ? Date.now() : state.endTime
            };
        }

        case 'REVEAL_CELL': {
            if (!state.currentCell) return state;

            const { row, col } = state.currentCell;
            const newGrid = [...state.grid];
            const correctValue = newGrid[row][col].correct;

            newGrid[row][col] = {
                ...newGrid[row][col],
                value: correctValue,
                isRevealed: true
            };

            // Check if the current word is complete after revealing
            const currentWord = state.words.find(w => w.id === state.currentWordId);
            let newCompletedWords = [...state.completedWords];

            if (currentWord) {
                const isWordComplete = checkIfWordComplete(newGrid, currentWord);
                if (isWordComplete && !newCompletedWords.includes(currentWord.id)) {
                    newCompletedWords.push(currentWord.id);
                }
            }

            // Check if all words are complete
            const isComplete = state.words.every(word => {
                return checkIfWordComplete(newGrid, word);
            });

            // Calculate score (penalty for revealing)
            const newScore = calculateScore(newCompletedWords.length, state.words.length, state.hints, state.moves, true);

            return {
                ...state,
                grid: newGrid,
                completedWords: newCompletedWords,
                isComplete,
                score: newScore,
                endTime: isComplete && !state.isComplete ? Date.now() : state.endTime
            };
        }

        case 'REVEAL_WORD': {
            if (!state.currentWordId) return state;

            const currentWord = state.words.find(w => w.id === state.currentWordId);
            if (!currentWord) return state;

            const { startRow, startCol, direction, word: wordText } = currentWord;
            const newGrid = [...state.grid];
            let newCompletedWords = [...state.completedWords];

            // Reveal all cells in the word
            if (direction === 'across') {
                for (let c = 0; c < wordText.length; c++) {
                    newGrid[startRow][startCol + c] = {
                        ...newGrid[startRow][startCol + c],
                        value: wordText[c],
                        isRevealed: true
                    };
                }
            } else { // direction === 'down'
                for (let r = 0; r < wordText.length; r++) {
                    newGrid[startRow + r][startCol] = {
                        ...newGrid[startRow + r][startCol],
                        value: wordText[r],
                        isRevealed: true
                    };
                }
            }

            // Add to completed words if not already there
            if (!newCompletedWords.includes(currentWord.id)) {
                newCompletedWords.push(currentWord.id);
            }

            // Check if all words are complete
            const isComplete = state.words.every(word => {
                return checkIfWordComplete(newGrid, word);
            });

            // Calculate score (significant penalty for revealing a word)
            const newScore = calculateScore(newCompletedWords.length, state.words.length, state.hints, state.moves, true, true);

            return {
                ...state,
                grid: newGrid,
                completedWords: newCompletedWords,
                isComplete,
                score: newScore,
                endTime: isComplete && !state.isComplete ? Date.now() : state.endTime
            };
        }

        case 'RESET_GAME': {
            const initialState = initializeGame(state.words);
            return initialState;
        }

        case 'INCREMENT_MOVES': {
            return {
                ...state,
                moves: state.moves + 1
            };
        }

        case 'END_GAME': {
            return {
                ...state,
                endTime: Date.now(),
                isComplete: true
            };
        }

        default:
            return state;
    }
}

// Initialize game state
function initializeGame(words: Word[]): GameState {
    // Find grid dimensions
    let maxRow = 0;
    let maxCol = 0;

    words.forEach(word => {
        if (word.direction === 'across') {
            maxRow = Math.max(maxRow, word.startRow);
            maxCol = Math.max(maxCol, word.startCol + word.word.length - 1);
        } else { // direction === 'down'
            maxRow = Math.max(maxRow, word.startRow + word.word.length - 1);
            maxCol = Math.max(maxCol, word.startCol);
        }
    });

    // Create empty grid
    const grid: Cell[][] = Array(maxRow + 1)
        .fill(null)
        .map(() =>
            Array(maxCol + 1)
                .fill(null)
                .map((): Cell => ({
                    row: 0,
                    col: 0,
                    value: '',
                    correct: '',
                    isActive: false,
                    isHighlighted: false,
                    isEmpty: true,
                    isRevealed: false
                }))
        );

    // Set cell information and word numbers
    let cellNumber = 1;
    const cellNumbers = new Map<string, number>();

    words.forEach(word => {
        const { startRow, startCol, direction, word: wordStr } = word;
        const key = `${startRow},${startCol}`;

        // Assign cell number if not already assigned
        if (!cellNumbers.has(key)) {
            cellNumbers.set(key, cellNumber++);
        }

        // Fill in grid cells for this word
        if (direction === 'across') {
            for (let c = 0; c < wordStr.length; c++) {
                const col = startCol + c;
                grid[startRow][col] = {
                    row: startRow,
                    col,
                    value: '',
                    correct: wordStr[c],
                    number: c === 0 ? cellNumbers.get(key) : undefined,
                    isActive: false,
                    isHighlighted: false,
                    isEmpty: false,
                    isRevealed: false
                };
            }
        } else { // direction === 'down'
            for (let r = 0; r < wordStr.length; r++) {
                const row = startRow + r;
                // If cell is already filled (from an 'across' word), keep the number but update the correct letter
                if (!grid[row][startCol].isEmpty) {
                    grid[row][startCol] = {
                        ...grid[row][startCol],
                        correct: wordStr[r],
                    };
                } else {
                    grid[row][startCol] = {
                        row,
                        col: startCol,
                        value: '',
                        correct: wordStr[r],
                        number: r === 0 ? cellNumbers.get(key) : undefined,
                        isActive: false,
                        isHighlighted: false,
                        isEmpty: false,
                        isRevealed: false
                    };
                }
            }
        }
    });

    return {
        grid,
        words,
        currentCell: null,
        currentDirection: 'across',
        currentWordId: null,
        solved: false,
        completedWords: [],
        hints: 3,
        isComplete: false,
        startTime: Date.now(),
        endTime: null,
        moves: 0,
        score: 0,
        difficulty: 'medium'
    };
}

// Game Provider Component
interface GameProviderProps {
    children: ReactNode;
    initialWords?: Word[];
}

export function GameProvider({ children, initialWords = crosswordData }: GameProviderProps) {
    const [state, dispatch] = useReducer(gameReducer, initialWords, initializeGame);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

// Custom hook to use the game context
export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
} 