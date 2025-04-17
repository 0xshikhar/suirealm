"use client"
import React, { useEffect } from "react";
import { useGame } from "./GameContext";
import { Card, CardContent } from "@/components/ui";

function CrosswordGrid() {
    const { state, dispatch } = useGame();

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!state.currentCell) return;

            const { key } = e;
            const { row, col } = state.currentCell;

            // Handle letter input
            if (/^[a-zA-Z]$/.test(key)) {
                dispatch({ type: 'SET_CELL_VALUE', row, col, value: key.toUpperCase() });
                dispatch({ type: 'MOVE_NEXT_CELL' });
                dispatch({ type: 'INCREMENT_MOVES' });
            }
            // Handle backspace/delete
            else if (key === 'Backspace' || key === 'Delete') {
                dispatch({ type: 'SET_CELL_VALUE', row, col, value: '' });
                dispatch({ type: 'MOVE_PREV_CELL' });
                dispatch({ type: 'INCREMENT_MOVES' });
            }
            // Handle arrow keys
            else if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
                e.preventDefault();

                let nextRow = row;
                let nextCol = col;

                switch (key) {
                    case 'ArrowRight':
                        nextCol += 1;
                        break;
                    case 'ArrowLeft':
                        nextCol -= 1;
                        break;
                    case 'ArrowUp':
                        nextRow -= 1;
                        break;
                    case 'ArrowDown':
                        nextRow += 1;
                        break;
                }

                // Check if next cell is within grid bounds
                if (
                    nextRow >= 0 &&
                    nextRow < state.grid.length &&
                    nextCol >= 0 &&
                    nextCol < state.grid[0].length &&
                    !state.grid[nextRow][nextCol].isEmpty
                ) {
                    dispatch({ type: 'SET_ACTIVE_CELL', row: nextRow, col: nextCol });
                }
            }
            // Handle tab or space to toggle direction
            else if (key === 'Tab' || key === ' ') {
                e.preventDefault();
                dispatch({ type: 'TOGGLE_DIRECTION' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [state.currentCell, dispatch]);

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-10 gap-0.5 max-w-md mx-auto">
                    {state.grid.map((row, rowIndex) => (
                        <React.Fragment key={`row-${rowIndex}`}>
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    className={`
                                        relative w-full aspect-square border 
                                        ${cell.isEmpty ? 'bg-gray-900 dark:bg-gray-800' : 'bg-card'}
                                        ${cell.isActive ? 'border-2 border-primary' : 'border-muted'}
                                        ${cell.isHighlighted && !cell.isActive ? 'bg-primary/10' : ''}
                                        ${cell.isRevealed ? 'text-amber-500' : ''}
                                        ${(state.completedWords.length === state.words.length && !cell.isEmpty) ? 'bg-green-100 dark:bg-green-950' : ''}
                                    `}
                                    onClick={() => {
                                        if (!cell.isEmpty) {
                                            dispatch({ type: 'SET_ACTIVE_CELL', row: rowIndex, col: colIndex });
                                        }
                                    }}
                                >
                                    {cell.number && (
                                        <span className="absolute text-[8px] top-0 left-0 leading-none p-0.5 text-muted-foreground">
                                            {cell.number}
                                        </span>
                                    )}

                                    {!cell.isEmpty && (
                                        <div className="flex items-center justify-center w-full h-full text-sm md:text-base font-medium">
                                            {cell.value}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export { CrosswordGrid }; 