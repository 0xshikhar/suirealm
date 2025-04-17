import { Word } from './types';

// Sample blockchain-themed crossword puzzle data
export const crosswordData: Word[] = [
    {
        id: 1,
        word: 'BITCOIN',
        clue: 'The first and most well-known cryptocurrency',
        startRow: 0,
        startCol: 0,
        direction: 'across',
        category: 'Cryptocurrencies',
        difficulty: 'easy'
    },
    {
        id: 2,
        word: 'BLOCKCHAIN',
        clue: 'A digital ledger where transactions are recorded chronologically and publicly',
        startRow: 2,
        startCol: 0,
        direction: 'across',
        category: 'Technology',
        difficulty: 'easy'
    },
    {
        id: 3,
        word: 'MINING',
        clue: 'Process of validating transactions and adding them to the blockchain',
        startRow: 4,
        startCol: 3,
        direction: 'across',
        category: 'Technology',
        difficulty: 'medium'
    },
    {
        id: 4,
        word: 'WALLET',
        clue: 'Digital tool that stores keys and can be used to send and receive cryptocurrencies',
        startRow: 6,
        startCol: 1,
        direction: 'across',
        category: 'Tools',
        difficulty: 'easy'
    },
    {
        id: 5,
        word: 'BLOCK',
        clue: 'A collection of transactions grouped together',
        startRow: 0,
        startCol: 0,
        direction: 'down',
        category: 'Technology',
        difficulty: 'easy'
    },
    {
        id: 6,
        word: 'TOKEN',
        clue: 'Digital asset issued on a blockchain that represents a utility or asset',
        startRow: 0,
        startCol: 4,
        direction: 'down',
        category: 'Cryptocurrencies',
        difficulty: 'medium'
    },
    {
        id: 7,
        word: 'NFT',
        clue: 'Non-fungible digital asset representing ownership of a unique item',
        startRow: 2,
        startCol: 9,
        direction: 'down',
        category: 'Digital Assets',
        difficulty: 'medium'
    },
    {
        id: 8,
        word: 'DEFI',
        clue: 'Decentralized financial instruments without traditional intermediaries',
        startRow: 4,
        startCol: 5,
        direction: 'down',
        category: 'Finance',
        difficulty: 'hard'
    },
];

// Additional puzzle sets can be added here for different difficulty levels
export const advancedCrosswordData: Word[] = [
    // More complex puzzles can be added here
]; 