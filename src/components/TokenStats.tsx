"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, CoinsIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { contractAddresses, contractABIs, blockExplorer } from "@/lib/contracts";
import { useAuth } from "@/hooks/useAuth";

export default function TokenMintPage() {
    const [amount, setAmount] = useState<number>(1);

    const { address, connected: isConnected } = useWallet();
    const { isAuthenticated } = useAuth();

    // Mock state for contract data - in a real app these would be fetched from Sui contract
    const [mintPrice, setMintPrice] = useState<string>("10000000"); // in MIST (smallest unit in Sui)
    const [remainingAllowance, setRemainingAllowance] = useState<number>(10);
    const [tokenSymbol, setTokenSymbol] = useState<string>("GAME");
    const [tokenBalance, setTokenBalance] = useState<number>(1000);

    // Format balance for display
    const formattedBalance = tokenBalance || 0;
    
    // In a real implementation, you would fetch these from your Sui contract
    useEffect(() => {
        if (address) {
            // This is where you would fetch the user's token balance and remaining allowance
            // For now, we'll just use mock values
            setRemainingAllowance(10);
            setTokenBalance(1000);
        }
    }, [address]);

    // Log state changes
    useEffect(() => {
        console.log("Token stats state:", {
            address,
            isConnected,
            isAuthenticated,
            remainingAllowance,
            mintPrice,
            tokenBalance
        });
    }, [address, isConnected, isAuthenticated, remainingAllowance, mintPrice, tokenBalance]);

    return (
        <div className="container max-w-4xl py-2">
            <h1 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text text-transparent">
                Get your $Game token to play
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <CoinsIcon className="mr-2 h-5 w-5" />
                            Token Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formattedBalance.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">{tokenSymbol as string ?? "Tokens"}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <RefreshCwIcon className="mr-2 h-5 w-5" />
                            Daily Allowance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{remainingAllowance.toString()}</p>
                        <p className="text-sm text-slate-400">Tokens available today</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <InfoIcon className="mr-2 h-5 w-5" />
                            Mint Price
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {mintPrice ? (Number(mintPrice) / 1000000000).toFixed(9) : "0"} SUI
                        </p>
                        <p className="text-sm text-slate-400">Per token</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                    Contract Address:{" "}
                    <a
                        href={blockExplorer.tokenMint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600"
                    >
                        {contractAddresses.tokenMint}
                    </a>
                </p>
            </div>
        </div>
    );
} 