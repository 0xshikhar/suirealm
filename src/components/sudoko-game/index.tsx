import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { Separator } from "@/components/ui";
import GameProvider from "./SudokoProvider";
import { SudokuBoard, NumberControls, GameControls, GameStatus, DifficultySelector, KeyboardShortcutsHelp } from "./SudokoComponents";


// Main component
const SudokuGame = () => {
    return (
        <GameProvider>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-foreground">
                <Card className="w-full max-w-md shadow-lg relative">
                    <KeyboardShortcutsHelp />
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold">Sudoku</CardTitle>
                            <DifficultySelector />
                        </div>
                        <CardDescription>Challenge your mind with Sudoku puzzles</CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                        <GameStatus />
                        <Separator className="my-2" />
                        <SudokuBoard />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <NumberControls />
                        <GameControls />
                    </CardFooter>
                </Card>
            </div>
        </GameProvider>
    );
};

export default SudokuGame;