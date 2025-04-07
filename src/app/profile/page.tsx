"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount, useBalance } from "wagmi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Loader2, Trophy, History, Wallet, Gamepad, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAuth } from "@/hooks/useAuth"
import { GameScoreCard } from "@/components/profile/GameScoreCard"
import { contractAddresses } from "@/lib/contracts"

// Token contract address
const TOKEN_CONTRACT_ADDRESS = contractAddresses.tokenMint as `0x${string}`

interface UserProfile {
    id: string
    name: string
    walletAddress: string
    createdAt: string
}

interface Transaction {
    id: string
    type: string
    amount: number
    tokenSymbol: string
    txHash: string
    status: string
    description: string
    createdAt: string
}

interface GameStat {
    game: {
        id: string
        name: string
        slug: string
        imagePath: string
    }
    playCount: number
    lastPlayed: string
    highScore: number
    recentScores: Array<{
        score: number
        achievedAt: string
    }>
    transactionTimes: string[]
}

interface GameActivity {
    name: string;
    playCount: number;
    transactions: Transaction[];
}

export default function ProfilePage() {
    const { address, isConnected } = useAccount()
    const { isAuthenticated, isLoading: isAuthLoading, login } = useAuth()

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [gameStats, setGameStats] = useState<GameStat[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Get REALM token balance
    const { data: tokenBalance, isLoading: isBalanceLoading } = useBalance({
        address,
        token: TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    })

    // Handle wallet authentication
    useEffect(() => {
        if (isConnected && address && isAuthenticated) {
            fetchProfileData()
        }
    }, [isConnected, address, isAuthenticated])

    // Define fetchProfileData as a useCallback to avoid dependency issues
    const fetchProfileData = useCallback(async () => {
        if (!isConnected || !address) return

        try {
            setIsLoading(true)

            // Fetch profile data
            const profileRes = await fetch(`/api/profile?address=${address}`)
            const profileData = await profileRes.json()

            if (profileData.user) {
                setProfile(profileData.user)
            }

            // Fetch transactions
            const txRes = await fetch(`/api/profile/transactions?address=${address}`)
            const txData = await txRes.json()

            if (txData.transactions) {
                setTransactions(txData.transactions)
            }

            // Fetch game stats
            const gameRes = await fetch(`/api/profile/games?address=${address}`)
            const gameData = await gameRes.json()

            if (gameData.gameStats) {
                setGameStats(gameData.gameStats)
            }
        } catch (error) {
            console.error("Error fetching profile data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [address, isConnected])

    const gamesPlayedCount = transactions.filter(tx => tx.type === "GAME_PAYMENT").length;

    // Add a manual login handler for the connect button
    const handleManualLogin = async () => {
        try {
            await login()
        } catch (error) {
            console.error("Manual login failed:", error)
        }
    }

    if (isLoading || isAuthLoading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-[#98ee2c]" />
                    <p className="mt-4 text-gray-400">Loading profile data...</p>
                </div>
            </div>
        )
    }

    if (!isConnected) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
                    <p className="text-gray-400 mb-6">Please connect your wallet to view your profile</p>
                    <ConnectButton />
                </div>
            </div>
        )
    }

    if (isConnected && !isAuthenticated) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
                    <p className="text-gray-400 mb-6">Please sign a message to authenticate your wallet</p>
                    <button
                        onClick={handleManualLogin}
                        className="bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Summary */}
                <div className="lg:col-span-1">
                    <Card className="bg-[#202020] border-gray-700 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle>Profile</CardTitle>
                            <CardDescription className="text-gray-400">Your account information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center mb-6">
                                <Avatar className="h-24 w-24 mb-4">
                                    {/* <AvatarImage src={profile?.image || ""} /> */}
                                    <AvatarFallback className="bg-[#151515] text-[#98ee2c] text-xl">
                                        {profile?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold">{profile?.name}</h2>
                                <p className="text-gray-400 text-sm">{profile?.walletAddress || "Not connected"}</p>

                                <div className="mt-4 w-full">
                                    <div className="bg-[#151515] p-4 rounded-md mb-4">
                                        <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                                        <p className="text-sm font-mono break-all">
                                            {address || profile?.walletAddress || "Not connected"}
                                        </p>
                                    </div>

                                    <div className="bg-[#151515] p-4 rounded-md">
                                        <p className="text-sm text-gray-400 mb-1">REALM Token Balance</p>
                                        {isBalanceLoading ? (
                                            <Skeleton className="h-6 w-24 bg-gray-700" />
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="text-xl font-bold text-[#98ee2c]">
                                                    {tokenBalance ? parseFloat(tokenBalance.formatted).toFixed(2) : "0.00"}
                                                </span>
                                                <span className="ml-2 text-gray-400">REALM</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Account Stats</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-[#151515] p-3 rounded-md">
                                        <p className="text-xs text-gray-400">Member Since</p>
                                        <p className="font-medium">
                                            {profile?.createdAt
                                                ? new Date(profile.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-[#151515] p-3 rounded-md">
                                        <p className="text-xs text-gray-400">Games Played</p>
                                        <p className="font-medium">
                                            {gamesPlayedCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="transactions" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-8 bg-[#202020]">
                            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#98ee2c] data-[state=active]:text-black">
                                <History className="mr-2 h-4 w-4" />
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value="games" className="data-[state=active]:bg-[#98ee2c] data-[state=active]:text-black">
                                <Gamepad className="mr-2 h-4 w-4" />
                                Games
                            </TabsTrigger>

                            <TabsTrigger value="achievements" className="data-[state=active]:bg-[#98ee2c] data-[state=active]:text-black">
                                <Calendar className="mr-2 h-4 w-4" />
                                Events
                            </TabsTrigger>
                        </TabsList>

                        {/* Games Tab */}
                        <TabsContent value="games">
                            <Card className="bg-[#202020] border-gray-700 text-white">
                                <CardHeader>
                                    <CardTitle>Your Games</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Games you&apos;ve played and your scores
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {gameStats.length === 0 ? (
                                        <div>
                                            {transactions.filter(tx => tx.type === "GAME_PAYMENT").length > 0 ? (
                                                <div className="space-y-6">
                                                    <h3 className="text-lg font-medium text-white mb-4">Your Game Activity</h3>
                                                    {transactions
                                                        .filter(tx => tx.type === "GAME_PAYMENT")
                                                        .reduce<GameActivity[]>((games, tx) => {
                                                            // Extract game name from description (assuming format like "Payment for Game: Chess")
                                                            const gameName = tx.description.includes("Game:")
                                                                ? tx.description.split("Game:")[1].trim()
                                                                : tx.description;

                                                            // Format the display name to be more user-friendly
                                                            const displayName = gameName.replace(/^Payment for playing game: /i, "Played Game: ");

                                                            // Check if game already exists in our array
                                                            const existingGame = games.find(g => g.name === displayName);

                                                            if (existingGame) {
                                                                existingGame.playCount++;
                                                                existingGame.transactions.push(tx);
                                                            } else {
                                                                games.push({
                                                                    name: displayName,
                                                                    playCount: 1,
                                                                    transactions: [tx]
                                                                });
                                                            }

                                                            return games;
                                                        }, [])
                                                        .map((game, index) => (
                                                            <div key={index} className="bg-[#151515] rounded-lg p-4">
                                                                <div className="flex items-center mb-4">
                                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 bg-gray-800 flex items-center justify-center">
                                                                        <Gamepad className="h-8 w-8 text-gray-500" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-lg font-bold">{game.name}</h3>
                                                                        <div className="flex items-center text-sm text-gray-400">
                                                                            <span className="mr-3">Played: {game?.playCount || 0} times</span>
                                                                            <span>
                                                                                Last played: {new Date(game.transactions[game.transactions.length - 1].createdAt).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-auto">
                                                                        <Link
                                                                            href="/games"
                                                                            className="bg-[#98ee2c] text-black px-3 py-1 rounded text-sm font-bold hover:bg-[#7bc922] transition-colors"
                                                                        >
                                                                            Find Games
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Gamepad className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                                    <h3 className="text-lg font-medium text-white mb-2">No Games Played Yet</h3>
                                                    <p className="text-gray-400 mb-4">Start playing to see your stats here</p>
                                                    <Link
                                                        href="/games"
                                                        className="bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                                    >
                                                        Browse Games
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {gameStats.map((stat) => (
                                                <div key={stat.game.id} className="bg-[#151515] rounded-lg p-4">
                                                    <div className="flex items-center mb-4">
                                                        <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4">
                                                            <Image
                                                                src={stat.game.imagePath || "/images/game-placeholder.jpg"}
                                                                alt={stat.game.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">{stat.game.name}</h3>
                                                            <div className="flex items-center text-sm text-gray-400">
                                                                <span className="mr-3">Played: {stat.playCount} times</span>
                                                                {stat.transactionTimes.length > 0 && (
                                                                    <span>
                                                                        Last played: {new Date(stat.transactionTimes[stat.transactionTimes.length - 1]).toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <Link
                                                                href={`/games/${stat.game.slug}`}
                                                                className="bg-[#98ee2c] text-black px-3 py-1 rounded text-sm font-bold hover:bg-[#7bc922] transition-colors"
                                                            >
                                                                Play Again
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-gray-700 pt-3 mt-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-sm font-medium text-gray-400">High Score</h4>
                                                            <span className="text-xl font-bold text-[#98ee2c]">{stat.highScore}</span>
                                                        </div>

                                                        {stat.recentScores.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Scores</h4>
                                                                <div className="grid grid-cols-5 gap-2">
                                                                    {stat.recentScores.map((scoreData, index) => (
                                                                        <div key={index} className="bg-[#202020] p-2 rounded text-center">
                                                                            <div className="text-sm font-bold">{scoreData.score}</div>
                                                                            <div className="text-xs text-gray-500">
                                                                                {new Date(scoreData.achievedAt).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Transactions Tab */}
                        <TabsContent value="transactions">
                            <Card className="bg-[#202020] border-gray-700 text-white">
                                <CardHeader>
                                    <CardTitle>Transaction History</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Your payment and reward history
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {transactions.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Wallet className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                            <h3 className="text-lg font-medium text-white mb-2">No Transactions Yet</h3>
                                            <p className="text-gray-400">Your transaction history will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {transactions.map((tx) => (
                                                <div key={tx.id} className="bg-[#151515] rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <div className="flex items-center">
                                                                <Badge
                                                                    className={`mr-2 ${tx.type === "GAME_PAYMENT"
                                                                        ? "bg-blue-900/50 text-blue-300 hover:bg-blue-900/50"
                                                                        : tx.type === "REWARD"
                                                                            ? "bg-green-900/50 text-green-300 hover:bg-green-900/50"
                                                                            : "bg-gray-700 text-gray-300"
                                                                        }`}
                                                                >
                                                                    {tx.type.replace("_", " ")}
                                                                </Badge>
                                                                <h3 className="font-medium">{tx.description}</h3>
                                                            </div>
                                                            <p className="text-sm text-gray-400 mt-1">
                                                                {new Date(tx.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-bold ${tx.type === "REWARD" ? "text-green-400" : "text-white"}`}>
                                                                {tx.type === "REWARD" ? "+" : "-"}{tx.amount} {tx.tokenSymbol}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Status: <span className="capitalize">{tx.status.toLowerCase()}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {tx.txHash && (
                                                        <div className="mt-2 pt-2 border-t border-gray-700">
                                                            <p className="text-xs text-gray-400">Transaction Hash:</p>
                                                            <a
                                                                href={`https://scan.test2.btcs.network/tx/${tx.txHash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs font-mono text-blue-400 hover:text-blue-300 break-all"
                                                            >
                                                                {tx.txHash}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Achievements Tab */}
                        <TabsContent value="achievements">
                            <Card className="bg-[#202020] border-gray-700 text-white">
                                <CardHeader>
                                    <CardTitle>Achievements</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Your gaming achievements and badges
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Trophy className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                        <h3 className="text-lg font-medium text-white mb-2">Coming Soon</h3>
                                        <p className="text-gray-400 mb-4">
                                            We&apos;re working on an achievement system for our games.
                                            <br />Check back soon!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GameScoreCard walletAddress={address || ""} />
            </div>
        </div>
    )
} 