// types.ts

import { RefObject, ReactNode } from 'react';
import { Chess, Move, Square } from 'chess.js';

// Piece and Color Types
export type ChessPiece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type PromotionPiece = 'q' | 'r' | 'n' | 'b';

// Game Status Types
export interface GameStatus {
    winner: PieceColor | null;
    reason: 'checkmate' | 'stalemate' | 'insufficient' | 'threefold' | 'fifty-move' | 'time' | null;
}

// Settings Interface
export interface GameSettings {
    aiLevel: number;
    soundEnabled: boolean;
    showHints: boolean;
    autoQueen: boolean;
    timeControl: number | null;
}

// Move History Item
export interface MoveHistoryItem {
    move: Move;
    fen: string;
}

// For the promotion modal
export interface PromotionModalState {
    open: boolean;
    sourceSquare?: Square;
    targetSquare?: Square;
    pendingMove?: {
        from: Square;
        to: Square;
    };
}

// Component Props
export interface ChessboardProps {
    position: string;
    boardWidth: number;
    arePiecesDraggable: boolean;
    onDrop?: (sourceSquare: Square, targetSquare: Square) => boolean;
    orientation?: 'white' | 'black';
    showHints?: boolean;
    customSquareStyles?: Record<string, React.CSSProperties>;
}

export interface ThemeToggleProps {
    className?: string;
}

export interface ButtonProps {
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export interface SettingsDialogProps {
    settings: GameSettings;
    onChangeSettings: (settings: GameSettings) => void;
    aiLevel: number;
    onChangeAILevel: (level: number) => void;
}

// Chess Game Component State
export interface ChessGameState {
    game: Chess;
    fen: string;
    gameOver: boolean;
    gameStatus: GameStatus;
    playerColor: PieceColor;
    opponentColor: PieceColor;
    moveHistory: MoveHistoryItem[];
    thinking: boolean;
    showGameOverModal: boolean;
    showPromotionDialog: boolean;
    promotionMove: {
        from: Square;
        to: Square;
    } | null;
    hintMove: Move | null;
    settings: GameSettings;
    timeLeft: {
        white: number;
        black: number;
    };
    currentPlayer: PieceColor;
}

// Audio Refs
export interface AudioRefs {
    moveAudioRef: RefObject<HTMLAudioElement>;
    captureAudioRef: RefObject<HTMLAudioElement>;
    checkAudioRef: RefObject<HTMLAudioElement>;
}

// Functions
export type ResetGameFunction = () => void;
export type UndoMoveFunction = () => void;
export type SwitchSidesFunction = () => void;
export type HandlePromotionFunction = (piece: PromotionPiece) => void;
export type FormatMoveFunction = (move: Move) => string;
export type RenderPieceIconFunction = (piece: ChessPiece, color: PieceColor) => JSX.Element;
export type MakeAIMoveFunction = () => Promise<void>;
export type GetHintFunction = () => void;

// For AI Move Calculation
export interface AIEngineOptions {
    depth: number;
    timeout?: number;
}

// For the chess engine adapter
export interface ChessEngineAdapter {
    calculateBestMove: (fen: string, options: AIEngineOptions) => Promise<Move>;
}

// 1. GameControls Component
export interface GameControlsProps {
    onNewGame: () => void;
    onUndoMove: () => void;
    onSwitchSides: () => void;
    isThinking: boolean;
    gameOver: boolean;
    moveHistory: MoveHistoryItem[];
}

// 2. GameInfo Component 
export interface GameInfoProps {
    gameStatus: GameStatus;
    result: string;
    gameOver: boolean;
    playerColor: PieceColor;
    aiLevel: number;
    moveHistory: MoveHistoryItem[];
}

// 3. MoveHistory Component
export interface MoveHistoryProps {
    moves: Move[];
}

// 4. GameStatus Component (used in GameInfo)
export interface GameStatusProps {
    status: GameStatus;
    result: string;
    gameOver: boolean;
}

// 5. Enhanced Move type to support move history display
export interface MoveHistoryItem {
    move: Move;
    fen: string;
}

// 6. Grouped Move type for the move history table
export interface GroupedMove {
    number: number;
    white: Move | null;
    black: Move | null;
}
export interface CardProps {
    className?: string;
    children: ReactNode;
}

export interface CardHeaderProps {
    className?: string;
    children: ReactNode;
}

export interface CardTitleProps {
    children: ReactNode;
}

export interface CardDescriptionProps {
    children: ReactNode;
}

export interface CardContentProps {
    className?: string;
    children: ReactNode;
}

export interface CardFooterProps {
    className?: string;
    children: ReactNode;
}

export interface TabsProps {
    defaultValue: string;
    children: ReactNode;
}

export interface TabsListProps {
    className?: string;
    children: ReactNode;
}

export interface TabsTriggerProps {
    value: string;
    children: ReactNode;
}

export interface TabsContentProps {
    value: string;
    className?: string;
    children: ReactNode;
}