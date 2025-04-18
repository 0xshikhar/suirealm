import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui";
import { StatsDialogProps } from "./TetrisTypes";
import { BarChart, LineChart } from "lucide-react";

const StatsDialog: React.FC<StatsDialogProps> = ({ open, onClose, gameStats, sessions = [] }) => {
    // Calculate averages
    const averageScore = gameStats.gamesPlayed > 0 ? Math.round(gameStats.totalScore / gameStats.gamesPlayed) : 0;
    const averageLines = gameStats.gamesPlayed > 0 ? Math.round(gameStats.totalLines / gameStats.gamesPlayed) : 0;

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <BarChart className="h-5 w-5 mr-2" /> Your Tetris Statistics
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div className="space-y-4 my-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/30 p-3 rounded text-center">
                                <p className="text-muted-foreground text-xs">Games Played</p>
                                <p className="font-bold text-lg">{gameStats.gamesPlayed}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded text-center">
                                <p className="text-muted-foreground text-xs">Total Score</p>
                                <p className="font-bold text-lg">{gameStats.totalScore.toLocaleString()}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded text-center">
                                <p className="text-muted-foreground text-xs">Avg. Score</p>
                                <p className="font-bold text-lg">{averageScore.toLocaleString()}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded text-center">
                                <p className="text-muted-foreground text-xs">Best Level</p>
                                <p className="font-bold text-lg">{gameStats.bestLevel}</p>
                            </div>
                        </div>

                        {sessions.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium mb-2 flex items-center">
                                    <LineChart className="h-4 w-4 mr-1" /> Recent Games
                                </h3>
                                <div className="text-xs">
                                    <div className="grid grid-cols-5 gap-1 font-medium text-muted-foreground mb-1 px-1">
                                        <div>Date</div>
                                        <div>Score</div>
                                        <div>Level</div>
                                        <div>Lines</div>
                                        <div>Time</div>
                                    </div>
                                    {sessions.slice().reverse().map((session, index) => (
                                        <div key={index} className="grid grid-cols-5 gap-1 py-1 px-1 border-b border-muted/30">
                                            <div>{formatDate(session.date)}</div>
                                            <div>{session.score}</div>
                                            <div>{session.level}</div>
                                            <div>{session.lines}</div>
                                            <div>{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default StatsDialog; 