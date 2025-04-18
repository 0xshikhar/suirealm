"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { Play, Pause, RotateCw, ChevronLeft, ChevronRight, ChevronDown, HelpCircle, Info, Trophy, Share2, BarChart2 } from "lucide-react";
import { GameBoard, ScorePanel, InfoDialog } from "./TetrisComponents";
import { GameControls, GameOverlay } from "./TetrisControls";
import { Tetromino } from "./TetrisTypes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StatsDialog from "./StatsDialog";

// Game Constants
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const TETROMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        color: "bg-cyan-500 border-cyan-600",
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "bg-blue-500 border-blue-600",
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "bg-orange-500 border-orange-600",
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: "bg-yellow-500 border-yellow-600",
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        color: "bg-green-500 border-green-600",
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: "bg-purple-500 border-purple-600",
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        color: "bg-red-500 border-red-600",
    },
};

// GameContainer (Main Component)
const TetrisGame = () => {
    // Game state
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
    const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lines, setLines] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [highScore, setHighScore] = useState(100000);
    const [gameStats, setGameStats] = useState({
        gamesPlayed: 0,
        totalScore: 0,
        totalLines: 0,
        bestLevel: 1,
    });
    const [showStats, setShowStats] = useState(false);
    const router = useRouter();

    const gameInterval = useRef<NodeJS.Timeout | null>(null);
    const dropSpeed = useRef(1000 - (level - 1) * 50);
    const gameStartTime = useRef(Date.now());

    // Add a ref to solve the circular dependency
    const handleGameOverRef = useRef<() => void>();

    // Create empty board
    function createEmptyBoard() {
        return Array.from({ length: BOARD_HEIGHT }, () =>
            Array(BOARD_WIDTH).fill(0)
        );
    }

    // Generate random tetromino
    const randomTetromino = useCallback((): Tetromino => {
        const keys = Object.keys(TETROMINOS);
        const key = keys[Math.floor(Math.random() * keys.length)];
        return {
            ...TETROMINOS[key as keyof typeof TETROMINOS],
            name: key,
        };
    }, []);

    // Initialize game
    const initGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setCurrentPiece(randomTetromino());
        setNextPiece(randomTetromino());
        setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
        setScore(0);
        setLevel(1);
        setLines(0);
        setIsGameOver(false);
        setIsPaused(false);
        dropSpeed.current = 1000;
    }, [randomTetromino]);

    // Start the game
    const startGame = useCallback(() => {
        // Clear any existing game state
        if (gameInterval.current) {
            clearInterval(gameInterval.current);
            gameInterval.current = null;
        }

        initGame();
        setGameStarted(true);
        setIsGameOver(false); // Explicitly reset game over state
        gameStartTime.current = Date.now();
    }, [initGame]);

    // Check for collision
    const checkCollision = useCallback((piece: Tetromino | null, pos: { x: number; y: number }): boolean => {
        if (!piece) return true;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                // Skip empty cells
                if (!piece.shape[y][x]) continue;

                // Get actual position on the board
                const boardX = pos.x + x;
                const boardY = pos.y + y;

                // Check boundaries
                if (
                    boardX < 0 ||
                    boardX >= BOARD_WIDTH ||
                    boardY >= BOARD_HEIGHT
                ) {
                    return true;
                }

                // Check for collision with existing pieces on the board
                if (boardY >= 0 && board[boardY][boardX]) {
                    return true;
                }
            }
        }

        return false;
    }, [board]);

    // Define handleGameOver first
    const handleGameOver = useCallback(() => {
        // Clear game interval
        if (gameInterval.current) {
            clearInterval(gameInterval.current);
            gameInterval.current = null;
        }

        // Update game statistics
        const newStats = {
            gamesPlayed: gameStats.gamesPlayed + 1,
            totalScore: gameStats.totalScore + score,
            totalLines: gameStats.totalLines + lines,
            bestLevel: Math.max(gameStats.bestLevel, level)
        };
        setGameStats(newStats);

        // Save stats to localStorage (only in browser environment)
        if (typeof window !== 'undefined') {
            localStorage.setItem('tetrisStats', JSON.stringify(newStats));

            // Check if current score is higher than high score
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('tetrisHighScore', score.toString());

                toast.success("New High Score 🥳🥳🥳!", {
                    description: `Congratulations! You've set a new high score of ${score}!`,
                    position: "bottom-right"
                });
            } else {
                toast.error(`Game Over! Your final score is ${score}.`, {
                    description: `Try again to beat the high score of ${highScore}!`,
                    position: "bottom-right"
                });
            }

            // Record game session data for analytics
            const gameSession = {
                date: new Date().toISOString(),
                score,
                level,
                lines,
                duration: Math.floor((Date.now() - gameStartTime.current) / 1000),
            };

            // Save session to localStorage
            const sessions = JSON.parse(localStorage.getItem('tetrisSessions') || '[]');
            sessions.push(gameSession);
            localStorage.setItem('tetrisSessions', JSON.stringify(sessions.slice(-10))); // Keep last 10 sessions
        }

        // Add visual effect to show game over
        const boardElement = document.querySelector('.grid-cols-10');
        if (boardElement) {
            boardElement.classList.add('opacity-50');
            setTimeout(() => {
                boardElement.classList.remove('opacity-50');
            }, 2000);
        }
    }, [score, highScore, lines, level, gameStats]);

    // Update the ref whenever handleGameOver changes
    useEffect(() => {
        handleGameOverRef.current = handleGameOver;
    }, [handleGameOver]);

    // Move piece
    const movePiece = useCallback((direction: number) => {
        if (isPaused || isGameOver || !currentPiece) return;

        const newPos = { x: position.x + direction, y: position.y };
        if (!checkCollision(currentPiece, newPos)) {
            setPosition(newPos);
        }
    }, [checkCollision, currentPiece, position, isPaused, isGameOver]);

    // Rotate piece
    const rotatePiece = useCallback(() => {
        if (isPaused || isGameOver || !currentPiece) return;

        // Create a new matrix that is rotated 90 degrees clockwise
        const rotateMatrix = (matrix: number[][]) => {
            const N = matrix.length;
            const rotated = Array.from({ length: N }, () => Array(N).fill(0));

            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    rotated[x][N - 1 - y] = matrix[y][x];
                }
            }

            return rotated;
        };

        const rotatedPiece = {
            ...currentPiece,
            shape: rotateMatrix(currentPiece.shape),
        };

        // Try to rotate, checking for collision
        if (!checkCollision(rotatedPiece, position)) {
            setCurrentPiece(rotatedPiece);
        }
        // If collision, try wall kicks - checking left/right positions
        else {
            // Try moving left
            if (!checkCollision(rotatedPiece, { ...position, x: position.x - 1 })) {
                setCurrentPiece(rotatedPiece);
                setPosition({ ...position, x: position.x - 1 });
            }
            // Try moving right
            else if (!checkCollision(rotatedPiece, { ...position, x: position.x + 1 })) {
                setCurrentPiece(rotatedPiece);
                setPosition({ ...position, x: position.x + 1 });
            }
        }
    }, [checkCollision, currentPiece, position, isPaused, isGameOver]);

    // Now modify addPieceToBoard to use the ref
    const addPieceToBoard = useCallback(() => {
        if (!currentPiece) return;

        const newBoard = [...board];

        // Add tetromino to the board
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;

                    if (boardY < 0) {
                        // Game over if piece is above the board
                        setIsGameOver(true);
                        handleGameOverRef.current?.();
                        return;
                    }

                    newBoard[boardY][boardX] = currentPiece.color;
                }
            }
        }

        setBoard(newBoard);

        // Check for completed lines
        const completedLines: number[] = [];
        newBoard.forEach((row, index) => {
            if (row.every(cell => cell !== 0)) {
                completedLines.push(index);
            }
        });

        if (completedLines.length > 0) {
            // Remove completed lines
            const newBoardAfterLineClears = [...newBoard];
            completedLines.forEach(line => {
                newBoardAfterLineClears.splice(line, 1);
                newBoardAfterLineClears.unshift(Array(BOARD_WIDTH).fill(0));
            });

            setBoard(newBoardAfterLineClears);

            // Update score and level
            const linePoints = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 lines
            const newScore = score + linePoints[completedLines.length - 1] * level;
            const newLines = lines + completedLines.length;
            const newLevel = Math.floor(newLines / 10) + 1;

            setScore(newScore);
            setLines(newLines);

            // Show toast for line clears
            const lineText = completedLines.length === 1 ? "line" : "lines";
            toast.success(`${completedLines.length} ${lineText} cleared!`, {
                description: `+${linePoints[completedLines.length - 1] * level} points`,
                position: "bottom-right"
            });

            if (newLevel !== level) {
                setLevel(newLevel);
                dropSpeed.current = Math.max(100, 1000 - (newLevel - 1) * 50);

                // Show toast for level up
                toast.success(`You've reached level ${newLevel}`, {
                    description: `Speed increased!`,
                    position: "bottom-right"
                });
            }
        }

        // Get next piece
        setCurrentPiece(nextPiece);
        setNextPiece(randomTetromino());
        const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
        setPosition(newPosition);

        // Check if the new piece can be placed at the starting position
        // If not, game over
        if (checkCollision(nextPiece, newPosition)) {
            setIsGameOver(true);
            handleGameOverRef.current?.();
        }
    }, [board, currentPiece, nextPiece, position, randomTetromino, score, level, lines, checkCollision]);


    // Drop piece one row
    const dropPiece = useCallback(() => {
        if (isPaused || isGameOver || !currentPiece) return;

        const newPos = { ...position, y: position.y + 1 };
        if (!checkCollision(currentPiece, newPos)) {
            setPosition(newPos);
        } else {
            addPieceToBoard();
        }
    }, [addPieceToBoard, checkCollision, currentPiece, position, isPaused, isGameOver]);

    // Hard drop piece
    const hardDropPiece = useCallback(() => {
        if (isPaused || isGameOver || !currentPiece) return;

        let dropY = position.y;
        while (!checkCollision(currentPiece, { x: position.x, y: dropY + 1 })) {
            dropY += 1;
        }

        setPosition({ ...position, y: dropY });
        addPieceToBoard();
    }, [addPieceToBoard, checkCollision, currentPiece, position, isPaused, isGameOver]);

    // Handle pause/resume
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted || isGameOver) return;

            switch (e.code) {
                case 'ArrowLeft':
                    movePiece(-1);
                    break;
                case 'ArrowRight':
                    movePiece(1);
                    break;
                case 'ArrowUp':
                    rotatePiece();
                    break;
                case 'ArrowDown':
                    dropPiece();
                    break;
                case 'Space':
                    hardDropPiece();
                    break;
                case 'KeyP':
                    togglePause();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [movePiece, rotatePiece, dropPiece, hardDropPiece, togglePause, gameStarted, isGameOver]);

    // Game loop - automatic piece dropping
    useEffect(() => {
        if (!gameStarted || isPaused || isGameOver) {
            if (gameInterval.current) {
                clearInterval(gameInterval.current);
                gameInterval.current = null;
            }
            return;
        }

        if (!gameInterval.current) {
            gameInterval.current = setInterval(() => {
                dropPiece();
            }, dropSpeed.current);
        }

        return () => {
            if (gameInterval.current) {
                clearInterval(gameInterval.current);
                gameInterval.current = null;
            }
        };
    }, [gameStarted, isPaused, isGameOver, dropPiece, level]);

    // Update game board with current piece
    const renderBoard = useCallback(() => {
        if (!currentPiece) return board;

        // Create a copy of the current board
        const boardCopy = board.map(row => [...row]);

        // Add current piece to the board copy
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;

                    // Only render if within board boundaries
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        boardCopy[boardY][boardX] = currentPiece.color;
                    }
                }
            }
        }

        return boardCopy;
    }, [board, currentPiece, position]);

    // Add a function to view detailed stats
    const viewDetailedStats = () => {
        setShowStats(true);
    };

    // Add a function to share score
    const shareScore = () => {
        if (typeof window !== 'undefined' && navigator.share) {
            navigator.share({
                title: 'My Tetris Score',
                text: `I scored ${score} points in Tetris! Can you beat that?`,
                url: window.location.href,
            }).catch(err => {
                toast.error("Couldn't share your score", {
                    position: "bottom-right"
                });
            });
        } else if (typeof window !== 'undefined' && navigator.clipboard) {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`I scored ${score} points in Tetris! Can you beat that? Play at ${window.location.href}`);
            toast.success("Score copied to clipboard!", {
                position: "bottom-right"
            });
        }
    };

    // Add a function to navigate to leaderboard (to be implemented)
    const viewLeaderboard = () => {
        router.push('/games/tetris/leaderboard');
    };

    // Load game stats from localStorage on component mount
    useEffect(() => {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
            const savedHighScore = localStorage.getItem('tetrisHighScore');
            if (savedHighScore) {
                setHighScore(parseInt(savedHighScore, 10));
            }

            const savedStats = localStorage.getItem('tetrisStats');
            if (savedStats) {
                setGameStats(JSON.parse(savedStats));
            }
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-foreground p-4">
            <Card className={`w-full max-w-4xl bg-gradient-to-r from-teal-200 to-lime-200 opacity-90 text-card-foreground text-black ${!gameStarted ? "bg-gradient-to-r from-teal-200 to-lime-200" : "bg-transparent/50 "}`}>
                <CardHeader className="flex flex-row items-center bg-transparent opacity-50 justify-between pb-2">
                    <CardTitle className={`text-2xl font-bold ${!gameStarted ? "text-black" : "text-white"}`}>Tetris Game</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setInfoOpen(true)}>
                        <HelpCircle className="h-5 w-5" />
                    </Button>
                </CardHeader>

                <CardContent>
                    {!gameStarted ? (
                        <div className="flex flex-col items-center justify-center space-y-6 p-8">
                            <h2 className="text-3xl font-bold text-center">Welcome to Tetris</h2>
                            <p className="text-center text-gray-700 max-w-md">
                                Click the button below to start playing. Use arrow keys to move and rotate pieces.
                            </p>
                            {highScore > 0 && (
                                <p className="text-center font-semibold">High Score: {highScore}</p>
                            )}
                            <Button onClick={startGame} size="lg" className="mt-4">
                                <Play className="mr-2 h-5 w-5" /> Start Game
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
                            <GameBoard board={renderBoard()} isGameOver={isGameOver} />

                            <div className="flex flex-col space-y-6 w-full md:w-auto">
                                <ScorePanel
                                    score={score}
                                    level={level}
                                    lines={lines}
                                    nextPiece={nextPiece}
                                    highScore={highScore}
                                />

                                <GameControls
                                    onMove={movePiece}
                                    onRotate={rotatePiece}
                                    onDrop={hardDropPiece}
                                    onPause={togglePause}
                                    onResume={togglePause}
                                    isPaused={isPaused}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between pt-0">
                    {/* <div className="text-xs text-muted-foreground">CoreDAO Platform</div> */}
                    <div className="text-xs text-black font-bold">v1.0</div>
                </CardFooter>
            </Card>

            <GameOverlay
                isGameOver={isGameOver}
                score={score}
                onRestart={startGame}
                highScore={highScore}
                onViewStats={viewDetailedStats}
                onShareScore={shareScore}
                onViewLeaderboard={viewLeaderboard}
                gameStats={gameStats}
            />

            <InfoDialog
                open={infoOpen}
                onClose={() => setInfoOpen(false)}
            />

            <StatsDialog
                open={showStats}
                onClose={() => setShowStats(false)}
                gameStats={gameStats}
                sessions={typeof window !== 'undefined'
                    ? JSON.parse(localStorage.getItem('tetrisSessions') || '[]')
                    : []}
            />
        </div>
    );
};

export default TetrisGame;