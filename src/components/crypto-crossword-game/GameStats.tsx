import React, { Dispatch, SetStateAction } from "react";
import { useGame } from "./GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "@/components/ui";
import { Trophy, Clock, Zap, Award, Brain, Share2 } from "lucide-react";

interface GameStatsProps {
    showStats: boolean;
    setShowStats: Dispatch<SetStateAction<boolean>>;
}

function GameStats({ showStats, setShowStats }: GameStatsProps) {
    const { state } = useGame();

    // Calculate elapsed time
    const elapsedTime = state.endTime
        ? Math.floor((state.endTime - state.startTime) / 1000)
        : Math.floor((Date.now() - state.startTime) / 1000);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    // Format time as MM:SS
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Calculate accuracy
    const accuracy = state.moves > 0
        ? Math.round((state.completedWords.length / state.moves) * 100)
        : 0;

    // Share stats
    const handleShare = () => {
        const shareText = `
🧩 Crypto Crossword Puzzle 🧩
Score: ${state.score}
Time: ${formattedTime}
Words: ${state.completedWords.length}/${state.words.length}
Hints used: ${3 - state.hints}/3
Accuracy: ${accuracy}%
Play at: CoreRealm.com
        `.trim();

        if (navigator.share) {
            navigator.share({
                title: 'My Crypto Crossword Stats',
                text: shareText
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Stats copied to clipboard!'))
                .catch(console.error);
        }
    };

    return (
        <Dialog open={showStats} onOpenChange={setShowStats}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                        Game Statistics
                    </DialogTitle>
                    <DialogDescription>
                        Your performance in this Crypto Crossword puzzle
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Clock className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-sm text-muted-foreground">Time</span>
                        <span className="text-xl font-bold">{formattedTime}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Zap className="h-8 w-8 text-amber-500 mb-2" />
                        <span className="text-sm text-muted-foreground">Score</span>
                        <span className="text-xl font-bold">{state.score}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Award className="h-8 w-8 text-green-500 mb-2" />
                        <span className="text-sm text-muted-foreground">Words</span>
                        <span className="text-xl font-bold">{state.completedWords.length}/{state.words.length}</span>
                    </div>

                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Brain className="h-8 w-8 text-purple-500 mb-2" />
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                        <span className="text-xl font-bold">{accuracy}%</span>
                    </div>
                </div>

                <div className="bg-muted p-3 rounded-lg mb-4">
                    <h3 className="text-sm font-medium mb-2">Performance Breakdown</h3>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                            <span>Hints Used:</span>
                            <span>{3 - state.hints}/3</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Total Moves:</span>
                            <span>{state.moves}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Difficulty:</span>
                            <span className="capitalize">{state.difficulty}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Completion:</span>
                            <span>{state.isComplete ? 'Complete' : 'In Progress'}</span>
                        </li>
                    </ul>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowStats(false)}>
                        Close
                    </Button>
                    <Button onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Stats
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { GameStats }; 