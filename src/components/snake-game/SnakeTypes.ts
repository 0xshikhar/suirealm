interface GameBoardProps {
    playerPosition: number;
    snakesAndLadders: Record<string, string>;
    boardSize?: number;
    showOverlay?: boolean;
    pathPositions?: number[];
    showPath?: boolean;
}

interface DiceComponentProps {
    diceValue: number;
    isRolling: boolean;
    onRoll: () => void;
}


interface GameStatusProps {
    moves: number;
    playerPosition: number;
    gameTime: number;
}

interface GameControlsProps {
    onReset: () => void;
    onShowPath: () => void;
    showPath: boolean;
}

interface WinModalProps {
    isOpen: boolean;
    onClose: () => void;
    moves: number;
    gameTime: number;
}

export type { GameBoardProps, DiceComponentProps, GameStatusProps, GameControlsProps, WinModalProps };
