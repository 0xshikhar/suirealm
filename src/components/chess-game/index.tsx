"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Move, Square } from 'chess.js';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Label,
    Alert,
    AlertTitle,
    AlertDescription
} from '@/components/ui';
import { Clock, Undo, RotateCcw, Settings, Trophy, Info, Play, Pause, Handshake, Shuffle, ArrowLeft, Loader2, Search, Copy, X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toast';
// import types
import { ChessGameState, GameSettings as ChessGameSettings, MoveHistoryItem, PromotionModalState, PieceColor, GameStatus, PromotionPiece } from './ChessTypes';
import { GameControls, MoveHistory, GameInfo } from './GameComponents';
import { ChessTimer, EvaluationBar, SettingsDialog, GameSettings, PromotionDialog } from './GameFunctions';
import { toast } from 'sonner';
import MoveHistoryDisplay from './MoveHistoryDisplay';
import GameStatusDisplay from './GameStatusDisplay';
import GameOverDialog from './GameOverDialog';

// Define types for timer refs
type TimerRef = ReturnType<typeof setInterval> | null;

// Define interface for the main component state
interface ChessGameAppState {
    game: Chess;
    fen: string;
    moveHistory: Move[];
    gameStatus: GameStatus;
    thinking: boolean;
    playerColor: PieceColor;
    aiLevel: number;
    gameOver: boolean;
    result: string;
    playerTime: number;
    aiTime: number;
    isTimerRunning: boolean;
    showPromotionDialog: boolean;
    pendingMove: Move | null;
    evaluation: number;
    showResultDialog: boolean;
    settings: GameSettings;
    highlightedSquares: Record<string, React.CSSProperties>;
    capturedPieces: {
        white: string[];
        black: string[];
    };
    materialAdvantage: number;
    boardSize: number;
    isDarkTheme: boolean;
    analysisMode: boolean;
    hintMove: Move | null;
    showGameOverModal: boolean;
    opponent: string;
}

// 1. MAIN GAME COMPONENT
const ChessGameApp: React.FC = () => {
    // State initialization
    const [game, setGame] = useState<Chess>(new Chess());
    const [fen, setFen] = useState<string>('');
    const [moveHistory, setMoveHistory] = useState<Move[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>({ winner: null, reason: null });
    const [thinking, setThinking] = useState<boolean>(false);
    const [playerColor, setPlayerColor] = useState<PieceColor>('w');
    const [aiLevel, setAiLevel] = useState<number>(2);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');
    const [playerTime, setPlayerTime] = useState<number>(600); // 10 minutes in seconds
    const [aiTime, setAiTime] = useState<number>(600);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [pendingMove, setPendingMove] = useState<any>(null);
    const [evaluation, setEvaluation] = useState<number>(0);
    const [showResultDialog, setShowResultDialog] = useState<boolean>(false);
    const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
    const [hintMove, setHintMove] = useState<Move | null>(null);
    const [analysisMode, setAnalysisMode] = useState<boolean>(false);
    const [boardSize, setBoardSize] = useState<number>(480);
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
    const [opponent, setOpponent] = useState<string>("0x043Bb2629766bB4375c8EC3d0CbbfA77bC7e7BC9"); // AI wallet address

    // Calculate material advantage and captured pieces
    const [materialAdvantage, setMaterialAdvantage] = useState<number>(0);
    const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({
        white: [],
        black: []
    });

    // Highlighted squares for legal moves
    const [highlightedSquares, setHighlightedSquares] = useState<Record<string, React.CSSProperties>>({});

    const [settings, setSettings] = useState<GameSettings>({
        orientation: 'white',
        soundEnabled: true,
        highlightLegalMoves: true,
        autoQueen: false,
        timeControl: '10+0', // 10 minutes, 0 increment
    });

    // Refs for timers and audio
    const playerTimerRef = useRef<TimerRef>(null);
    const aiTimerRef = useRef<TimerRef>(null);
    const moveAudioRef = useRef<HTMLAudioElement | null>(null);
    const captureAudioRef = useRef<HTMLAudioElement | null>(null);
    const checkAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize game
    useEffect(() => {
        resetGame();
        return () => {
            if (playerTimerRef.current) clearInterval(playerTimerRef.current);
            if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        };
    }, []);

    // Update game state when moves change
    useEffect(() => {
        updateGameState();
    }, [game]);

    // Process AI's move when it's AI's turn
    useEffect(() => {
        if (game.turn() !== playerColor && !gameOver && !thinking) {
            makeAiMove();
        }
    }, [game.turn(), playerColor, gameOver]);

    // Start timer when game starts
    useEffect(() => {
        if (!gameOver && moveHistory.length > 0 && !isTimerRunning) {
            setIsTimerRunning(true);
        }
    }, [moveHistory, gameOver]);

    // Timer logic
    useEffect(() => {
        if (isTimerRunning && !gameOver) {
            // Clear any existing intervals
            if (playerTimerRef.current) clearInterval(playerTimerRef.current);
            if (aiTimerRef.current) clearInterval(aiTimerRef.current);

            const currentTurn = game.turn();

            if (currentTurn === playerColor) {
                // Player's turn
                playerTimerRef.current = setInterval(() => {
                    setPlayerTime(prev => {
                        if (prev <= 1) {
                            if (playerTimerRef.current) clearInterval(playerTimerRef.current);
                            setGameOver(true);
                            setGameStatus({
                                winner: playerColor === 'w' ? 'b' : 'w',
                                reason: 'time'
                            });
                            setResult(`Time out. ${playerColor === 'w' ? 'Black' : 'White'} wins!`);
                            setShowGameOverModal(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                // AI's turn
                aiTimerRef.current = setInterval(() => {
                    setAiTime(prev => {
                        if (prev <= 1) {
                            if (aiTimerRef.current) clearInterval(aiTimerRef.current);
                            setGameOver(true);
                            setGameStatus({
                                winner: playerColor,
                                reason: 'time'
                            });
                            setResult(`Time out. ${playerColor === 'w' ? 'White' : 'Black'} wins!`);
                            setShowGameOverModal(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }

        return () => {
            if (playerTimerRef.current) clearInterval(playerTimerRef.current);
            if (aiTimerRef.current) clearInterval(aiTimerRef.current);
        };
    }, [game.turn(), isTimerRunning, gameOver, playerColor]);

    // Reset the game to the starting position
    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setMoveHistory([]);
        setGameStatus({ winner: null, reason: null });
        setThinking(false);
        setGameOver(false);
        setResult('');

        // Reset timers based on time control
        const timeInMinutes = parseInt(settings.timeControl.split('+')[0]);
        const newTimeInSeconds = timeInMinutes * 60;
        setPlayerTime(newTimeInSeconds);
        setAiTime(newTimeInSeconds);
        setIsTimerRunning(false);

        // Random evaluation for demonstration
        setEvaluation(Math.floor(Math.random() * 60) - 30);

        // Reset captured pieces
        setCapturedPieces({ white: [], black: [] });
        setMaterialAdvantage(0);

        if (playerColor === 'b') {
            setTimeout(() => makeAiMove(), 500);
        }
    };

    // Add a function to check if the game is over and show the appropriate modal
    const checkGameOver = useCallback(() => {

        // Check if there are any legal moves
        const legalMoves = game.moves({ verbose: true });

        if (legalMoves.length === 0) {
            console.log("GAME OVER: No legal moves available");

            setGameOver(true);
            setIsTimerRunning(false);

            // Determine the reason for game over
            if (game.isCheckmate()) {
                const winner = game.turn() === 'w' ? 'b' : 'w';
                setGameStatus({
                    winner: winner,
                    reason: 'checkmate'
                });
                setResult(`Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins.`);
                console.log(`Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins.`);
            } else if (game.isDraw()) {
                if (game.isStalemate()) {
                    setGameStatus({ winner: null, reason: 'stalemate' });
                    setResult('Draw by stalemate');
                    console.log('Draw by stalemate');
                } else if (game.isThreefoldRepetition()) {
                    setGameStatus({ winner: null, reason: 'threefold' });
                    setResult('Draw by threefold repetition');
                    console.log('Draw by threefold repetition');
                } else if (game.isInsufficientMaterial()) {
                    setGameStatus({ winner: null, reason: 'insufficient' });
                    setResult('Draw by insufficient material');
                    console.log('Draw by insufficient material');
                } else {
                    setGameStatus({ winner: null, reason: 'fifty-move' });
                    setResult('Draw by fifty-move rule');
                    console.log('Draw by fifty-move rule');
                }
            } else {
                // This should not happen, but just in case
                setGameStatus({ winner: null, reason: null });
                setResult('Game over');
                console.log('Game over for unknown reason');
            }

            // Show the game over modal
            setTimeout(() => {
                setShowGameOverModal(true);
                console.log("Game over modal should be showing now:", {
                    gameOver: true,
                    result,
                    gameStatus,
                    showGameOverModal: true
                });

                // Also show a toast notification
                if (gameStatus.winner) {
                    const isPlayerWinner = gameStatus.winner === playerColor;
                    toast[isPlayerWinner ? 'success' : 'error'](
                        isPlayerWinner ? 'Victory!' : 'Defeat!',
                        { description: result }
                    );
                } else {
                    toast.info('Draw!', { description: result });
                }
            }, 500);

            return true;
        }

        return false;
    }, [game, playerColor, result, gameStatus]);

    // Update game state after a move
    const updateGameState = () => {
        // Update FEN
        setFen(game.fen());

        // Get and update move history
        const history = game.history({ verbose: true });
        console.log("Current move history:", history);

        // Always update move history to ensure it's current
        setMoveHistory(history);

        // Check for game over conditions using our new function
        if (checkGameOver()) {
            console.log("Game is over, state updated");
            return; // Exit early since we've handled the game over state
        } else if (game.isCheck()) {
            // Play check sound and show notification
            if (settings.soundEnabled && checkAudioRef.current) {
                checkAudioRef.current.play().catch(() => { });
            }
            showCheckNotification();
        }

        // Update material advantage and captured pieces
        updateMaterialCount(history);

        // Update highlighted squares for legal moves
        if (settings.highlightLegalMoves) {
            updateHighlightedSquares();
        }
    };

    // Update material count and captured pieces
    const updateMaterialCount = (history: Move[]) => {
        // Simple implementation - in a real app you'd want to track the actual board state
        const captured: { white: string[], black: string[] } = { white: [], black: [] };

        history.forEach(move => {
            if (move.captured) {
                if (move.color === 'w') {
                    captured.white.push(move.captured);
                } else {
                    captured.black.push(move.captured);
                }
            }
        });

        setCapturedPieces(captured);

        // Calculate material advantage (simplified)
        const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
        let advantage = 0;

        captured.white.forEach(piece => {
            advantage += pieceValues[piece] || 0;
        });

        captured.black.forEach(piece => {
            advantage -= pieceValues[piece] || 0;
        });

        setMaterialAdvantage(advantage);
    };

    // Update highlighted squares for legal moves
    const updateHighlightedSquares = () => {
        const squares: Record<string, React.CSSProperties> = {};

        // Get all legal moves
        const moves = game.moves({ verbose: true });

        // Get the selected square if any
        const selectedSquare = document.querySelector('.selected-square')?.getAttribute('data-square');

        if (selectedSquare) {
            // If a square is selected, highlight only moves from that square
            const movesFromSquare = moves.filter(move => move.from === selectedSquare);

            // Highlight the selected square
            squares[selectedSquare] = {
                background: 'rgba(255, 215, 0, 0.5)',
                boxShadow: 'inset 0 0 0 2px rgba(255, 215, 0, 0.8)'
            };

            // Highlight destination squares
            movesFromSquare.forEach(move => {
                squares[move.to] = move.captured
                    ? {
                        background: 'rgba(255, 0, 0, 0.3)',
                        boxShadow: 'inset 0 0 0 2px rgba(255, 0, 0, 0.8)',
                        borderRadius: '50%'
                    }
                    : {
                        background: 'rgba(0, 128, 0, 0.3)',
                        boxShadow: 'inset 0 0 0 2px rgba(0, 128, 0, 0.8)',
                        borderRadius: '50%'
                    };
            });
        } else {
            // If no square is selected, highlight all squares with pieces that can move
            const uniqueFromSquares = Array.from(new Set(moves.map(move => move.from)));

            uniqueFromSquares.forEach(square => {
                squares[square] = {
                    background: 'rgba(173, 216, 230, 0.3)',
                    boxShadow: 'inset 0 0 0 2px rgba(173, 216, 230, 0.8)'
                };
            });
        }

        setHighlightedSquares(squares);
    };

    // Add this function to properly update the move history
    const updateMoveHistory = (move: Move) => {
        // Log the move for debugging
        console.log(`Move played: ${move.san}`, {
            from: move.from,
            to: move.to,
            piece: move.piece,
            color: move.color,
            captured: move.captured
        });

        // Get the full history from the game
        const history = game.history({ verbose: true });
        setMoveHistory(history);
        console.log("history", history);

        // Log who made the move (player or AI)
        const isPlayerMove = move.color === playerColor;
        console.log(`${isPlayerMove ? 'Player' : 'AI'} moved ${move.piece} from ${move.from} to ${move.to}`);

        // Show a toast notification for the move
        if (!isPlayerMove) {
            // For AI moves, we already show a toast in the makeAiMove function
        } else {
            // For player moves
            toast.success(`Your Move: ${move.san}`, {
                description: `${move.piece.toUpperCase()} from ${move.from} to ${move.to}${move.captured ? ` captures ${move.captured}` : ''}`,
                duration: 3000,
            });
        }
    };

    // Add this function to properly track captured pieces after each move
    const updateCapturedPieces = (move: Move) => {
        if (move.captured) {
            console.log(`Piece captured: ${move.captured} by ${move.color === 'w' ? 'White' : 'Black'}`);

            // Update captured pieces based on who captured what
            if (move.color === 'w') {
                // White captured a black piece
                setCapturedPieces(prev => ({
                    ...prev,
                    white: [...prev.white, move.captured!] // Add non-null assertion since we know captured exists in this context
                }));
            } else {
                // Black captured a white piece
                setCapturedPieces(prev => ({
                    ...prev,
                    black: [...prev.black, move.captured!] // Add non-null assertion since we know captured exists in this context
                }));
            }

            // Update material advantage
            const pieceValues: Record<string, number> = {
                'p': 1,
                'n': 3,
                'b': 3,
                'r': 5,
                'q': 9
            };

            const capturedValue = pieceValues[move.captured] || 0;
            setMaterialAdvantage(prev =>
                move.color === 'w' ? prev + capturedValue : prev - capturedValue
            );

            console.log("Updated captured pieces:", {
                white: move.color === 'w' ? [...capturedPieces.white, move.captured] : capturedPieces.white,
                black: move.color === 'b' ? [...capturedPieces.black, move.captured] : capturedPieces.black
            });
        }
    };

    // Modify the makeMove function to update captured pieces
    const makeMove = (move: { from: Square; to: Square; promotion?: string }) => {
        if (gameOver || thinking) return false;

        try {
            // Attempt to make the move
            const result = game.move(move);

            if (result) {
                // Play appropriate sound
                if (settings.soundEnabled) {
                    if (result.captured) {
                        captureAudioRef.current?.play().catch(() => { });
                    } else {
                        moveAudioRef.current?.play().catch(() => { });
                    }
                }

                // Update captured pieces if a piece was captured
                if (result.captured) {
                    updateCapturedPieces(result);
                }

                // Get the full history directly from the game object
                const fullHistory = game.history({ verbose: true });
                console.log("Move made, history:", fullHistory);

                // Update the move history state
                setMoveHistory(fullHistory);

                // Update FEN
                setFen(game.fen());

                // Call updateGameState to check for game over, etc.
                updateGameState();

                return true;
            }
            return false;
        } catch (error) {
            console.error("Invalid move:", error);
            return false;
        }
    };

    // Handle pawn promotion
    const handlePromotion = (piece: PromotionPiece) => {
        if (!pendingMove) return;

        const move = {
            from: pendingMove.from,
            to: pendingMove.to,
            promotion: piece
        };

        const result = makeMove(move);

        // Close the dialog and clear the pending move
        setShowPromotionDialog(false);
        setPendingMove(null);

        return result;
    };

    // Modify the makeAiMove function to properly handle game over
    const makeAiMove = () => {
        if (gameOver || thinking) return;

        setThinking(true);

        // Simulate AI thinking time based on difficulty
        const thinkingTime = 500 + (aiLevel * 300);

        setTimeout(() => {
            try {
                // Get all legal moves
                const moves = game.moves({ verbose: true });

                if (moves.length === 0) {
                    console.log("No legal moves available for AI - GAME OVER");
                    setThinking(false);

                    // Explicitly check game over conditions
                    checkGameOver();
                    return;
                }

                // Find the best move based on AI level
                const bestMove = findBestMove(game, moves, aiLevel);

                // Make the move
                const result = game.move({
                    from: bestMove.from,
                    to: bestMove.to,
                    promotion: bestMove.promotion
                });

                // Play sound
                if (settings.soundEnabled) {
                    if (bestMove.captured) {
                        captureAudioRef.current?.play().catch(() => { });
                    } else {
                        moveAudioRef.current?.play().catch(() => { });
                    }
                }

                // Get the full history directly from the game object
                const fullHistory = game.history({ verbose: true });
                console.log("AI move made, history:", fullHistory);

                // Update the move history state
                setMoveHistory(fullHistory);

                // Update FEN
                setFen(game.fen());

                // Log the AI move
                logAIMove(bestMove, evaluation, `Level ${aiLevel}`);

                // Check if the game is over after AI move
                checkGameOver();

            } catch (error) {
                console.error("Error making AI move:", error);
            } finally {
                setThinking(false);
            }
        }, thinkingTime);
    };

    // Improved findBestMove function for better AI
    const findBestMove = (game: Chess, moves: Move[], depth: number) => {
        let bestScore = -Infinity;
        let bestMove = null;

        for (const move of moves) {
            const gameCopy = new Chess(game.fen());
            gameCopy.move(move);

            const score = -negamax(gameCopy, depth - 1, -Infinity, Infinity, -1);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove || moves[Math.floor(Math.random() * moves.length)];
    };

    // Negamax algorithm with alpha-beta pruning
    const negamax = (game: Chess, depth: number, alpha: number, beta: number, color: number) => {
        if (depth === 0 || game.isGameOver()) {
            return color * evaluateBoard(game);
        }

        const moves = game.moves({ verbose: true });
        let bestScore = -Infinity;

        for (const move of moves) {
            const gameCopy = new Chess(game.fen());
            gameCopy.move(move);

            const score = -negamax(gameCopy, depth - 1, -beta, -alpha, -color);
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);

            if (alpha >= beta) {
                break;
            }
        }

        return bestScore;
    };

    // Board evaluation function
    const evaluateBoard = (game: Chess) => {
        let score = 0;

        // Material value
        const pieceValues: Record<string, number> = {
            p: 10,
            n: 30,
            b: 30,
            r: 50,
            q: 90,
            k: 900
        };

        // Piece-square tables (simplified)
        const pawnTable = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5, 5, 10, 25, 25, 10, 5, 5],
            [0, 0, 0, 20, 20, 0, 0, 0],
            [5, -5, -10, 0, 0, -10, -5, 5],
            [5, 10, 10, -20, -20, 10, 10, 5],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        // Count material and apply positional bonuses
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = String.fromCharCode(97 + col) + (8 - row);
                const piece = game.get(square as Square);

                if (piece) {
                    // Material value
                    const value = pieceValues[piece.type] * (piece.color === 'w' ? 1 : -1);
                    score += value;

                    // Positional value (just for pawns as an example)
                    if (piece.type === 'p') {
                        const tableRow = piece.color === 'w' ? 7 - row : row;
                        const positionalValue = pawnTable[tableRow][col] * (piece.color === 'w' ? 1 : -1);
                        score += positionalValue * 0.1;
                    }
                }
            }
        }

        // Add some randomness for variety
        score += (Math.random() * 2 - 1);

        return score;
    };

    // Handle move on the chessboard
    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        if (game.turn() !== playerColor || gameOver || thinking) return false;

        // Get the promotion piece if needed
        let promotionPiece = undefined;

        // Check if it's a pawn promotion move
        const piece = game.get(sourceSquare);
        const isPromotion =
            piece &&
            piece.type === 'p' &&
            ((piece.color === 'w' && targetSquare[1] === '8') ||
                (piece.color === 'b' && targetSquare[1] === '1'));

        if (isPromotion && settings.autoQueen) {
            promotionPiece = 'q'; // Auto queen
        }

        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: promotionPiece
        };

        const moveResult = makeMove(move);

        // Check for game over after player's move
        if (moveResult) {
            checkGameOver();
        }

        return moveResult;
    };

    // Undo the last two moves (player's move and AI's response)
    const undoMove = () => {
        if (moveHistory.length > 0 && !gameOver && !thinking) {
            // Undo AI move and player move
            game.undo();

            // If the first move was by the AI, undo just once
            if (playerColor === 'b' && moveHistory.length === 1) {
                setFen(game.fen());
                return;
            }

            game.undo();
            setFen(game.fen());

            // Reset game status
            setGameStatus({ winner: null, reason: null });
            setGameOver(false);
            setResult('');
        }
    };

    // Switch player color
    const switchSides = () => {
        if (moveHistory.length === 0 && !thinking) {
            setPlayerColor(playerColor === 'w' ? 'b' : 'w');
            setSettings({
                ...settings,
                orientation: playerColor === 'w' ? 'black' : 'white'
            });

            if (playerColor === 'w') {
                // Player is now black, AI should make the first move
                setTimeout(() => makeAiMove(), 500);
            }
        }
    };

    // Format a move for display
    const formatMove = (move: Move): string => {
        return `${move.from} → ${move.to}${move.promotion ? ` (=${move.promotion})` : ''}`;
    };

    // Get a hint for the player
    const getMoveHint = () => {
        if (gameOver || thinking || game.turn() !== playerColor) return;

        setThinking(true);

        setTimeout(() => {
            const moves = game.moves({ verbose: true });
            if (moves.length > 0) {
                // Find a good move using the same AI logic
                const hintMove = findBestMove(game, moves, 2);
                setHintMove(hintMove);
            }
            setThinking(false);
        }, 1000);
    };

    // Toggle analysis mode
    const toggleAnalysisMode = () => {
        setAnalysisMode(!analysisMode);
    };

    // Copy current FEN to clipboard
    const copyFEN = () => {
        navigator.clipboard.writeText(game.fen())
            .then(() => {
                // Show a toast or notification that FEN was copied
                console.log("FEN copied to clipboard");
            })
            .catch(err => {
                console.error("Failed to copy FEN: ", err);
            });
    };

    // Render piece icon for captured pieces display
    const renderPieceIcon = (piece: string, color: PieceColor) => {
        const pieceSymbols: Record<string, string> = {
            'p': '♟',
            'n': '♞',
            'b': '♝',
            'r': '♜',
            'q': '♛',
            'k': '♚'
        };

        return (
            <span className={`text-xl ${color === 'w' ? 'text-white' : 'text-black'}`}>
                {pieceSymbols[piece]}
            </span>
        );
    };

    // Add a function to show check notification
    const showCheckNotification = () => {
        toast.success("Check!", {
            description: `${game.turn() === 'w' ? 'White' : 'Black'} is in check.`,
            duration: 3000,
        });
    };

    // Add this function to handle square click for move visualization and execution
    const onSquareClick = (square: Square) => {
        if (game.turn() !== playerColor || gameOver || thinking) return;

        // Get the piece on the clicked square
        const piece = game.get(square);

        // Check if we already have a selected square (with highlighted moves)
        const hasHighlightedMoves = Object.keys(highlightedSquares).length > 0;

        // If the square has a piece of the current player's color
        if (piece && piece.color === game.turn()) {
            // Update highlighted squares to show possible moves
            const newHighlightedSquares: Record<string, React.CSSProperties> = {};

            // Highlight the selected square
            newHighlightedSquares[square] = {
                background: 'rgba(255, 215, 0, 0.5)',
                boxShadow: 'inset 0 0 0 2px rgba(255, 215, 0, 0.8)'
            };

            // Get legal moves from this square
            const moves = game.moves({
                square: square,
                verbose: true
            });

            // Highlight destination squares
            moves.forEach(move => {
                newHighlightedSquares[move.to] = move.captured
                    ? {
                        background: 'rgba(255, 0, 0, 0.3)',
                        boxShadow: 'inset 0 0 0 2px rgba(255, 0, 0, 0.8)',
                        borderRadius: '50%'
                    }
                    : {
                        background: 'rgba(0, 128, 0, 0.3)',
                        boxShadow: 'inset 0 0 0 2px rgba(0, 128, 0, 0.8)',
                        borderRadius: '50%'
                    };
            });

            setHighlightedSquares(newHighlightedSquares);
        }
        // If clicking on a highlighted square (a valid destination)
        else if (hasHighlightedMoves && highlightedSquares[square]) {
            // Find the source square (the one that's highlighted with gold color)
            const sourceSquare = Object.entries(highlightedSquares).find(
                ([sq, style]) => style.background === 'rgba(255, 215, 0, 0.5)'
            )?.[0] as Square;

            if (sourceSquare) {
                // Check if it's a promotion move
                const movingPiece = game.get(sourceSquare);
                const isPromotion =
                    movingPiece &&
                    movingPiece.type === 'p' &&
                    ((movingPiece.color === 'w' && square[1] === '8') ||
                        (movingPiece.color === 'b' && square[1] === '1'));

                if (isPromotion && !settings.autoQueen) {
                    // Store the pending move and show promotion dialog
                    setPendingMove({ from: sourceSquare, to: square });
                    setShowPromotionDialog(true);
                } else {
                    // Make the move directly
                    const move = {
                        from: sourceSquare,
                        to: square,
                        promotion: isPromotion ? 'q' : undefined // Auto-queen if needed
                    };

                    makeMove(move);
                }

                // Clear highlights after move
                setHighlightedSquares({});
            }
        } else {
            // Clicked on an empty square or opponent's piece without having a piece selected
            // Clear highlights
            setHighlightedSquares({});
        }
    };

    // Add this function to the component for AI move logging
    const logAIMove = (move: Move, evaluation: number, difficulty: string) => {
        console.log(`AI (${difficulty}) played: ${move.san}`, {
            from: move.from,
            to: move.to,
            piece: move.piece,
            captured: move.captured,
            evaluation: evaluation
        });

        // Also show a toast notification for the AI move
        toast.success(`AI Move (${difficulty})`, {
            description: `${move.san}${move.captured ? ` captures ${move.captured}` : ''}`,
            duration: 3000,
        });
    };

    return (
        <div className="flex flex-col min-h-screen max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-background text-foreground">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L8 6H16L12 2Z" className="fill-primary" />
                        <path d="M18 8H6V10C6 11.1 6.9 12 8 12H16C17.1 12 18 11.1 18 10V8Z" className="fill-primary" />
                        <path d="M17 14H7L5 22H19L17 14Z" className="fill-primary" />
                    </svg>
                    <h1 className="text-2xl font-bold">Chess Master AI</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={resetGame} variant="outline" size="sm">
                        New Game
                    </Button>
                </div>
            </header>

            {/* Game Status Banner - Shows on game over */}
            {gameOver && (
                <Alert className="mb-6">
                    <AlertTitle className="flex items-center gap-2">
                        {gameStatus.winner ? (
                            <>
                                <Trophy className="h-4 w-4" />
                                {gameStatus.winner === playerColor ? "You won!" : "Computer won!"}
                            </>
                        ) : (
                            <>
                                <Handshake className="h-4 w-4" />
                                Draw!
                            </>
                        )}
                    </AlertTitle>
                    <AlertDescription>
                        {gameStatus.reason === 'checkmate' && "Game ended by checkmate"}
                        {gameStatus.reason === 'stalemate' && "Game ended by stalemate"}
                        {gameStatus.reason === 'insufficient' && "Draw by insufficient material"}
                        {gameStatus.reason === 'threefold' && "Draw by threefold repetition"}
                        {gameStatus.reason === 'fifty-move' && "Draw by fifty-move rule"}
                        {gameStatus.reason === 'time' && "Game ended by timeout"}
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Chess Board + Controls */}
                <div className="flex-1">
                    {/* Game controls */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={undoMove}
                                variant="outline"
                                size="sm"
                                disabled={moveHistory.length === 0 || gameOver || thinking}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Undo
                            </Button>
                            <Button
                                onClick={switchSides}
                                variant="outline"
                                size="sm"
                                disabled={moveHistory.length > 0 || thinking}
                            >
                                <Shuffle className="w-4 h-4 mr-2" />
                                Switch Sides
                            </Button>
                        </div>

                        <SettingsDialog
                            settings={settings}
                            onChangeSettings={setSettings}
                            aiLevel={aiLevel}
                            onChangeAiLevel={setAiLevel}
                        />
                    </div>

                    {/* Timer for opponent/AI */}
                    <ChessTimer
                        seconds={aiTime}
                        active={game.turn() !== playerColor && !gameOver}
                        playerName="Computer"
                        color={playerColor === 'w' ? 'b' : 'w'}
                    />

                    {/* Chess Board with Evaluation Bar */}
                    <div className="flex mt-4 mb-4 items-center">
                        <EvaluationBar evaluation={evaluation} />
                        <div className="flex-1 relative">
                            {thinking && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg z-10">
                                    <div className="bg-card p-3 rounded-md shadow-lg">
                                        <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                                        <span className="font-medium">AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <Chessboard
                                position={fen}
                                onPieceDrop={onDrop}
                                onSquareClick={onSquareClick}
                                boardOrientation={settings.orientation}
                                showBoardNotation={true}
                                boardWidth={boardSize}
                                customDarkSquareStyle={{
                                    backgroundColor: isDarkTheme ? 'rgb(80, 90, 100)' : 'rgb(181, 136, 99)',
                                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                                }}
                                customLightSquareStyle={{
                                    backgroundColor: isDarkTheme ? 'rgb(120, 130, 140)' : 'rgb(240, 217, 181)',
                                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                                }}
                                customSquareStyles={highlightedSquares}
                                customBoardStyle={{
                                    borderRadius: '4px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)'
                                }}
                                customPieces={{
                                    // You can customize pieces here if needed
                                }}
                            />
                        </div>
                    </div>

                    {/* Timer for player */}
                    <ChessTimer
                        seconds={playerTime}
                        active={game.turn() === playerColor && !gameOver}
                        playerName="You"
                        color={playerColor}
                    />
                </div>

                {/* Right Column - Game Info */}
                <div className="lg:w-80 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Game Information</CardTitle>
                            <CardDescription>
                                {gameOver
                                    ? 'Game completed'
                                    : (
                                        <span className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${game.turn() === 'w' ? 'bg-white border border-black/30' : 'bg-black border border-white/10'}`}></span>
                                            <strong>{game.turn() === 'w' ? 'White' : 'Black'}&apos;s turn</strong>
                                            {game.turn() === playerColor && <span className="text-primary">(Your turn)</span>}
                                        </span>
                                    )
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="moves">
                                <TabsList className="w-full">
                                    <TabsTrigger value="moves" className="flex-1">Moves</TabsTrigger>
                                    <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                                </TabsList>
                                <TabsContent value="moves" className="mt-4">
                                    <MoveHistoryDisplay moves={moveHistory} />
                                </TabsContent>
                                <TabsContent value="status" className="mt-4">
                                    <GameStatusDisplay
                                        capturedPieces={capturedPieces}
                                        materialAdvantage={materialAdvantage}
                                        moveCount={moveHistory.length}
                                        renderPieceIcon={renderPieceIcon}
                                    />
                                </TabsContent>
                            </Tabs>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-4 p-2 bg-muted/20 rounded-md text-xs">
                                    <details>
                                        <summary className="cursor-pointer font-medium">Debug: Move History ({moveHistory.length} moves)</summary>
                                        <pre className="mt-2 overflow-auto max-h-[200px]">
                                            {JSON.stringify(moveHistory.map(m => ({
                                                san: m.san,
                                                from: m.from,
                                                to: m.to,
                                                piece: m.piece,
                                                color: m.color
                                            })), null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Game actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Game Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button
                                    onClick={resetGame}
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    New Game
                                </Button>

                                <Button
                                    onClick={getMoveHint}
                                    variant="outline"
                                    className="w-full justify-start"
                                    disabled={gameOver || thinking || game.turn() !== playerColor}
                                >
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    Get Hint
                                </Button>

                                <Button
                                    onClick={toggleAnalysisMode}
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start",
                                        analysisMode && "bg-primary/10"
                                    )}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    {analysisMode ? "Exit Analysis" : "Analysis Mode"}
                                </Button>

                                <Button
                                    onClick={copyFEN}
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy FEN
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Audio elements for sound effects */}
            <audio ref={moveAudioRef} src="/sounds/move.mp3" preload="auto" />
            <audio ref={captureAudioRef} src="/sounds/capture.mp3" preload="auto" />
            <audio ref={checkAudioRef} src="/sounds/check.mp3" preload="auto" />

            {/* Game over modal - Enhanced version */}
            <GameOverDialog
                showGameOverModal={showGameOverModal}
                setShowGameOverModal={setShowGameOverModal}
                gameStatus={gameStatus}
                playerColor={playerColor}
                result={result}
                fen={fen}
                settings={settings}
                resetGame={resetGame}
                moves={moveHistory.map(move => move.san).join(' ')} // Convert moves to PGN format
                opponent={opponent} // AI's wallet address
                moveCount={moveHistory.length}
            />

            {/* Promotion selection dialog */}
            <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Promote Pawn</DialogTitle>
                        <DialogDescription>
                            Choose a piece to promote your pawn
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-4 gap-4 py-4">
                        {['q', 'r', 'n', 'b'].map(piece => (
                            <Button
                                key={piece}
                                variant="outline"
                                className="w-16 h-16 p-1"
                                onClick={() => handlePromotion(piece as PromotionPiece)}
                            >
                                <div className="w-full h-full">
                                    {renderPieceIcon(piece, playerColor)}
                                </div>
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Move hint toast */}
            {hintMove && (
                <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="text-yellow-500" />
                        <div>
                            <p className="font-medium">Suggested Move:</p>
                            <p>{formatMove(hintMove)}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => setHintMove(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Check indicator */}
            {game.isCheck() && !gameOver && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse z-50 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                    <span className="font-bold">Check!</span>
                    <span>{game.turn() === 'w' ? 'White' : 'Black'} is in check</span>
                </div>
            )}
        </div>
    );
}

export default ChessGameApp;

