"use client"
import React, { Dispatch, SetStateAction } from "react";
import { HelpCircle, Send, RefreshCcw, Keyboard, Timer, Trophy, Info } from "lucide-react";
import { useGame } from "./GameContext";
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Alert, AlertTitle, AlertDescription, Progress } from "@/components/ui";

interface GameControlsProps {
    keyboardMode: boolean;
    setKeyboardMode: Dispatch<SetStateAction<boolean>>;
    timerActive: boolean;
    setTimerActive: Dispatch<SetStateAction<boolean>>;
    setShowStats: Dispatch<SetStateAction<boolean>>;
}

function GameControls({ keyboardMode, setKeyboardMode, timerActive, setTimerActive, setShowStats }: GameControlsProps) {
    const { state, dispatch } = useGame();

    // Calculate elapsed time
    const elapsedTime = state.endTime
        ? Math.floor((state.endTime - state.startTime) / 1000)
        : Math.floor((Date.now() - state.startTime) / 1000);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    // Format time as MM:SS
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Calculate progress
    const progress = (state.completedWords.length / state.words.length) * 100;

    return (
        <div className="mb-6">
            {state.isComplete && (
                <Alert className="mb-4 bg-primary/10 border-primary">
                    <Trophy className="h-4 w-4 text-primary" />
                    <AlertTitle>Congratulations!</AlertTitle>
                    <AlertDescription>
                        You&apos;ve successfully completed the Crypto Crossword puzzle in {formattedTime}!
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowStats(true)}
                        >
                            <Trophy className="mr-1 h-4 w-4" />
                            View Stats
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dispatch({ type: 'TOGGLE_DIRECTION' })}
                        >
                            {state.currentDirection === 'across' ? 'Going Across' : 'Going Down'}
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setKeyboardMode(!keyboardMode)}
                                    >
                                        <Keyboard className="mr-1 h-4 w-4" />
                                        {keyboardMode ? 'Hide Keyboard' : 'Show Keyboard'}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Toggle virtual keyboard for mobile devices</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setTimerActive(!timerActive)}
                                    >
                                        <Timer className="mr-1 h-4 w-4" />
                                        {formattedTime}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Time elapsed</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={state.hints <= 0}
                                        onClick={() => dispatch({ type: 'USE_HINT' })}
                                    >
                                        <HelpCircle className="mr-1 h-4 w-4" />
                                        Hint ({state.hints})
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reveal the letter in the current cell</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: 'CHECK_SOLUTIONS' })}
                                    >
                                        <Send className="mr-1 h-4 w-4" />
                                        Check
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Check your answers and clear incorrect letters</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => dispatch({ type: 'RESET_GAME' })}
                                    >
                                        <RefreshCcw className="mr-1 h-4 w-4" />
                                        Reset
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reset the puzzle</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowStats(true)}
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View game statistics</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {state.completedWords.length}/{state.words.length} words</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>
        </div>
    );
}

export { GameControls }; 