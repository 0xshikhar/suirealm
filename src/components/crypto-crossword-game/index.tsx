"use client"
import React, { createContext, useContext, useReducer, useEffect, useState, Dispatch, SetStateAction } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { GameProvider } from "./GameContext";
import { CrosswordGrid } from "./CrosswordGrid";
import { ClueList } from "./ClueList";
import { GameControls } from "./GameControls";
import { VirtualKeyboard } from "./VirtualKeyboard";
import { GameStats } from "./GameStats";
import { crosswordData } from "./crosswordData";
import { GameState, GameAction, Word, Cell, Direction, } from "./types";

// Game Context
const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}>({
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
        startTime: 0,
        endTime: null,
        moves: 0,
        score: 0,
        difficulty: 'medium',
    },
    dispatch: () => { },
});

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

            return {
                ...state,
                grid: newGrid,
                completedWords: newCompletedWords,
                isComplete,
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
                        }
                    }
                }
            }

            return {
                ...state,
                solved: allCorrect,
            };
        }

        case 'USE_HINT': {
            if (state.hints <= 0 || !state.currentCell) return state;

            const { row, col } = state.currentCell;
            const newGrid = [...state.grid];
            const correctValue = newGrid[row][col].correct;

            newGrid[row][col] = {
                ...newGrid[row][col],
                value: correctValue
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

            return {
                ...state,
                grid: newGrid,
                hints: state.hints - 1,
                completedWords: newCompletedWords,
                isComplete,
            };
        }

        case 'RESET_GAME': {
            const initialState = initializeGame(state.words);
            return {
                ...initialState,
                hints: 3, // Reset hints to initial value
            };
        }

        default:
            return state;
    }
}

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
        startTime: 0,
        endTime: null,
        moves: 0,
        score: 0,
        difficulty: 'medium',
    };
}

// Main Component
function CryptoCrossword() {
    const [keyboardMode, setKeyboardMode] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [timerActive, setTimerActive] = useState(true);

    return (
        <GameProvider>
            <div className="container mx-auto py-8 px-4">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-primary">
                            Blockchain Terminology Crossword
                        </CardTitle>
                        <CardDescription className="text-center">
                            Test your knowledge of crypto and blockchain concepts!
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <GameControls
                            keyboardMode={keyboardMode}
                            setKeyboardMode={setKeyboardMode}
                            timerActive={timerActive}
                            setTimerActive={setTimerActive}
                            setShowStats={setShowStats}
                        />
                        <CrosswordGrid />
                        {keyboardMode && <VirtualKeyboard />}
                    </div>
                    <div>
                        <ClueList />
                    </div>
                </div>

                <GameStats showStats={showStats} setShowStats={setShowStats} />
            </div>
        </GameProvider>
    );
}

export default CryptoCrossword;