"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { Trophy, GamepadIcon, Clock, BarChart } from "lucide-react"

interface GameStat {
    game: {
        id: string
        name: string
        description: string
        imageUrl: string
    }
    playCount: number
    lastPlayed: string | null
    highScore: number
    recentScores: Array<{
        score: number
        achievedAt: string
    }>
}

interface GameScoreCardProps {
    walletAddress: string
}

export function GameScoreCard({ walletAddress }: GameScoreCardProps) {
    const [gameStats, setGameStats] = useState<GameStat[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchGameStats() {
            if (!walletAddress) return

            try {
                setIsLoading(true)
                const response = await fetch(`/api/profile/games?address=${walletAddress}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch game stats")
                }

                const data = await response.json()
                setGameStats(data.gameStats || [])
            } catch (err) {
                console.error("Error fetching game stats:", err)
                setError("Failed to load game statistics")
            } finally {
                setIsLoading(false)
            }
        }

        fetchGameStats()
    }, [walletAddress])

    if (isLoading) {
        return <GameScoreCardSkeleton />
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Game Statistics</CardTitle>
                    <CardDescription>Your gaming achievements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (gameStats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Game Statistics</CardTitle>
                    <CardDescription>Your gaming achievements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                        <GamepadIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No game activity yet</p>
                        <p className="text-sm text-muted-foreground">Play some games to see your stats here!</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
                <CardDescription>Your gaming achievements</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                        <TabsTrigger value="all">All Games</TabsTrigger>
                        <TabsTrigger value="recent">Recently Played</TabsTrigger>
                        <TabsTrigger value="highscores">High Scores</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {gameStats.map((stat) => (
                            <GameStatItem key={stat.game.id} stat={stat} />
                        ))}
                    </TabsContent>

                    <TabsContent value="recent" className="space-y-4">
                        {gameStats
                            .filter(stat => stat.lastPlayed)
                            .sort((a, b) =>
                                new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()
                            )
                            .slice(0, 5)
                            .map((stat) => (
                                <GameStatItem key={stat.game.id} stat={stat} />
                            ))}
                    </TabsContent>

                    <TabsContent value="highscores" className="space-y-4">
                        {gameStats
                            .filter(stat => stat.highScore > 0)
                            .sort((a, b) => b.highScore - a.highScore)
                            .map((stat) => (
                                <GameStatItem key={stat.game.id} stat={stat} />
                            ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                Stats are updated after each game play
            </CardFooter>
        </Card>
    )
}

function GameStatItem({ stat }: { stat: GameStat }) {
    return (
        <div className="flex items-start space-x-4 p-3 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                {stat.game.imageUrl ? (
                    <img
                        src={stat.game.imageUrl}
                        alt={stat.game.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                        <GamepadIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{stat.game.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{stat.game.description}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Trophy className="h-3 w-3" />
                        {stat.highScore.toLocaleString()}
                    </Badge>

                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <GamepadIcon className="h-3 w-3" />
                        {stat.playCount} {stat.playCount === 1 ? 'play' : 'plays'}
                    </Badge>

                    {stat.lastPlayed && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(stat.lastPlayed), { addSuffix: true })}
                        </Badge>
                    )}
                </div>
            </div>

            {stat.recentScores.length > 0 && (
                <div className="flex-shrink-0 flex items-center">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">Recent</span>
                        <span className="font-medium">{stat.recentScores[0].score.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function GameScoreCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />

                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-start space-x-4 p-3 rounded-lg border">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
} 