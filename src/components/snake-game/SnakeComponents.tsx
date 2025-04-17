"use client"
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Separator
} from "@/components/ui";
import { Dices, RefreshCw, Trophy, Flag, History } from 'lucide-react';
import { GameBoardProps, DiceComponentProps, GameStatusProps, GameControlsProps, WinModalProps } from './SnakeTypes';
import { Toaster } from "sonner";

const GameBoard: React.FC<GameBoardProps> = ({
    playerPosition,
    snakesAndLadders,
    boardSize = 10,
    showOverlay = false,
    pathPositions = [],
    showPath
}) => {
    const renderBoard = () => {
        const board = [];

        for (let row = boardSize; row >= 1; row--) {
            const rowCells = [];
            // Alternate row direction to create snake pattern
            const isEvenRow = row % 2 === 0;
            const startCol = isEvenRow ? boardSize : 1;
            const endCol = isEvenRow ? 1 : boardSize;
            const step = isEvenRow ? -1 : 1;

            for (let col = startCol; step > 0 ? col <= endCol : col >= endCol; col += step) {
                const position = (boardSize - row) * boardSize + (isEvenRow ? boardSize - col + 1 : col);

                // Check if this position is the start of a snake or ladder
                const hasSnakeStart = Object.entries(snakesAndLadders)
                    .some(([start, end]) => parseInt(start) === position && parseInt(end) < position);

                const hasLadderStart = Object.entries(snakesAndLadders)
                    .some(([start, end]) => parseInt(start) === position && parseInt(end) > position);

                // Check if this position is the end of a snake or ladder
                const hasSnakeEnd = Object.values(snakesAndLadders)
                    .some((end: string, i: number) => parseInt(end) === position && parseInt(Object.keys(snakesAndLadders)[i]) > position);

                const hasLadderEnd = Object.values(snakesAndLadders)
                    .some((end: string, i: number) => parseInt(end) === position && parseInt(Object.keys(snakesAndLadders)[i]) < position);

                const isPathPosition = showPath && pathPositions.includes(position);

                rowCells.push(
                    <div
                        key={`cell-${position}`}
                        className={`
              relative border border-border w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 
              flex items-center justify-center
              ${position % 2 === 0 ? 'bg-muted/30 dark:bg-muted/10' : 'bg-black '}
              ${hasSnakeStart ? 'border-red-500 border-2' : ''}
              ${hasLadderStart ? 'border-green-500 border-2' : ''}
              ${hasSnakeEnd ? 'bg-red-100/30 dark:bg-red-900/20' : ''}
              ${hasLadderEnd ? 'bg-green-100/30 dark:bg-green-900/20' : ''}
              ${position === 100 ? 'bg-amber-100/50 dark:bg-amber-900/30' : ''}
              ${position === 1 ? 'bg-blue-100/50 dark:bg-blue-900/30' : ''}
              ${isPathPosition ? 'bg-purple-100/50 dark:bg-purple-900/30' : ''}
            `}
                    >
                        <span className="absolute top-0.5 left-1 text-xs text-muted-foreground font-medium">
                            {position}
                        </span>

                        {position === playerPosition && (
                            <motion.div
                                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10"
                                initial={{ scale: 0.8 }}
                                animate={{
                                    scale: [1, 1.1],
                                    boxShadow: [
                                        "0 0 0 0 rgba(var(--primary), 0.2)",
                                        "0 0 0 8px rgba(var(--primary), 0)"
                                    ]
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 2
                                }}
                            >
                                <span className="text-primary-foreground text-xs font-bold">P</span>
                            </motion.div>
                        )}

                        {/* Snake or Ladder Indicator */}
                        {hasSnakeStart && (
                            <span className="absolute bottom-0.5 right-1 text-sm">🐍</span>
                        )}
                        {hasLadderStart && (
                            <span className="absolute bottom-0.5 right-1 text-sm">🪜</span>
                        )}
                    </div>
                );
            }

            board.push(
                <div key={`row-${row}`} className="flex">
                    {rowCells}
                </div>
            );
        }

        return board;
    };

    return (
        <Card className="bg-card shadow-xl">
            <CardContent className="p-2 md:p-4 relative">
                <div className="grid gap-[1px]">
                    {renderBoard()}
                </div>

                {showOverlay && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                            <h2 className="text-3xl font-bold text-foreground">Victory!</h2>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// DiceComponent
const DiceComponent: React.FC<DiceComponentProps> = ({ diceValue, isRolling, onRoll }) => {
    // Array of dice face emoji for different values
    const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    return (
        <Card className="shadow-md w-full">
            <CardContent className="p-4 flex flex-col items-center justify-center">
                <motion.div
                    className="text-5xl md:text-6xl my-4 cursor-pointer select-none"
                    onClick={!isRolling ? onRoll : undefined}
                    animate={isRolling ? {
                        rotate: [0, 90, 180, 270, 360],
                        scale: [1, 1.2, 1]
                    } : {}}
                    transition={isRolling ? {
                        duration: 0.8,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.8, 0.9, 1]
                    } : {}}
                >
                    {diceValue ? diceFaces[diceValue - 1] : "⚀"}
                </motion.div>

                <Button
                    className="mt-2 w-full"
                    size="lg"
                    disabled={isRolling}
                    onClick={onRoll}
                >
                    <Dices className="mr-2 w-4 h-4" />
                    {isRolling ? "Rolling..." : "Roll Dice"}
                </Button>
            </CardContent>
        </Card>
    );
};

// GameStatus Component
const GameStatus: React.FC<GameStatusProps> = ({ moves, playerPosition, gameTime }) => {
    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="shadow-md w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Game Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center text-muted-foreground">
                        <History className="w-4 h-4 mr-2" />
                        <span>Moves</span>
                    </div>
                    <span className="font-medium">{moves}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center text-muted-foreground">
                        <Flag className="w-4 h-4 mr-2" />
                        <span>Position</span>
                    </div>
                    <span className="font-medium">{playerPosition}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
                        <span>Time</span>
                    </div>
                    <span className="font-medium">{formatTime(gameTime)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

// GameControls Component
const GameControls: React.FC<GameControlsProps> = ({ onReset, onShowPath, showPath }) => {
    return (
        <Card className="shadow-md w-full">
            <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="w-full"
                    >
                        <RefreshCw className="mr-2 w-4 h-4" />
                        New Game
                    </Button>

                    <Button
                        variant={showPath ? "default" : "secondary"}
                        onClick={onShowPath}
                        className="w-full"
                    >
                        {showPath ? "Hide Path" : "Show Path"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// WinModal Component
const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, moves, gameTime }) => {
    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-card rounded-lg shadow-xl w-full max-w-md"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Trophy className="w-16 h-16 text-amber-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-center mb-6">
                                Congratulations! You Won!
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Moves:</span>
                                    <span className="font-bold">{moves}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time Taken:</span>
                                    <span className="font-bold">{formatTime(gameTime)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Rating:</span>
                                    <div className="flex">
                                        {Array(Math.min(5, Math.max(1, Math.ceil(30 / moves)))).fill(0).map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 text-amber-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full" onClick={onClose}>
                                Play Again
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SnakeGameWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
        </>
    );
};

export { GameBoard, DiceComponent, GameStatus, GameControls, WinModal, SnakeGameWrapper };