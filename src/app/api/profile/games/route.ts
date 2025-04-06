import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Define interfaces for our data structures
interface GamePlaysByGame {
    [gameId: string]: {
        game: any;
        playCount: number;
        lastPlayed: Date | null;
    }
}

interface ScoresByGame {
    [gameId: string]: {
        game: any;
        highScore: number;
        recentScores: Array<{
            score: number;
            achievedAt: Date;
        }>;
    }
}

interface GameStat {
    game: any;
    playCount: number;
    lastPlayed: Date | null;
    highScore: number;
    recentScores: Array<{
        score: number;
        achievedAt: Date;
    }>;
}

export async function GET(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address")

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { walletAddress: address },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Get game plays with game details
        const gamePlays = await db.gamePlay.findMany({
            where: { userId: user.id },
            include: { game: true },
            orderBy: { playedAt: "desc" },
        })

        // Get high scores for each game
        const gameScores = await db.gameScore.findMany({
            where: { userId: user.id },
            include: { game: true },
            orderBy: { achievedAt: "desc" },
        })

        // Group game plays by game
        const gamePlaysByGame = gamePlays.reduce<GamePlaysByGame>((acc, play) => {
            const gameId = play.gameId

            if (!acc[gameId]) {
                acc[gameId] = {
                    game: play.game,
                    playCount: 0,
                    lastPlayed: null,
                }
            }

            acc[gameId].playCount++

            // Update last played if this play is more recent
            if (!acc[gameId].lastPlayed || new Date(play.playedAt) > new Date(acc[gameId].lastPlayed)) {
                acc[gameId].lastPlayed = play.playedAt
            }

            return acc
        }, {})

        // Group scores by game
        const scoresByGame = gameScores.reduce<ScoresByGame>((acc, score) => {
            const gameId = score.gameId

            if (!acc[gameId]) {
                acc[gameId] = {
                    game: score.game,
                    highScore: 0,
                    recentScores: [],
                }
            }

            // Update high score if this score is higher
            if (score.score > acc[gameId].highScore) {
                acc[gameId].highScore = score.score
            }

            // Add to recent scores
            acc[gameId].recentScores.push({
                score: score.score,
                achievedAt: score.achievedAt,
            })

            // Keep only the 5 most recent scores
            acc[gameId].recentScores.sort((a, b) =>
                new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
            )

            if (acc[gameId].recentScores.length > 5) {
                acc[gameId].recentScores = acc[gameId].recentScores.slice(0, 5)
            }

            return acc
        }, {})

        // Combine the data
        const gameStats = Object.keys({ ...gamePlaysByGame, ...scoresByGame }).map(gameId => {
            return {
                game: (gamePlaysByGame[gameId]?.game || scoresByGame[gameId]?.game),
                playCount: gamePlaysByGame[gameId]?.playCount || 0,
                lastPlayed: gamePlaysByGame[gameId]?.lastPlayed || null,
                highScore: scoresByGame[gameId]?.highScore || 0,
                recentScores: scoresByGame[gameId]?.recentScores || [],
            }
        })

        return NextResponse.json({ gameStats })
    } catch (error) {
        console.error("Error fetching game stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch game stats" },
            { status: 500 }
        )
    }
} 