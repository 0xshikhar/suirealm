import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Trophy, Handshake, Award, Loader2 } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { chessWinnerABI } from '../../../contract/abi/ChessWinnerABI';
import { chessWinnerNFT } from '@/lib/contracts';
import { GameStatus, PieceColor } from './ChessTypes';
import { GameSettings } from './GameFunctions';
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt
} from "wagmi";
import { ethers } from 'ethers';

// Define interface for component props
interface GameOverDialogProps {
    showGameOverModal: boolean;
    setShowGameOverModal: (show: boolean) => void;
    gameStatus: GameStatus;
    playerColor: PieceColor;
    result: string;
    fen: string;
    settings: GameSettings;
    resetGame: () => void;
    moves: string; // PGN or move history as string
    opponent: string; // Opponent address
    moveCount: number; // Number of moves in the game
}

const NFT_CONTRACT_ADDRESS = chessWinnerNFT;

const GameOverDialog: React.FC<GameOverDialogProps> = ({
    showGameOverModal,
    setShowGameOverModal,
    gameStatus,
    playerColor,
    result,
    fen,
    settings,
    resetGame,
    moves,
    opponent,
    moveCount
}) => {
    const [mintingStatus, setMintingStatus] = useState('idle'); // 'idle', 'minting', 'success', 'error'
    const [txHash, setTxHash] = useState('');

    // Get account information using wagmi hook
    const { address } = useAccount();

    const isWinner = gameStatus.winner && gameStatus.winner === playerColor;

    // Use wagmi's useWriteContract hook to mint the NFT
    const { writeContract, isPending: isMinting, error: writeError } = useWriteContract();

    // Use wagmi's useWaitForTransactionReceipt hook to wait for transaction confirmation
    const {
        data: receipt,
        isSuccess: isConfirmed,
        isError: isReceiptError
    } = useWaitForTransactionReceipt({
        hash: txHash as `0x${string}`,
    });

    // Function to mint the NFT
    const mintWinnerNFT = async () => {
        if (!address) {
            alert("Please connect your wallet to mint NFTs!");
            return;
        }

        try {
            setMintingStatus('minting');

            console.log("Moves:", moves);
            console.log("Moves hex:", `0x${Buffer.from(moves).toString('hex')}`);

            const encodedMoves = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(moves));
            console.log("Encoded moves:", encodedMoves);

            // Ensure encodedMoves is exactly 20 bytes (40 hex characters)
            let paddedEncodedMoves = encodedMoves;

            // Check the length of the encoded moves
            if (paddedEncodedMoves.length < 42) { // 42 because '0x' prefix is included
                // Pad with zeros to the right if less than 20 bytes
                paddedEncodedMoves = paddedEncodedMoves.padEnd(42, '0');
            } else if (paddedEncodedMoves.length > 42) {
                // Truncate to 20 bytes if more than 20 bytes
                paddedEncodedMoves = paddedEncodedMoves.slice(0, 42);
            }

            console.log("Padded/Truncated encoded moves:", paddedEncodedMoves);

            // Determine win type from result text
            let winType = "checkmate";
            if (result.includes("resign")) {
                winType = "resignation";
            } else if (result.includes("time")) {
                winType = "timeout";
            }

            console.log("Minting NFT with parameters:", {
                winner: address,
                fen,
                moves: moves.substring(0, 30) + "...", // Log truncated moves for readability
                opponent,
                isWhite: playerColor === 'w',
                moveCount,
                winType
            });

            const someSecretOrNonce = ethers.utils.hexlify(ethers.utils.randomBytes(32)); // Generate a random 32-byte nonce


            const gameSignature = ethers.utils.keccak256(
                ethers.utils.solidityPack(
                    ['address', 'string', 'bytes32'],
                    [address, fen, someSecretOrNonce] // This is simplified - implement proper signature mechanism
                )
            );

            // Call mintWinnerNFT function using wagmi's writeContract
            writeContract({
                address: NFT_CONTRACT_ADDRESS,
                abi: chessWinnerABI,
                functionName: 'mintWinnerNFT',
                args: [
                    fen,                // finalFen (string)
                    paddedEncodedMoves, // moves (string) - ensure this is a string, not bytes
                    opponent,           // loser address
                    playerColor === 'w', // wasWhite (boolean)
                    moveCount,          // moveCount (uint256)
                    winType,            // winType (string)
                    gameSignature       // gameSignature (bytes32)
                ],
            }, {
                onSuccess(data) {
                    console.log("Transaction sent:", data);
                    setTxHash(data);
                },
                onError(error) {
                    console.error("Error minting NFT:", error);
                    setMintingStatus('error');
                }
            });
        } catch (error) {
            console.error("Error minting NFT:", error);
            setMintingStatus('error');
        }
    };

    // Update status based on transaction receipt
    React.useEffect(() => {
        if (isConfirmed && receipt) {
            console.log("Transaction confirmed:", receipt);
            setMintingStatus('success');
        } else if (isReceiptError) {
            console.error("Transaction failed");
            setMintingStatus('error');
        }
    }, [isConfirmed, isReceiptError, receipt]);

    return (
        <Dialog
            open={showGameOverModal}
            onOpenChange={(open) => {
                console.log("Dialog open state changing to:", open);
                setShowGameOverModal(open);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center text-2xl gap-2">
                        {gameStatus.winner ? (
                            <>
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                {gameStatus.winner === playerColor ? "Victory!" : "Defeat!"}
                            </>
                        ) : (
                            <>
                                <Handshake className="h-6 w-6" />
                                Draw!
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {result}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center my-4">
                    <div className="w-64 h-64">
                        <Chessboard
                            position={fen}
                            boardOrientation={settings.orientation}
                            arePiecesDraggable={false}
                        />
                    </div>
                </div>

                {mintingStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-3 mb-3 text-center">
                        <p className="text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                            <Award className="h-5 w-5" />
                            NFT minted successfully!
                        </p>
                        {txHash && (
                            <a
                                href={`https://scan.test2.btcs.network//tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 underline mt-1 inline-block"
                            >
                                View on Core Testnet Explorer
                            </a>
                        )}
                    </div>
                )}

                {mintingStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-3">
                        <p className="text-red-700 dark:text-red-400 text-center">
                            Failed to mint NFT. Please try again.
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => {
                                console.log("Review Game button clicked");
                                setShowGameOverModal(false);
                            }}>
                                Review Game
                            </Button>
                        </DialogClose>

                        <Button onClick={() => {
                            console.log("New Game button clicked");
                            resetGame();
                            setShowGameOverModal(false);
                        }}>
                            New Game
                        </Button>
                    </div>

                    {/* Only show mint button if player won and hasn't already minted */}
                    {isWinner && mintingStatus !== 'success' && (
                        <Button
                            onClick={mintWinnerNFT}
                            disabled={isMinting}
                            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Minting...
                                </>
                            ) : (
                                <>
                                    <Trophy className="mr-2 h-4 w-4" />
                                    Mint Winner NFT
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameOverDialog;
