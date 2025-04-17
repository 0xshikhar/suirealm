// // 1. MAIN GAME COMPONENT
// const ChessGame: React.FC = () => {
//     const [game, setGame] = useState(new Chess());
//     const [fen, setFen] = useState('');
//     const [moveHistory, setMoveHistory] = useState([]);
//     const [gameStatus, setGameStatus] = useState('');
//     const [thinking, setThinking] = useState(false);
//     const [playerColor, setPlayerColor] = useState('w');
//     const [aiLevel, setAiLevel] = useState(2);
//     const [gameOver, setGameOver] = useState(false);
//     const [result, setResult] = useState('');
//     const [playerTime, setPlayerTime] = useState(600); // 10 minutes in seconds
//     const [aiTime, setAiTime] = useState(600);
//     const [isTimerRunning, setIsTimerRunning] = useState(false);
//     const [settings, setSettings] = useState({
//         orientation: 'white',
//         soundEnabled: true,
//         highlightLegalMoves: true,
//         autoQueen: false,
//         timeControl: '10+0', // 10 minutes, 0 increment
//     });

//     const playerTimerRef = useRef(null);
//     const aiTimerRef = useRef(null);
//     const moveAudioRef = useRef(null);
//     const captureAudioRef = useRef(null);
//     const checkAudioRef = useRef(null);

//     // Initialize game
//     useEffect(() => {
//         resetGame();
//     }, []);

//     // Timer logic
//     useEffect(() => {
//         if (isTimerRunning && !gameOver) {
//             const currentTurn = game.turn();

//             if (currentTurn === 'w' && playerColor === 'w') {
//                 // Player's turn (white)
//                 if (playerTimerRef.current) clearInterval(playerTimerRef.current);
//                 playerTimerRef.current = setInterval(() => {
//                     setPlayerTime(prev => {
//                         if (prev <= 1) {
//                             clearInterval(playerTimerRef.current);
//                             setGameOver(true);
//                             setResult('Time out. Black wins!');
//                             return 0;
//                         }
//                         return prev - 1;
//                     });
//                 }, 1000);
//             } else if (currentTurn === 'b' && playerColor === 'b') {
//                 // Player's turn (black)
//                 if (playerTimerRef.current) clearInterval(playerTimerRef.current);
//                 playerTimerRef.current = setInterval(() => {
//                     setPlayerTime(prev => {
//                         if (prev <= 1) {
//                             clearInterval(playerTimerRef.current);
//                             setGameOver(true);
//                             setResult('Time out. White wins!');
//                             return 0;
//                         }
//                         return prev - 1;
//                     });
//                 }, 1000);
//             } else {
//                 // AI's turn
//                 if (aiTimerRef.current) clearInterval(aiTimerRef.current);
//                 aiTimerRef.current = setInterval(() => {
//                     setAiTime(prev => {
//                         if (prev <= 1) {
//                             clearInterval(aiTimerRef.current);
//                             setGameOver(true);
//                             setResult(`Time out. ${playerColor === 'w' ? 'White' : 'Black'} wins!`);
//                             return 0;
//                         }
//                         return prev - 1;
//                     });
//                 }, 1000);
//             }
//         }

//         return () => {
//             if (playerTimerRef.current) clearInterval(playerTimerRef.current);
//             if (aiTimerRef.current) clearInterval(aiTimerRef.current);
//         };
//     }, [game.turn(), isTimerRunning, gameOver, playerColor]);

//     // Update game state
//     useEffect(() => {
//         setFen(game.fen());
//         updateGameStatus();

//         const moves = game.history({ verbose: true });
//         setMoveHistory(moves);

