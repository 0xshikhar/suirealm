"use client"

import { toast } from "sonner"

interface GamePaymentParams {
    gameId: string
    txHash: string
    amount: number
    address: string
}

interface GamePlayParams {
    gameSlug: string
    duration?: number
    completed?: boolean
    address: string
}

interface GameScoreParams {
    gameSlug: string
    score: number
    metadata?: Record<string, any>
    address: string
}

export async function recordGamePayment(params: GamePaymentParams) {
    try {
        const response = await fetch(`/api/profile/transactions?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "GAME_PAYMENT",
                amount: params.amount,
                txHash: params.txHash,
                status: "COMPLETED",
                description: `Payment for playing game: ${params.gameId}`,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to record payment")
        }

        return await response.json()
    } catch (error) {
        console.error("Error recording game payment:", error)
        toast.error("Failed to record your payment. Please contact support.")
        throw error
    }
}

export async function recordGamePlay(params: GamePlayParams) {
    try {
        const response = await fetch(`/api/profile/games/play?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameSlug: params.gameSlug,
                duration: params.duration,
                completed: params.completed,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to record game play")
        }

        return await response.json()
    } catch (error) {
        console.error("Error recording game play:", error)
        // Silent failure - don't disrupt the user experience
        return null
    }
}

export async function recordGameScore(params: GameScoreParams) {
    try {
        const response = await fetch(`/api/profile/games/score?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameSlug: params.gameSlug,
                score: params.score,
                metadata: params.metadata,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to record game score")
        }

        return await response.json()
    } catch (error) {
        console.error("Error recording game score:", error)
        toast.error("Failed to save your score. Please try again.")
        throw error
    }
} 