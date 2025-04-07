// Sui blockchain testnet package addresses
export const contractAddresses = {
    // These are example Sui object IDs for packages - replace with actual package IDs
    nft: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    tokenMint: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
};

export const gameNFT = "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba";

// Sui Explorer URLs
export const blockExplorer = {
    nft: "https://suiexplorer.com/object/" + contractAddresses.nft + "?network=testnet",
    tokenMint: "https://suiexplorer.com/object/" + contractAddresses.tokenMint + "?network=testnet",
};

// No ABIs in Sui as it uses Move modules rather than Solidity ABIs
// This is kept for backward compatibility with existing code
export const contractABIs = {
    nft: {},
    tokenMint: {},
};

export const streamKey = process.env.LIVEPEER_STREAM_KEY;