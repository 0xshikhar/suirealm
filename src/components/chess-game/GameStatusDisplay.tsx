"use client"
import React from 'react';
import { Separator } from '@/components/ui';

interface GameStatusDisplayProps {
    capturedPieces: {
        white: string[];
        black: string[];
    };
    materialAdvantage: number;
    moveCount: number;
    renderPieceIcon: (piece: string, color: 'w' | 'b') => React.ReactNode;
}

function GameStatusDisplay({
    capturedPieces,
    materialAdvantage,
    moveCount,
    renderPieceIcon
}: GameStatusDisplayProps) {

    // Add debugging logs
    console.log("GameStatusDisplay rendered with:", {
        whiteCaptured: capturedPieces.white,
        blackCaptured: capturedPieces.black,
        materialAdvantage,
        moveCount
    });

    // Determine game phase based on move count and captured pieces
    const gamePhase =
        moveCount < 10 ? 'Opening' :
            capturedPieces.white.length + capturedPieces.black.length > 10 ? 'Endgame' :
                'Middlegame';

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-medium mb-1">Captured Pieces</h3>
                <div className="flex flex-wrap gap-1 p-2 bg-muted/20 rounded-md bg-white text-black">
                    <div className="w-full mb-1 text-sm font-bold text-muted-foreground">White captured:</div>
                    {capturedPieces.white.length > 0 ? (
                        capturedPieces.white.map((piece, i) => (
                            <div key={`white-${i}`} className="w-8 h-8 flex items-center justify-center">
                                {renderPieceIcon(piece, 'b')}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">None</div>
                    )}
                </div>
                <div className="flex flex-wrap gap-1 p-2 bg-muted/20 rounded-md mt-2 bg-black text-white">
                    <div className="w-full mb-1 text-sm font-bold text-muted-foreground">Black captured:</div>
                    {capturedPieces.black.length > 0 ? (
                        capturedPieces.black.map((piece, i) => (
                            <div key={`black-${i}`} className="w-8 h-8 flex items-center justify-center">
                                {renderPieceIcon(piece, 'w')}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">None</div>
                    )}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-medium mb-2">Game Statistics</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">Total Moves:</div>
                    <div className="text-sm font-medium">{Math.floor(moveCount / 2)}</div>

                    <div className="text-sm">Material Advantage:</div>
                    <div className="text-sm font-medium flex items-center">
                        {materialAdvantage > 0 ? 'White' : materialAdvantage < 0 ? 'Black' : 'Equal'}
                        {materialAdvantage !== 0 && (
                            <span className="ml-1">
                                (+{Math.abs(materialAdvantage)})
                            </span>
                        )}
                    </div>

                    <div className="text-sm">Game Phase:</div>
                    <div className="text-sm font-medium">
                        {gamePhase}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameStatusDisplay; 