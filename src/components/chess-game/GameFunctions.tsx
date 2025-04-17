"use client"

import React from 'react';
import { Settings, Clock, Trophy } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Define interfaces for component props

interface GameSettings {
    orientation: 'white' | 'black';
    timeControl: string;
    soundEnabled: boolean;
    highlightLegalMoves: boolean;
    autoQueen: boolean;
}

interface SettingsDialogProps {
    settings: GameSettings;
    onChangeSettings: (settings: GameSettings) => void;
    aiLevel: number;
    onChangeAiLevel: (level: number) => void;
}

interface ChessTimerProps {
    seconds: number;
    active: boolean;
    playerName: string;
    color: 'w' | 'b';
}

interface PromotionDialogProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
    onPromotion: (piece: 'q' | 'r' | 'n' | 'b') => void;
}

interface EvaluationBarProps {
    evaluation: number;
}

interface GameResultDialogProps {
    isOpen: boolean;
    result: string;
    onNewGame: () => void;
    onClose: (value: boolean) => void;
}

// 1. SETTINGS DIALOG COMPONENT
const SettingsDialog: React.FC<SettingsDialogProps> = ({
    settings,
    onChangeSettings,
    aiLevel,
    onChangeAiLevel
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Settings">
                    <Settings className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Game Settings</DialogTitle>
                    <DialogDescription>
                        Adjust how you want to play the chess game.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="ai-difficulty">AI Difficulty</Label>
                        <Select
                            value={aiLevel.toString()}
                            onValueChange={(value: string) => onChangeAiLevel(parseInt(value))}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Easy</SelectItem>
                                <SelectItem value="2">Medium</SelectItem>
                                <SelectItem value="3">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="board-orientation">Board Orientation</Label>
                        <Select
                            value={settings.orientation}
                            onValueChange={(value: 'white' | 'black') =>
                                onChangeSettings({ ...settings, orientation: value })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select orientation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="white">White</SelectItem>
                                <SelectItem value="black">Black</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="time-control">Time Control</Label>
                        <Select
                            value={settings.timeControl}
                            onValueChange={(value: string) =>
                                onChangeSettings({ ...settings, timeControl: value })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5+0">5 min</SelectItem>
                                <SelectItem value="10+0">10 min</SelectItem>
                                <SelectItem value="15+0">15 min</SelectItem>
                                <SelectItem value="30+0">30 min</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="sound-toggle">Sound Effects</Label>
                            <p className="text-sm text-muted-foreground">Enable move sounds</p>
                        </div>
                        <Switch
                            id="sound-toggle"
                            checked={settings.soundEnabled}
                            onCheckedChange={(checked: boolean) =>
                                onChangeSettings({ ...settings, soundEnabled: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="highlights-toggle">Highlight Legal Moves</Label>
                            <p className="text-sm text-muted-foreground">Show possible moves</p>
                        </div>
                        <Switch
                            id="highlights-toggle"
                            checked={settings.highlightLegalMoves}
                            onCheckedChange={(checked: boolean) =>
                                onChangeSettings({ ...settings, highlightLegalMoves: checked })
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="auto-queen-toggle">Auto Queen</Label>
                            <p className="text-sm text-muted-foreground">Automatically promote to queen</p>
                        </div>
                        <Switch
                            id="auto-queen-toggle"
                            checked={settings.autoQueen}
                            onCheckedChange={(checked: boolean) =>
                                onChangeSettings({ ...settings, autoQueen: checked })
                            }
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// 7. TIMER COMPONENT
const ChessTimer: React.FC<ChessTimerProps> = ({ seconds, active, playerName, color }) => {
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const remainingSeconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg ${active ? 'bg-primary/10 border border-primary' : 'bg-muted border border-border'} transition-all duration-300`}>
            <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${color === 'w' ? 'bg-white border border-black/30' : 'bg-black border border-white/10'}`}></div>
                <span className="font-medium">{playerName}</span>
            </div>
            <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <span className={`${active ? 'text-primary font-bold' : 'text-foreground'} tabular-nums`}>
                    {formatTime(seconds)}
                </span>
            </div>
        </div>
    );
};

// 8. PROMOTION DIALOG
const PromotionDialog: React.FC<PromotionDialogProps> = ({ isOpen, onClose, onPromotion }) => {
    const pieces: Array<'q' | 'r' | 'n' | 'b'> = ['q', 'r', 'n', 'b']; // queen, rook, knight, bishop
    const pieceNames: Record<string, string> = {
        'q': 'Queen',
        'r': 'Rook',
        'n': 'Knight',
        'b': 'Bishop'
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[300px]">
                <DialogHeader>
                    <DialogTitle>Pawn Promotion</DialogTitle>
                    <DialogDescription>
                        Select a piece to promote your pawn
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-2 py-4">
                    {pieces.map(piece => (
                        <Button
                            key={piece}
                            variant="outline"
                            className="h-16 p-1 flex flex-col items-center justify-center"
                            onClick={() => onPromotion(piece)}
                        >
                            <div className="text-2xl mb-1">
                                {piece === 'q' && '♛'}
                                {piece === 'r' && '♜'}
                                {piece === 'n' && '♞'}
                                {piece === 'b' && '♝'}
                            </div>
                            <span className="text-xs">{pieceNames[piece]}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// 9. EVALUATION BAR
const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation }) => {
    // Evaluation is in centipawns, where positive is good for white
    // Convert to a percentage for the bar (max ±10)
    const getPercentage = (): number => {
        // Clamp evaluation between -1000 and 1000 centipawns
        const clampedEval = Math.min(Math.max(evaluation, -1000), 1000);
        // Convert to percentage (50% is even)
        return 50 + (clampedEval / 20);
    };

    const percentage: number = getPercentage();

    return (
        <div className="h-[400px] w-4 bg-muted rounded-sm overflow-hidden relative mr-3">
            <div
                className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-300"
                style={{ height: `${percentage}%` }}
            ></div>
            {evaluation !== 0 && (
                <div
                    className="absolute left-0 right-0 h-[1px] bg-gray-400 dark:bg-gray-600"
                    style={{ bottom: '50%' }}
                ></div>
            )}
        </div>
    );
};

// 10. GAME RESULT DIALOG
const GameResultDialog: React.FC<GameResultDialogProps> = ({ isOpen, result, onNewGame, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Game Over</DialogTitle>
                </DialogHeader>
                <div className="p-6 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-xl font-bold mb-4">{result}</h3>
                    <p className="mb-6 text-muted-foreground">
                        Thank you for playing! Would you like to start a new game?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => onClose(false)}>
                            Review Game
                        </Button>
                        <Button onClick={onNewGame}>
                            New Game
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export {
    SettingsDialog,
    ChessTimer,
    PromotionDialog,
    EvaluationBar,
    GameResultDialog,
    // Export type definitions too for importing elsewhere
    type GameSettings,
    type SettingsDialogProps,
    type ChessTimerProps,
    type PromotionDialogProps,
    type EvaluationBarProps,
    type GameResultDialogProps
};
