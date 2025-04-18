"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, RotateCcw, Trophy, HelpCircle } from 'lucide-react';
import { useGame } from './SudokoProvider';
import { Difficulty, CellValue, BoardType } from './SudokoTypes';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from "sonner"


// Sudoku Board component
const SudokuBoard = () => {
    const { board, originalBoard, selectedCell, setSelectedCell, notes, isPaused, togglePause } = useGame();

    // Determine if a cell is in the same row, column, or 3x3 box as the selected cell
    const isRelatedToSelected = (row: number, col: number) => {
        if (!selectedCell) return false;

        const [selRow, selCol] = selectedCell as [number, number];

        // Same row or column
        if (row === selRow || col === selCol) return true;

        // Same 3x3 box
        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);
        const selBoxRow = Math.floor(selRow / 3);
        const selBoxCol = Math.floor(selCol / 3);

        return boxRow === selBoxRow && boxCol === selBoxCol;
    };

    // Determine if a cell has the same value as the selected cell
    const hasSameValueAsSelected = (row: number, col: number) => {
        if (!selectedCell) return false;

        const [selRow, selCol] = selectedCell as [number, number];
        const selValue = board[selRow][selCol];

        return selValue !== null && selValue === board[row][col];
    };

    return (
        <div className="w-full aspect-square relative">
            <div className="grid grid-cols-9 grid-rows-9 h-full w-full border-2 border-primary">
                {board.map((row: CellValue[], rowIndex: number) =>
                    row.map((cell: CellValue, colIndex: number) => {
                        const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                        const isOriginal = originalBoard[rowIndex][colIndex] !== null;
                        const isRelated = isRelatedToSelected(rowIndex, colIndex);
                        const hasSameValue = hasSameValueAsSelected(rowIndex, colIndex);
                        const cellKey = `${rowIndex}-${colIndex}`;
                        const cellNotes = notes[cellKey] || [];

                        // Determine border styles for 3x3 box separation
                        const rightBorderClass = (colIndex + 1) % 3 === 0 && colIndex < 8 ? "border-r-2 border-r-primary" : "border-r border-r-border";
                        const bottomBorderClass = (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? "border-b-2 border-b-primary" : "border-b border-b-border";

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`
                  relative flex items-center justify-center 
                  ${rightBorderClass} ${bottomBorderClass}
                  ${isSelected ? 'bg-primary/20' : isRelated ? 'bg-muted' : 'bg-card'}
                  ${hasSameValue && !isSelected ? 'bg-primary/10' : ''}
                  cursor-pointer transition-colors
                `}
                                onClick={() => setSelectedCell([rowIndex, colIndex])}
                            >
                                {cell !== null ? (
                                    <span className={`
                    text-lg sm:text-xl font-semibold
                    ${isOriginal ? 'text-foreground' : 'text-primary'}
                  `}>
                                        {cell}
                                    </span>
                                ) : cellNotes.length > 0 ? (
                                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                            <div key={num} className="flex items-center justify-center">
                                                {cellNotes.includes(num) && (
                                                    <span className="text-[0.5rem] sm:text-xs text-muted-foreground">
                                                        {num}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>

            {isPaused && (
                <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-20">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
                        <Button onClick={togglePause}>Resume Game</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Number Controls component
const NumberControls = () => {
    const { updateCell, noteMode } = useGame();

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="grid grid-cols-9 gap-1 w-full">
            {numbers.map(number => (
                <Button
                    key={number}
                    variant="outline"
                    className="h-10 p-0 aspect-square flex items-center justify-center text-lg font-medium"
                    onClick={() => updateCell(number as CellValue)}
                >
                    {number}
                </Button>
            ))}
        </div>
    );
};

// Game Controls component
const GameControls = () => {
    const {
        resetGame,
        newGame,
        isValidBoard,
        updateCell,
        toggleNote,
        noteMode,
        difficulty,
        hintsAvailable,
        getHint,
        togglePause,
        isPaused
    } = useGame();


    const handleCheck = () => {
        const result = isValidBoard();

        toast.success(result ? "Board is valid" : "Board has conflicts",
            {
                description: result
                    ? "Your current board configuration is valid. Keep going!"
                    : "There are conflicts on the board. Check for duplicate numbers.",
            });
    };

    const handleHint = () => {
        if (hintsAvailable <= 0) {
            toast.error("No hints available", {
                description: "You've used all your available hints for this game.",
            });
            return;
        }

        getHint();

        if (hintsAvailable - 1 === 0) {
            toast.info("Last hint used", {
                description: "You've used your last available hint.",
            });
        } else {
            toast.info("Hint used", {
                description: `You have ${hintsAvailable - 1} hints remaining.`,
            });
        }
    };

    const handleReset = () => {
        resetGame();
        toast.info("Game reset", {
            description: "The board has been reset to its initial state.",
        });
    };

    return (
        <div className="space-y-3 w-full">
            <div className="flex flex-wrap justify-between gap-2 w-full">
                <Button
                    variant={noteMode ? "default" : "outline"}
                    className="flex-1"
                    onClick={toggleNote}
                >
                    {noteMode ? "Notes On" : "Notes"}
                </Button>

                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => updateCell(null as CellValue)}
                >
                    Erase
                </Button>

                <Button
                    variant={isPaused ? "default" : "outline"}
                    className="flex-1"
                    onClick={togglePause}
                >
                    {isPaused ? "Resume" : "Pause"}
                </Button>
            </div>

            <div className="flex flex-wrap justify-between gap-2 w-full">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                >
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Reset
                </Button>

                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCheck}
                >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Check
                </Button>

                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleHint}
                    disabled={hintsAvailable <= 0}
                >
                    Hint ({hintsAvailable})
                </Button>
            </div>
        </div>
    );
};

// Game Status component
const GameStatus = () => {
    const { timer, mistakes, isGameComplete, difficulty, hintsUsed, newGame } = useGame();

    // Format time display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(timer)}</span>
            </div>

            <Badge variant={difficulty === "easy" ? "secondary" : difficulty === "medium" ? "default" : "destructive"}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>

            <div className="flex items-center gap-3">
                <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-destructive" />
                    <span className="text-sm font-medium">{mistakes}</span>
                </div>

                {hintsUsed > 0 && (
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-amber-600">Hints: {hintsUsed}</span>
                    </div>
                )}
            </div>

            {isGameComplete && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                    <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                        <Trophy className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <h2 className="text-2xl font-bold mb-2">Completed!</h2>
                        <p className="text-muted-foreground mb-1">Time: {formatTime(timer)}</p>
                        <p className="text-muted-foreground mb-4">
                            Mistakes: {mistakes} | Hints: {hintsUsed}
                        </p>
                        <Button onClick={() => newGame(difficulty)}>New Game</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Difficulty Selector component
const DifficultySelector = () => {
    const { newGame, difficulty, isGameComplete } = useGame();

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        if (difficulty !== newDifficulty) {
            if (isGameComplete || confirm('Starting a new game will reset your progress. Continue?')) {
                newGame(newDifficulty);
                toast.info(`Difficulty changed to ${newDifficulty}`, {
                    description: "A new game has been started with the selected difficulty.",
                });
            }
        }
    };

    return (
        <div className="flex space-x-1">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDifficultyChange(level)}
                >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
            ))}
        </div>
    );
};

// Add a keyboard shortcuts help component
const KeyboardShortcutsHelp = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                    <HelpCircle className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>Use the following keyboard shortcuts to play more efficiently:</p>
                    <ul className="space-y-2">
                        <li><strong>1-9</strong>: Enter numbers</li>
                        <li><strong>Arrow keys</strong>: Navigate the board</li>
                        <li><strong>Delete/Backspace</strong>: Erase a cell</li>
                        <li><strong>N</strong>: Toggle note mode</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Main wrapper component that includes the Toaster
const SudokuGameWrapper = () => {
    return (
        <>
            <SudokuBoard />
        </>
    );
};

export { SudokuBoard, NumberControls, GameControls, GameStatus, DifficultySelector, KeyboardShortcutsHelp, SudokuGameWrapper };