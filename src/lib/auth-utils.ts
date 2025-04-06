import { verifyMessage } from 'viem'
import publicClient from './customChain'

export function generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString()
}

/**
 * Verifies a message signature
 * @param message The original message that was signed
 * @param signature The signature to verify
 * @param address The address that supposedly signed the message
 * @returns True if the signature is valid, false otherwise
 */
export async function verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    try {
        // Convert the address to the required `0x${string}` format
        const formattedAddress = address as `0x${string}`

        // Convert the signature to the required format
        const formattedSignature = signature as `0x${string}`

        // Use await since verifyMessage returns a Promise<boolean>
        const isValid = await verifyMessage({
            address: formattedAddress,
            message,
            signature: formattedSignature,
        })

        return isValid
    } catch (error) {
        console.error('Error verifying signature:', error)
        return false
    }
}

// Simple in-memory session store (in a real app, use a more persistent solution)
const sessions: Record<string, { address: string; expiry: number }> = {}

export function createSession(address: string): string {
    const sessionId = crypto.randomUUID()
    sessions[sessionId] = {
        address,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    return sessionId
}

export function getSession(sessionId: string): string | null {
    const session = sessions[sessionId]
    if (!session) return null

    if (session.expiry < Date.now()) {
        delete sessions[sessionId]
        return null
    }

    return session.address
}

/**
 * Creates a message for signing
 * @param address The user's address
 * @param nonce A random nonce for security
 * @returns A formatted message string
 */
export function createSignMessage(address: string, nonce: string): string {
    return `Sign this message to authenticate with Suirealm.\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
} 