//         // Check for game over conditions
//         if (game.isGameOver()) {
//             setGameOver(true);
//             if (game.isCheckmate()) {
//                 setResult(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
//             } else if (game.isDraw()) {
//                 setResult('Game ended in a draw');
//             } else if (game.isStalemate()) {
//                 setResult('Stalemate');
//             } else if (game.isThreefoldRepetition()) {
//                 setResult('Draw by threefold repetition');
//             } else if (game.isInsufficientMaterial()) {
//                 setResult('Draw by insufficient material');
//             }
//             if (isTimerRunning) {
//                 setIsTimerRunning(false);
//             }
//         } else if (!gameOver && !isTimerRunning && moveHistory.length > 0) {
//             setIsTimerRunning(true);
//         }

//         // If AI's turn, make AI move
//         if (!gameOver && game.turn() !== playerColor[0] && !thinking) {
//             makeAiMove();
//         }
//     }, [game, thinking]);

//     // Reset game
//     const resetGame = () => {
//         const newGame = new Chess();
//         setGame(newGame);
//         setFen(newGame.fen());
//         setMoveHistory([]);
//         setGameStatus('');
//         setGameOver(false);
//         setResult('');
//         setThinking(false);

//         // Reset timers
//         const timeInSeconds = parseInt(settings.timeControl.split('+')[0]) * 60;
//         setPlayerTime(timeInSeconds);
//         setAiTime(timeInSeconds);
//         setIsTimerRunning(false);
//     };

//     // Update game status text
//     const updateGameStatus = () => {
//         if (game.isCheck()) {
//             setGameStatus('Check!');
//             if (settings.soundEnabled && checkAudioRef.current) {
//                 checkAudioRef.current.play();
//             }
//         } else if (game.isCheckmate()) {
//             setGameStatus('Checkmate!');
//             if (settings.soundEnabled && checkAudioRef.current) {
//                 checkAudioRef.current.play();
//             }
//         } else if (game.isDraw()) {
//             setGameStatus('Draw');
//         } else if (game.isStalemate()) {
//             setGameStatus('Stalemate');
//         } else {
//             setGameStatus('');
//         }
//     };

//     // Player move handler
//     const onDrop = (sourceSquare, targetSquare) => {
//         if (thinking || gameOver || game.turn() !== playerColor[0]) return false;

//         try {
//             const moveObj = {
//                 from: sourceSquare,
//                 to: targetSquare,
//                 promotion: settings.autoQueen ? 'q' : undefined,
//             };

//             const move = game.move(moveObj);

//             if (move === null) return false;

//             // Play sound
//             if (settings.soundEnabled) {
//                 if (move.captured) {
//                     captureAudioRef.current?.play();
//                 } else {
//                     moveAudioRef.current?.play();
//                 }
//             }

//             // Create a new instance to trigger state update
//             setGame(new Chess(game.fen()));
//             return true;
//         } catch (error) {
//             return false;
//         }
//     };

//     // AI move logic
//     const makeAiMove = async () => {
//         setThinking(true);

//         // Delay to simulate thinking
//         await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));

//         try {
//             const possibleMoves = game.moves({ verbose: true });
//             if (possibleMoves.length === 0 || gameOver) {
//                 setThinking(false);
//                 return;
//             }

//             // AI difficulty determines how good the move selection is
//             let selectedMove;

//             if (aiLevel === 1) {
//                 // Easy: Random moves
//                 selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
//             } else if (aiLevel === 2) {
//                 // Medium: Slightly smarter - prioritize captures and checks
//                 const captures = possibleMoves.filter(move => move.captured);
//                 const checks = possibleMoves.filter(move => {
//                     const gameCopy = new Chess(game.fen());
//                     gameCopy.move(move);
//                     return gameCopy.isCheck();
//                 });

//                 if (checks.length > 0 && Math.random() > 0.3) {
//                     selectedMove = checks[Math.floor(Math.random() * checks.length)];
//                 } else if (captures.length > 0 && Math.random() > 0.2) {
//                     selectedMove = captures[Math.floor(Math.random() * captures.length)];
//                 } else {
//                     selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
//                 }
//             } else {
//                 // Hard: Use piece-square tables and basic evaluation
//                 selectedMove = findBestMove(game, possibleMoves, 2);
//             }

//             // Make the selected move
//             game.move(selectedMove);

