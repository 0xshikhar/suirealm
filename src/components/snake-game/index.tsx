"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameBoard, DiceComponent, GameStatus, GameControls, WinModal } from './SnakeComponents';
import { toast, Toaster } from "sonner";


// Main Game Component
const SnakesAndLaddersGame = () => {
    const [playerPosition, setPlayerPosition] = useState(1);
    const [diceValue, setDiceValue] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [moves, setMoves] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showPath, setShowPath] = useState(false);
    const [pathPositions, setPathPositions] = useState<number[]>([]);

    const snakesAndLadders: Record<string, number> = useMemo(() => ({
        // Ladders
        '4': 14,
        '9': 31,
        '20': 38,
        '28': 84,
        '40': 59,
        '51': 67,
        '63': 81,
        '71': 91,

        // Snakes
        '17': 7,
        '54': 34,
        '62': 19,
        '64': 60,
        '87': 24,
        '93': 73,
        '95': 75,
        '99': 78
    }), []);

    // Game Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setGameTime(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Initialize Game
    useEffect(() => {
        if (playerPosition === 1 && moves === 0) {
            setIsTimerRunning(false);
            setGameTime(0);
        } else if (playerPosition > 1 && !gameWon) {
            setIsTimerRunning(true);
        }

        if (playerPosition >= 100) {
            setPlayerPosition(100);
            setGameWon(true);
            setIsTimerRunning(false);
        }
    }, [playerPosition, moves, gameWon]);

    // Calculate a helpful path to show (simplified version)
    useEffect(() => {
        if (showPath) {
            // Generate a simple path that shows ladders and avoids snakes
            const calculatedPath = [];
            let position = 1;

            while (position < 100) {
                calculatedPath.push(position);

                // Look ahead up to 6 steps (dice roll) to find best move
                let bestMove = position + 6; // Default to max roll
                let bestDest = bestMove;

                for (let i = 6; i >= 1; i--) {
                    const newPos = position + i;

                    if (newPos > 100) continue;

                    // If landing on a ladder, this is a good move
                    if (snakesAndLadders[newPos] && snakesAndLadders[newPos] > newPos) {
                        bestMove = newPos;
                        bestDest = snakesAndLadders[newPos];
                        break;
                    }

                    // Avoid snakes
                    if (snakesAndLadders[newPos] && snakesAndLadders[newPos] < newPos) {
                        continue;
                    }

                    // If no special case, take the highest safe roll
                    if (!bestDest || bestDest < newPos) {
                        bestMove = newPos;
                        bestDest = newPos;
                    }
                }

                // Move to the destination
                position = bestDest;
            }

            calculatedPath.push(100);
            setPathPositions(calculatedPath);
        } else {
            setPathPositions([]);
        }
    }, [showPath]);

    // Dice roll handler
    const rollDice = useCallback(() => {
        if (isRolling || gameWon) return;

        setIsRolling(true);
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll);

        // Wait for animation to complete
        setTimeout(() => {
            const newPosition = playerPosition + roll;

            // Show toast for dice roll
            toast.info(`You rolled a ${roll}!`, {
                description: `Moving from position ${playerPosition} to ${newPosition}`,
                duration: 2000,
            });

            // Determine if we landed on a snake or ladder
            let finalPosition = newPosition;
            if (newPosition <= 100 && snakesAndLadders[newPosition]) {
                finalPosition = snakesAndLadders[newPosition];

                // Show toast for snake or ladder
                if (finalPosition > newPosition) {
                    toast.success("You found a ladder! 🪜", {
                        description: `Climbing from position ${newPosition} to ${finalPosition}`,
                        duration: 3000,
                    });
                } else {
                    toast.error("Oh no! A snake! 🐍", {
                        description: `Sliding down from position ${newPosition} to ${finalPosition}`,
                        duration: 3000,
                    });
                }
            }

            // Make sure we land exactly on 100 to win
            if (finalPosition > 100) {
                finalPosition = playerPosition;
                toast.warning("You need to land exactly on 100 to win!", {
                    description: `Staying at position ${playerPosition}`,
                    duration: 2000,
                });
            }

            setPlayerPosition(finalPosition);
            setMoves(m => m + 1);
            setIsRolling(false);
        }, 800);
    }, [playerPosition, isRolling, gameWon, snakesAndLadders]);

    // Reset game handler
    const resetGame = () => {
        setPlayerPosition(1);
        setDiceValue(0);
        setIsRolling(false);
        setGameWon(false);
        setMoves(0);
        setGameTime(0);
        setIsTimerRunning(false);

        toast.info("New game started!", {
            description: "Good luck and have fun!",
            duration: 2000,
        });
    };

    // Toggle path display
    const togglePath = () => {
        setShowPath(!showPath);

        toast.info(showPath ? "Path hidden" : "Path shown", {
            description: showPath
                ? "Play the game without assistance"
                : "A suggested path to victory is now visible",
            duration: 2000,
        });
    };

    // Add effect to show toast when game is won
    useEffect(() => {
        if (gameWon) {
            const rating = Math.min(5, Math.max(1, Math.ceil(30 / moves)));
            const stars = "⭐".repeat(rating);

            toast.success("Congratulations! You won! 🏆", {
                description: `You completed the game in ${moves} moves with a rating of ${stars}`,
                duration: 5000,
            });
        }
    }, [gameWon, moves]);

    // Add initial welcome toast when component mounts
    useEffect(() => {
        toast.info("Welcome to Snakes & Ladders!", {
            description: "Roll the dice, climb the ladders, and avoid the snakes!",
            duration: 3000,
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4 pt-20">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-1">Snakes & Ladders</h1>
                <p className="text-muted-foreground">Roll the dice, climb the ladders, avoid the snakes!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                <div className="lg:col-span-3">
                    <GameBoard
                        playerPosition={playerPosition}
                        snakesAndLadders={snakesAndLadders as unknown as Record<string, string>}
                        showOverlay={gameWon}
                        showPath={showPath}
                        pathPositions={pathPositions}
                    />
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <DiceComponent
                        diceValue={diceValue}
                        isRolling={isRolling}
                        onRoll={rollDice}
                    />

                    <GameStatus
                        moves={moves}
                        playerPosition={playerPosition}
                        gameTime={gameTime}
                    />

                    <GameControls
                        onReset={resetGame}
                        onShowPath={togglePath}
                        showPath={showPath}
                    />

                    {/* create a block here for launching multi player snake game soon bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 */}
                    <div className="flex flex-col gap-2 bg-gradient-to-r from-teal-200 to-lime-200 p-5 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-black">Multiplayer Mode Coming Soon!</h2>
                        <p className="text-muted-foreground text-sm text-gray-700">
                            Join a friend or challenge others online in a thrilling multiplayer experience!
                        </p>
                    </div>

                    <Toaster position="bottom-right" richColors closeButton />

                </div>
            </div>

            <WinModal
                isOpen={gameWon}
                onClose={resetGame}
                moves={moves}
                gameTime={gameTime}
            />
        </div>
    );
};

export default SnakesAndLaddersGame;