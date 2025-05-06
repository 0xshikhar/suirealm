"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@suiet/wallet-kit"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { recordGamePayment } from "@/lib/services/game-service"
import { contractAddresses } from "@/lib/contracts"
// Import Transaction from our main package
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client"
import { MIST_PER_SUI } from "@mysten/sui/utils"

interface GamePaymentModalProps {
    isOpen: boolean
    onClose: () => void
    gamePath: string
    gameName: string
}

// Token contract address from the prompt
const TOKEN_CONTRACT_ADDRESS = contractAddresses.tokenMint

// Platform wallet that receives the fees (replace with your actual platform wallet address)
const PLATFORM_WALLET_ADDRESS = "0x743ba849228f8ad8c6979395527c553d7e8840ca525ba1b065a8f2522c8673a9"

// Fixed game fee in SUI tokens
const GAME_FEE = 0.01 // 0.01 SUI tokens

export function GamePaymentModal({ isOpen, onClose, gamePath, gameName }: GamePaymentModalProps) {
    const router = useRouter()
    const { address, connected, signAndExecuteTransactionBlock } = useWallet()

    const [isProcessing, setIsProcessing] = useState(false)
    const [txHash, setTxHash] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const gameId = gamePath.split('/').pop() || ""

    // Get the current network and initialize Sui client
    // We'll explicitly set this to devnet for consistency
    const network = 'devnet'
    const client = new SuiClient({ url: getFullnodeUrl(network) })

    const handlePayment = async () => {
        if (!address || !signAndExecuteTransactionBlock) {
            setError("Wallet not connected")
            return
        }

        setIsProcessing(true)
        setError(null)
        setTxHash(null)

        // Check wallet balance before proceeding
        try {
            // Initialize Sui client with the same network as above
            const suiClient = new SuiClient({ url: getFullnodeUrl(network) })

            // Get all coins owned by the address to check gas availability
            const { data: coins } = await suiClient.getCoins({
                owner: address,
            })

            // Check if there are any coins available for gas
            if (!coins || coins.length === 0) {
                setError(`Your wallet has no SUI tokens for gas fees on ${network}. Please get tokens from the faucet.`)
                console.log(`No coins found for address ${address} on ${network}`)
                setIsProcessing(false)
                return
            }

            console.log(`Found ${coins.length} coins for address ${address} on ${network}:`, coins)

            // Check if total balance is too low (less than 0.02 SUI)
            const totalBalance = coins.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0))
            if (totalBalance < 20000000) { // 0.02 SUI in MIST
                setError("Your wallet balance is too low for gas fees. Please get more devnet tokens from the faucet.")
                setIsProcessing(false)
                return
            }
        } catch (balanceError) {
            console.error('Error checking balance:', balanceError)
            // Continue with the transaction attempt anyway
        }

        try {
            // Create a simplified transaction with explicit type definitions
            const txb = new Transaction()

            // Set sender explicitly
            txb.setSender(address)

            // Use an even smaller gas budget to minimize requirements
            txb.setGasBudget(1000000) // 0.001 SUI for gas

            // Convert SUI amount to MIST (1 SUI = 1,000,000,000 MIST)
            const amountInMist = Math.floor(GAME_FEE * Number(MIST_PER_SUI))

            // Alternative payment approach that might work better with devnet
            // Use SUI coin type explicitly
            const [coin] = txb.splitCoins(txb.gas, [amountInMist])
            txb.transferObjects([coin], PLATFORM_WALLET_ADDRESS)

            console.log('Attempting devnet transaction with:', {
                network,
                sender: address,
                recipient: PLATFORM_WALLET_ADDRESS,
                amountInMist,
                gameId,
                gasBudget: 1000000
            })

            // Sign and execute with absolutely minimal options
            // Use 'as any' to bypass type checking between different versions of Transaction
            const result = await signAndExecuteTransactionBlock({
                transactionBlock: txb as any,
                options: {
                    showEffects: true,
                },
            })

            console.log('Transaction result:', result)

            // Check transaction success in a more robust way
            // The transaction is successful if we have a digest and the transaction was executed
            const isSuccessful = !!result.digest &&
                // Either check status directly if available
                (result.effects?.status?.status === 'success' ||
                    // Or consider it successful if we don't have an explicit error
                    (result.effects && !result.effects.status?.error))

            if (isSuccessful) {
                setTxHash(result.digest)
                setIsSuccess(true)

                // Record the payment in your backend
                try {
                    await recordGamePayment({
                        gameId,
                        amount: GAME_FEE,
                        userId: address || "",
                        txHash: result.digest,
                        address: address || "",
                        timestamp: new Date(),
                    })
                } catch (backendError) {
                    console.error('Failed to record payment:', backendError)
                    // Transaction succeeded but backend recording failed
                    // You might want to handle this differently
                }

                // Navigate to game after successful payment
                setTimeout(() => {
                    router.push(gamePath)
                    onClose()
                }, 2000)
            } else {
                throw new Error(`Transaction failed: ${result.effects?.status?.error || 'Unknown error'}`)
            }

        } catch (err) {
            console.error('Payment error:', err)
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        if (!isProcessing) {
            setError(null)
            setTxHash(null)
            setIsSuccess(false)
            onClose()
        }
    }

    // const handlePayment = async () => {
    //     if (!address || !signAndExecuteTransactionBlock) {
    //         setError("Wallet not connected")
    //         return
    //     }

    //     setIsProcessing(true)
    //     setError(null)
    //     setTxHash(null)

    //     try {
    //         // Create a mock transaction for demonstration purposes
    //         // In a real application, you would need to import TransactionBlock from @mysten/sui.js
    //         // and create a proper transaction

    //         // Example pseudocode (not actual implementation):
    //         const txb = new Transaction();
    //         txb.transferSui({
    //             recipient: PLATFORM_WALLET_ADDRESS,
    //             amount: GAME_FEE * 1000000000, // Convert to MIST
    //         });

    //         // Since we don't have access to the proper TransactionBlock, we'll simulate a transaction
    //         // In a real implementation, replace this with proper Sui transaction code
    //         const mockDigest = `mock_tx_${Date.now()}`;

    //         // In a real implementation, this would be the result of executing the transaction
    //         // const result = await signAndExecuteTransactionBlock({
    //         //    transactionBlock: tx,
    //         // });

    //         // execute transaction.
    //         let res = client.executeTransactionBlock({
    //             transactionBlock: bytes,
    //             signature: serializedSignature,
    //         });
    //         console.log(res);

    //         // Simulate a successful transaction
    //         console.log("Simulated transaction successful");
    //         setTxHash(mockDigest);

    //         // Record the game payment in your backend
    //         await recordGamePayment({
    //             gameId: gameId,
    //             txHash: mockDigest,
    //             amount: GAME_FEE,
    //             address: address,
    //         });

    //         setIsSuccess(true);

    //         // Redirect to game after short delay
    //         setTimeout(() => {
    //             onClose();
    //             router.push(gamePath);
    //         }, 2000);

    //     } catch (err: any) {
    //         console.error("Payment error:", err);
    //         setError(err.message || "Failed to process payment");
    //         setIsProcessing(false);
    //     }
    // }

    return (
        <Dialog open={isOpen} onOpenChange={() => !isProcessing && onClose()}>
            <DialogContent className="sm:max-w-md bg-[#202020] border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Play {gameName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        To play this game, you need to pay {GAME_FEE} SUI for each play session.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
                    <div className="bg-[#151515] p-4 rounded-md">
                        <p className="text-sm text-gray-400 mb-2">Payment details:</p>
                        <div className="flex justify-between">
                            <span>Game play fee</span>
                            <span className="font-semibold">{GAME_FEE} SUI</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                            Note: Each play session requires a separate payment
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-800 p-3 rounded-md text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {txHash && (
                        <div className="bg-[#2a2a2a] p-3 rounded-md">
                            <p className="text-sm text-gray-400 mb-1">Transaction Hash:</p>
                            <a
                                href={`https://explorer.sui.io/txblock/${txHash}?network=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-blue-400 hover:text-blue-300 break-all"
                            >
                                {txHash}
                            </a>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    {isSuccess ? (
                        <div className="w-full flex items-center justify-center py-2">
                            <div className="flex items-center gap-2 text-green-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Payment successful! Redirecting to game...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePayment}
                                className="bg-[#98ee2c] text-black hover:bg-[#7bc922] font-bold"
                                disabled={isProcessing || !connected}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Pay & Play Now"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 