//             // Play sound
//             if (settings.soundEnabled) {
//                 if (selectedMove.captured) {
//                     captureAudioRef.current?.play();
//                 } else {
//                     moveAudioRef.current?.play();
//                 }
//             }

//             // Update game
//             setGame(new Chess(game.fen()));
//         } catch (error) {
//             console.error("AI move error:", error);
//         } finally {
//             setThinking(false);
//         }
//     };

//     // Basic AI evaluation function
//     const findBestMove = (game, moves, depth) => {
//         let bestScore = -Infinity;
//         let bestMove = null;

//         for (const move of moves) {
//             const gameCopy = new Chess(game.fen());
//             gameCopy.move(move);

//             const score = -negamax(gameCopy, depth - 1, -Infinity, Infinity, -1);

//             if (score > bestScore) {
//                 bestScore = score;
//                 bestMove = move;
//             }
//         }

//         return bestMove || moves[Math.floor(Math.random() * moves.length)];
//     };

//     // Negamax algorithm with alpha-beta pruning
//     const negamax = (game, depth, alpha, beta, color) => {
//         if (depth === 0 || game.isGameOver()) {
//             return color * evaluateBoard(game);
//         }

//         const moves = game.moves({ verbose: true });
//         let bestScore = -Infinity;

//         for (const move of moves) {
//             const gameCopy = new Chess(game.fen());
//             gameCopy.move(move);

//             const score = -negamax(gameCopy, depth - 1, -beta, -alpha, -color);
//             bestScore = Math.max(bestScore, score);
//             alpha = Math.max(alpha, score);

//             if (alpha >= beta) {
//                 break;
//             }
//         }

//         return bestScore;
//     };

//     // Board evaluation function
//     const evaluateBoard = (game) => {
//         let score = 0;

//         // Material value
//         const pieceValues = {
//             p: 10,
//             n: 30,
//             b: 30,
//             r: 50,
//             q: 90,
//             k: 900
//         };

//         // Piece-square tables (simplified)
//         const pawnTable = [
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [50, 50, 50, 50, 50, 50, 50, 50],
//             [10, 10, 20, 30, 30, 20, 10, 10],
//             [5, 5, 10, 25, 25, 10, 5, 5],
//             [0, 0, 0, 20, 20, 0, 0, 0],
//             [5, -5, -10, 0, 0, -10, -5, 5],
//             [5, 10, 10, -20, -20, 10, 10, 5],
//             [0, 0, 0, 0, 0, 0, 0, 0]
//         ];

//         // Count material and apply positional bonuses
//         for (let row = 0; row < 8; row++) {
//             for (let col = 0; col < 8; col++) {
//                 const square = String.fromCharCode(97 + col) + (8 - row);
//                 const piece = game.get(square);

//                 if (piece) {
//                     // Material value
//                     const value = pieceValues[piece.type] * (piece.color === 'w' ? 1 : -1);
//                     score += value;

//                     // Positional value (just for pawns as an example)
//                     if (piece.type === 'p') {
//                         const tableRow = piece.color === 'w' ? 7 - row : row;
//                         const positionalValue = pawnTable[tableRow][col] * (piece.color === 'w' ? 1 : -1);
//                         score += positionalValue * 0.1;
//                     }
//                 }
//             }
//         }

//         // Add some randomness for variety
//         score += (Math.random() * 2 - 1);

//         return score;
//     };

//     // Undo last move (both player and AI move)
//     const undoMove = () => {
//         if (moveHistory.length >= 2 && !thinking && !gameOver) {
//             game.undo(); // Undo AI move
//             game.undo(); // Undo player move
//             setGame(new Chess(game.fen()));
//         }
//     };

//     // Change player color
//     const switchSides = () => {
//         if (!thinking && (moveHistory.length === 0 || gameOver)) {
//             setPlayerColor(playerColor === 'w' ? 'b' : 'w');
//             resetGame();
//         }
//     };

//     // Format time for display
//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//     };

