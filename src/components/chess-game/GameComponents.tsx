import React, { useRef, useEffect } from 'react';
import { Undo, RotateCcw, Info } from 'lucide-react';
import {
    GameControlsProps,
    GameInfoProps,
    MoveHistoryProps,
    GameStatusProps,
    GroupedMove
} from './ChessTypes';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// 1. GAME CONTROLS COMPONENT
const GameControls: React.FC<GameControlsProps> = ({
    onNewGame,
    onUndoMove,
    onSwitchSides,
    isThinking,
    gameOver,
    moveHistory
}) => {
    return (
        <div className="flex space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={onUndoMove}
                disabled={isThinking || gameOver || moveHistory.length < 2}
                title="Undo last move"
            >
                <Undo className="w-4 h-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={onNewGame}
                disabled={isThinking}
                title="New game"
            >
                <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={onSwitchSides}
                disabled={isThinking && !gameOver && moveHistory.length > 0}
                title="Switch sides"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9Z"></path>
                    <path d="m9 15 3-3-3-3"></path>
                    <path d="m15 15-3-3 3-3"></path>
                </svg>
            </Button>
        </div>
    );
};

// 2. GAME INFORMATION COMPONENT
const GameInfo: React.FC<GameInfoProps> = ({
    gameStatus,
    result,
    gameOver,
    playerColor,
    aiLevel,
    moveHistory
}) => {
    return (
        <Card className="shadow-lg h-full">
            <CardHeader className="pb-2">
                <CardTitle>Game Information</CardTitle>
                <CardDescription>
                    You are playing as {playerColor === 'w' ? 'White' : 'Black'} against AI (Level {aiLevel})
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-0">
                <Tabs defaultValue="moves">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="moves">Move History</TabsTrigger>
                        <TabsTrigger value="info">Game Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="moves" className="space-y-4">
                        <MoveHistory moves={moveHistory.map(item => item.move)} />
                    </TabsContent>

                    <TabsContent value="info" className="space-y-4">
                        <GameStatus status={gameStatus} result={result} gameOver={gameOver} />
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="pt-2">
                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        <span>Chess Game v1.0</span>
                    </div>
                    <div className="flex items-center">
                        <span>©2023 Gaming Platform</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

// 3. GAME STATUS COMPONENT (used in GameInfo)
const GameStatus: React.FC<GameStatusProps> = ({ status, result, gameOver }) => {
    return (
        <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20">
                <h3 className="font-medium mb-2">Current Status</h3>
                {gameOver ? (
                    <div className="space-y-2">
                        <p className="text-sm">Game Result: <span className="font-bold">{result}</span></p>
                        <p className="text-sm">
                            Reason: {
                                status.reason === 'checkmate' ? 'Checkmate' :
                                    status.reason === 'stalemate' ? 'Stalemate' :
                                        status.reason === 'insufficient' ? 'Insufficient Material' :
                                            status.reason === 'threefold' ? 'Threefold Repetition' :
                                                status.reason === 'fifty-move' ? 'Fifty-move Rule' :
                                                    status.reason === 'time' ? 'Time Out' : 'Unknown'
                            }
                        </p>
                    </div>
                ) : (
                    <p className="text-sm">Game in progress</p>
                )}
            </div>
        </div>
    );
};

// 4. MOVE HISTORY COMPONENT
const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves]);

    if (!moves || moves.length === 0) {
        return (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No moves yet</p>
                <p className="text-xs text-muted-foreground mt-1">The move history will appear here</p>
            </div>
        );
    }

    // Group moves by pairs (white and black)
    const groupedMoves: GroupedMove[] = [];
    for (let i = 0; i < moves.length; i += 2) {
        groupedMoves.push({
            number: Math.floor(i / 2) + 1,
            white: moves[i] || null,
            black: moves[i + 1] || null
        });
    }

    return (
        <div
            ref={scrollRef}
            className="border rounded-lg overflow-auto max-h-[400px] bg-card/50"
        >
            <table className="w-full text-sm">
                <thead className="bg-muted/30 sticky top-0">
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
                                {group.white ? group.white.san : ''}
                                {group.white?.captured && (
                                    <span className="ml-1 text-red-500 dark:text-red-400">x</span>
                                )}
                            </td>
                            <td className="p-2 font-medium">
                                {group.black ? group.black.san : ''}
                                {group.black?.captured && (
                                    <span className="ml-1 text-red-500 dark:text-red-400">x</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { GameControls, GameInfo, MoveHistory, GameStatus };
