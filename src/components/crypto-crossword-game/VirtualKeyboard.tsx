import React from "react";
import { useGame } from "./GameContext";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight, Delete, CornerDownLeft } from "lucide-react";

function VirtualKeyboard() {
    const { state, dispatch } = useGame();

    const handleKeyPress = (key: string) => {
        if (!state.currentCell) return;

        const { row, col } = state.currentCell;

        if (key === 'Backspace') {
            dispatch({ type: 'SET_CELL_VALUE', row, col, value: '' });
            dispatch({ type: 'MOVE_PREV_CELL' });
            dispatch({ type: 'INCREMENT_MOVES' });
        } else if (key === 'Direction') {
            dispatch({ type: 'TOGGLE_DIRECTION' });
        } else if (key === 'Next') {
            dispatch({ type: 'MOVE_NEXT_CELL' });
        } else if (key === 'Prev') {
            dispatch({ type: 'MOVE_PREV_CELL' });
        } else if (/^[A-Z]$/.test(key)) {
            dispatch({ type: 'SET_CELL_VALUE', row, col, value: key });
            dispatch({ type: 'MOVE_NEXT_CELL' });
            dispatch({ type: 'INCREMENT_MOVES' });
        }
    };

    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div className="mt-6 p-2 bg-muted rounded-lg">
            <div className="grid grid-cols-10 gap-1 mb-1">
                {keyboardRows[0].map(key => (
                    <Button
                        key={key}
                        variant="secondary"
                        size="sm"
                        className="h-10 text-center"
                        onClick={() => handleKeyPress(key)}
                    >
                        {key}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-9 gap-1 mb-1 ml-2.5">
                {keyboardRows[1].map(key => (
                    <Button
                        key={key}
                        variant="secondary"
                        size="sm"
                        className="h-10 text-center"
                        onClick={() => handleKeyPress(key)}
                    >
                        {key}
                    </Button>
                ))}
            </div>
            <div className="flex gap-1">
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 flex-1"
                    onClick={() => handleKeyPress('Direction')}
                >
                    {state.currentDirection === 'across' ? 'Across' : 'Down'}
                </Button>
                <div className="grid grid-cols-7 gap-1 flex-[3]">
                    {keyboardRows[2].map(key => (
                        <Button
                            key={key}
                            variant="secondary"
                            size="sm"
                            className="h-10 text-center"
                            onClick={() => handleKeyPress(key)}
                        >
                            {key}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-10 flex-1"
                    onClick={() => handleKeyPress('Backspace')}
                >
                    <Delete className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-10"
                    onClick={() => handleKeyPress('Prev')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Prev
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-10"
                    onClick={() => handleKeyPress('Next')}
                >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

export { VirtualKeyboard }; 