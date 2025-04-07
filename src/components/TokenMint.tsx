"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { contractAddresses, contractABIs, blockExplorer } from "@/lib/contracts";
import { useAuth } from "@/hooks/useAuth";

function TokenMint() {
    const [amount, setAmount] = useState<number>(1);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenPrice, setTokenPrice] = useState<number>(0);

    const { address, connected: isConnected, signAndExecuteTransactionBlock } = useWallet();
    const { isAuthenticated } = useAuth();

    // Reset states when transaction completes
    const resetStates = () => {
        setTimeout(() => {
            setIsSuccess(false);
            setError(null);
        }, 5000);
    };

    // Mock state for contract data - in a real app these would be fetched from Sui contract
    const [mintPrice, setMintPrice] = useState<string>("10000000"); // in MIST (smallest unit in Sui)
    const [remainingAllowance, setRemainingAllowance] = useState<number>(10);
    const [tokenSymbol, setTokenSymbol] = useState<string>("GAME");
    const [tokenName, setTokenName] = useState<string>("Game Token");
    
    // Track transaction state manually
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    // In a real implementation, you would fetch these from your Sui contract
    useEffect(() => {
        if (address) {
            // This is where you would fetch the user's remaining allowance
            // For now, we'll just use a mock value
            setRemainingAllowance(10);
        }
    }, [address]);

    // Handle disabled states
    const isDisabled = !isConnected || isPending || isConfirming || remainingAllowance <= 0;
    
    useEffect(() => {
        console.log("State:", {
            isConnected,
            isAuthenticated,
            isPending,
            isConfirming,
            remainingAllowance,
            isDisabled
        });
    }, [isConnected, isAuthenticated, isPending, isConfirming, remainingAllowance, isDisabled]);

    // Handle mint function
    const handleMint = async () => {
        if (mintPrice) {
            setTokenPrice(Number(mintPrice));
        } else {
            setTokenPrice(0);
        }

        console.log("handleMint");
        try {
            setError(null);

            if (!address) {
                setError("Please connect your wallet first");
                return;
            }

            // if (!isAuthenticated) {
            //     setError("Please sign in with your wallet first");
            //     return;
            // }
            
            setIsPending(true);
            
            try {
                // Create a new transaction block
                const txb = new Transaction();
                
                // Call the module function - this is an example, adjust to your contract
                txb.moveCall({
                    target: `${contractAddresses.tokenMint}::token::mint`,
                    arguments: [
                        txb.pure.u64(amount),
                        // Add any other arguments your contract needs
                    ],
                });
                
                // Sign and execute the transaction
                const result = await signAndExecuteTransactionBlock({
                    transactionBlock: txb,
                });
                
                setTxHash(result.digest);
                setIsConfirming(true);
                setIsPending(false);
                
                // For demo purposes, we'll just set it as confirmed after a delay
                setTimeout(() => {
                    setIsConfirming(false);
                    setIsConfirmed(true);
                    setIsSuccess(true);
                    resetStates();
                    
                    // Update the remaining allowance
                    setRemainingAllowance(prev => Math.max(0, prev - amount));
                }, 2000);
            } catch (err) {
                console.error("Transaction error:", err);
                setError("Transaction failed. Please try again.");
                setIsPending(false);
            }
        } catch (err) {
            console.error("Error minting tokens:", err);
            setError(err instanceof Error ? err.message : "Failed to mint tokens");
        }
    };

    // Update UI based on transaction status
    useEffect(() => {
        if (isConfirmed) {
            setIsSuccess(true);
            resetStates();
        }
    }, [isConfirmed]);


    // Add this right before the return statement
    useEffect(() => {
        console.log("Mint state:", {
            address,
            isConnected,
            isAuthenticated,
            remainingAllowance: Number(remainingAllowance || 0),
            mintPrice,
            amount
        });
    }, [address, isConnected, isAuthenticated, remainingAllowance, mintPrice, amount]);

    return (
        <div className="container max-w-4xl py-8">
            <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Mint {tokenName as string || "Tokens"}</CardTitle>
                    <CardDescription>
                        Mint up to {Number(remainingAllowance ?? 10).toString()} tokens per day
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="amount">Amount to Mint</Label>
                                <Badge variant="outline" className="font-mono">
                                    {amount} {tokenSymbol as string || "Tokens"}
                                </Badge>
                            </div>

                            <div className="pt-4 pb-2">
                                <Slider
                                    id="amount"
                                    value={[amount]}
                                    max={Number(remainingAllowance || 10)}
                                    min={1}
                                    step={1}
                                    onValueChange={(value) => setAmount(value[0])}
                                    disabled={!isConnected || Number(remainingAllowance || 0) <= 0}
                                />
                            </div>

                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>1</span>
                                <span>{Number(remainingAllowance || 10)}</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Total Cost</Label>
                            <div className="text-2xl font-bold">
                                {mintPrice ? ((Number(mintPrice) * amount) / 1000000000).toFixed(9) : "0"} SUI
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Plus gas fees
                            </p>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {isSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Success!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Tokens minted successfully!{" "}
                                    {txHash && (
                                        <a
                                            href={`${blockExplorer.tokenMint.split("?")[0]}/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline font-medium"
                                        >
                                            View transaction
                                        </a>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                        onClick={handleMint}
                        disabled={isDisabled}
                    >
                        {isPending || isConfirming ? (
                            <>
                                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                {isPending ? "Confirm in Wallet" : "Processing..."}
                            </>
                        ) : Number(remainingAllowance || 0) <= 0 ? (
                            <>Daily Limit Reached</>
                        ) : (
                            <>Mint Tokens</>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default TokenMint;