//     return (
//         <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 min-h-screen bg-background text-foreground">
//             {/* Hidden audio elements for sounds */}
//             <audio ref={moveAudioRef} src="https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3" preload="auto"></audio>
//             <audio ref={captureAudioRef} src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" preload="auto"></audio>
//             <audio ref={checkAudioRef} src="https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3" preload="auto"></audio>

//             {/* Chessboard area */}
//             <div className="flex flex-col items-center w-full lg:w-2/3">
//                 <div className="w-full max-w-xl aspect-square relative">
//                     {/* AI thinking indicator */}
//                     {thinking && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 rounded-lg">
//                             <div className="bg-background p-4 rounded-lg shadow-lg flex items-center space-x-3">
//                                 <Skeleton className="w-10 h-10 rounded-full animate-pulse" />
//                                 <span className="text-lg font-semibold">AI is thinking...</span>
//                             </div>
//                         </div>
//                     )}

//                     {/* Chessboard */}
//                     <div className="w-full h-full rounded-lg overflow-hidden shadow-xl border-2 border-primary/20">
//                         <Chessboard
//                             position={fen}
//                             onPieceDrop={onDrop}
//                             boardOrientation={settings.orientation}
//                             customBoardStyle={{
//                                 borderRadius: '0.5rem',
//                                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//                             }}
//                             customDarkSquareStyle={{ backgroundColor: 'hsl(var(--primary))' }}
//                             customLightSquareStyle={{ backgroundColor: 'hsl(var(--card))' }}
//                             customPieces={{}}
//                             areArrowsAllowed={true}
//                             showBoardNotation={true}
//                             id="chess-board"
//                         />
//                     </div>

//                     {/* Timer display */}
//                     <div className="flex justify-between mt-4 w-full max-w-xl">
//                         <div className={`p-3 rounded-lg shadow-md ${game.turn() === 'w' && !gameOver ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>
//                             <div className="flex items-center space-x-2">
//                                 <Clock className="w-4 h-4" />
//                                 <span className="font-mono text-lg">{formatTime(playerColor === 'w' ? playerTime : aiTime)}</span>
//                             </div>
//                             <div className="text-xs mt-1">White</div>
//                         </div>

//                         <div className="flex items-center space-x-2">
//                             {!isTimerRunning && moveHistory.length > 0 && !gameOver ? (
//                                 <Button variant="outline" size="icon" onClick={() => setIsTimerRunning(true)}>
//                                     <Play className="w-4 h-4" />
//                                 </Button>
//                             ) : isTimerRunning && !gameOver ? (
//                                 <Button variant="outline" size="icon" onClick={() => setIsTimerRunning(false)}>
//                                     <Pause className="w-4 h-4" />
//                                 </Button>
//                             ) : null}

//                             <GameControls
//                                 onNewGame={resetGame}
//                                 onUndoMove={undoMove}
//                                 onSwitchSides={switchSides}
//                                 isThinking={thinking}
//                                 gameOver={gameOver}
//                                 moveHistory={moveHistory}
//                             />

//                             <SettingsDialog
//                                 settings={settings}
//                                 onChangeSettings={setSettings}
//                                 aiLevel={aiLevel}
//                                 onChangeAiLevel={setAiLevel}
//                             />
//                         </div>

//                         <div className={`p-3 rounded-lg shadow-md ${game.turn() === 'b' && !gameOver ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>
//                             <div className="flex items-center space-x-2">
//                                 <Clock className="w-4 h-4" /> 
//                                 <span className="font-mono text-lg">{formatTime(playerColor === 'b' ? playerTime : aiTime)}</span>
//                             </div>
//                             <div className="text-xs mt-1">Black</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Game information sidebar */}
//             <div className="w-full lg:w-1/3">
//                 <GameInfo
//                     gameStatus={gameStatus}
//                     result={result}
//                     gameOver={gameOver}
//                     playerColor={playerColor}
//                     aiLevel={aiLevel}
//                     moveHistory={moveHistory}
//                 />
//             </div>
//         </div>
//     );
// };
