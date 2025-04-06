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
        const { gameSlug, duration, completed } = data

        // Find the game
        let game = await db.game.findUnique({
            where: { slug: gameSlug },
        })

        if (!game) {
            return NextResponse.json(
                { error: "Game not found" },
                { status: 404 }
            )
        }

        // Record the game play
        const gamePlay = await db.gamePlay.create({
            data: {
                userId: user.id,
                gameId: game.id,
                duration,
                completed,
            },
        })

        return NextResponse.json({ gamePlay })
    } catch (error) {
        console.error("Error recording game play:", error)
        return NextResponse.json(
            { error: "Failed to record game play" },
            { status: 500 }
        )
    }
} 