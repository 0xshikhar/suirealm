import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui";
import { GameBoardProps, ScorePanelProps, GameControlsProps, GameOverlayProps, InfoDialogProps, TetrisGameProps } from "./TetrisTypes";

// Component GameBoard
const GameBoard: React.FC<GameBoardProps> = ({ board, isGameOver }) => {
    return (
        <div className="relative bg-gray-900 dark:bg-gray-950 border-4 border-gray-700 dark:border-gray-800 rounded-md overflow-hidden shadow-lg">
            <div className={`grid grid-cols-10 gap-0.5 p-0.5 ${isGameOver ? 'game-over' : ''}`}>
                {board.map((row, y) =>
                    row.map((cell, x) => (
                        <div
                            key={`${y}-${x}`}
                            className={`aspect-square w-6 sm:w-8 ${cell ? cell : "bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-800"
                                } border rounded-sm transition-colors duration-100`}
                        />
                    ))
                )}
            </div>
            {isGameOver && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold animate-pulse">GAME OVER</div>
                </div>
            )}
        </div>
    );
};

// Component ScorePanel
const ScorePanel: React.FC<ScorePanelProps> = ({ score, level, lines, nextPiece, highScore }) => {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold">Stats</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Score:</div>
                        <div className="text-sm font-bold text-right">{score}</div>
                        <div className="text-sm text-muted-foreground">High Score:</div>
                        <div className="text-sm font-bold text-right">{highScore}</div>
                        <div className="text-sm text-muted-foreground">Level:</div>
                        <div className="text-sm font-bold text-right">{level}</div>
                        <div className="text-sm text-muted-foreground">Lines:</div>
                        <div className="text-sm font-bold text-right">{lines}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold">Next</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex justify-center">
                    <div className="grid grid-cols-4 gap-0.5">
                        {nextPiece?.shape.map((row: number[], y: number) =>
                            row.map((cell: number, x: number) => (
                                <div
                                    key={`next-${y}-${x}`}
                                    className={`aspect-square w-5 ${cell
                                        ? nextPiece.color
                                        : "bg-white/70"
                                        } border rounded-sm`}
                                />
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Component Info Dialog
const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>How to Play</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div className="space-y-2 text-sm my-4">
                        <p><b>Keyboard Controls:</b></p>
                        <p>← → : Move left/right</p>
                        <p>↑ : Rotate piece</p>
                        <p>↓ : Soft drop</p>
                        <p>Space : Hard drop</p>
                        <p>P : Pause/Resume</p>
                        <p><b>Goal:</b> Fill complete rows to clear lines and score points. Game ends when pieces stack to the top.</p>
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export { GameBoard, ScorePanel, InfoDialog };