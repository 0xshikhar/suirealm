import { Button } from "@/components/ui";
import { ChevronLeft, ChevronDown, ChevronRight, RotateCw, Play, Pause, Trophy, Share2, BarChart2 } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui";
import { GameControlsProps, GameOverlayProps } from "./TetrisTypes";

// Component GameControls
const GameControls: React.FC<GameControlsProps> = ({ onMove, onRotate, onDrop, onPause, onResume, isPaused }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-2 mb-2">
                <Button onClick={() => onMove(-1)} variant="outline" size="icon" className="aspect-square bg-white text-black">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button onClick={onDrop} variant="default" size="icon" className="aspect-square bg-white text-black">
                    <ChevronDown className="h-6 w-6" />
                </Button>
                <Button onClick={() => onMove(1)} variant="outline" size="icon" className="aspect-square bg-white text-black">
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={onRotate} variant="outline" className="w-full bg-white text-black">
                    <RotateCw className="mr-2 h-4 w-4" /> Rotate
                </Button>
                <Button
                    onClick={isPaused ? onResume : onPause}
                    variant={isPaused ? "default" : "secondary"}
                    className="w-full"
                >
                    {isPaused ? (
                        <><Play className="mr-2 h-4 w-4" /> Resume</>
                    ) : (
                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    )}
                </Button>
            </div>
        </div>
    );
};

// Component GameOverlay
const GameOverlay: React.FC<GameOverlayProps> = ({
    isGameOver,
    score,
    onRestart,
    highScore,
    onViewStats,
    onShareScore,
    onViewLeaderboard,
    gameStats
}) => {
    if (!isGameOver) return null;

    const isNewHighScore = score > highScore;

    return (
        <AlertDialog open={isGameOver}>
            <AlertDialogContent className="bg-background border-border max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl">
                        {isNewHighScore ? "🏆 New High Score! 🏆" : "Game Over"}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div className="space-y-4 my-4">
                        {isNewHighScore ? (
                            <div className="text-center animate-pulse">
                                <p className="text-lg font-bold">Congratulations!</p>
                                <p>You&apos;ve set a new high score of <span className="font-bold text-xl">{score}</span>!</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p>Your final score is <span className="font-bold">{score}</span>.</p>
                                <p>The high score is <span className="font-bold">{highScore}</span>.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                            <div className="bg-muted/30 p-2 rounded text-center">
                                <p className="text-muted-foreground">Games Played</p>
                                <p className="font-bold">{gameStats.gamesPlayed}</p>
                            </div>
                            <div className="bg-muted/30 p-2 rounded text-center">
                                <p className="text-muted-foreground">Best Level</p>
                                <p className="font-bold">{gameStats.bestLevel}</p>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={onShareScore}
                            >
                                <Share2 className="h-4 w-4 mr-1" /> Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={onViewStats}
                            >
                                <BarChart2 className="h-4 w-4 mr-1" /> Stats
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={onViewLeaderboard}
                            >
                                <Trophy className="h-4 w-4 mr-1" /> Ranks
                            </Button>
                        </div>
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onRestart} className="w-full">
                        Play Again
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export { GameControls, GameOverlay };