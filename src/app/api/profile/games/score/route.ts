import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
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

        const data = await req.json()
        const { gameSlug, score, metadata } = data

        // Find the game
        const game = await db.game.findUnique({
            where: { slug: gameSlug },
        })

        if (!game) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            )
        }

        // Record the game score
        const gameScore = await db.gameScore.create({
            data: {
                userId: user.id,
                gameId: game.id,
                score,
                metadata,
            },
        })

        return NextResponse.json({ gameScore })
    } catch (error) {
        console.error("Error recording game score:", error)
        return NextResponse.json(
            { error: "Failed to record game score" },
            { status: 500 }
        )
    }
} 