import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address")

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        // Find or create user by wallet address
        let user = await db.user.findUnique({
            where: { walletAddress: address },
        })

        if (!user) {
            // Create a new user if they don't exist
            user = await db.user.create({
                data: {
                    walletAddress: address,
                },
            })
        }

        return NextResponse.json({
            user: {
                id: user.id,
                walletAddress: user.walletAddress,
                name: user.name || null,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address")

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        const data = await req.json()

        // Only allow updating certain fields
        const { name } = data

        const updatedUser = await db.user.update({
            where: { walletAddress: address },
            data: { name },
            select: {
                id: true,
                name: true,
                walletAddress: true,
            },
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        )
    }
} 