"use client"
import React, { useEffect, useRef } from 'react';
import { Move } from 'chess.js';

interface MoveHistoryDisplayProps {
    moves: Move[];
}

function MoveHistoryDisplay({ moves }: MoveHistoryDisplayProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when moves are added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves]);

    // Group moves by pairs (white and black)
    const groupedMoves = [];
    for (let i = 0; i < moves.length; i += 2) {
        groupedMoves.push({
            number: Math.floor(i / 2) + 1,
            white: i < moves.length ? moves[i] : null,
            black: i + 1 < moves.length ? moves[i + 1] : null
        });
    }

    if (moves.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No moves yet</p>
                <p className="text-xs mt-1">The move history will appear here</p>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="border rounded-md overflow-auto max-h-[400px]"
        >
            <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                    <tr>
                        <th className="p-2 text-left font-medium text-muted-foreground">#</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">White</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">Black</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedMoves.map((group) => (
                        <tr key={group.number} className="border-t border-border/50 hover:bg-muted/30">
                            <td className="p-2 text-muted-foreground">{group.number}.</td>
                            <td className="p-2 font-medium">
                                {group.white && (
                                    <div className="flex items-center group">
                                        <span className="flex items-center">
                                            {group.white.san}
                                            {group.white.captured && (
                                                <span className="ml-1 text-red-500 dark:text-red-400">×</span>
                                            )}
                                            {group.white.san.includes('+') && (
                                                <span className="ml-1 text-yellow-500">+</span>
                                            )}
                                        </span>
                                        <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            {group.white.from}-{group.white.to}
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td className="p-2 font-medium">
                                {group.black && (
                                    <div className="flex items-center group">
                                        <span className="flex items-center">
                                            {group.black.san}
                                            {group.black.captured && (
                                                <span className="ml-1 text-red-500 dark:text-red-400">×</span>
                                            )}
                                            {group.black.san.includes('+') && (
                                                <span className="ml-1 text-yellow-500">+</span>
                                            )}
                                        </span>
                                        <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            {group.black.from}-{group.black.to}
                                        </span>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MoveHistoryDisplay; 