import SnakesAndLaddersGame from '@/components/snake-game';
import { SnakeGameWrapper } from '@/components/snake-game/SnakeComponents';
import React from 'react';

const SnakeLadderGame = () => {
    return (
        <div className='flex justify-center items-center'>
            <SnakeGameWrapper>
                <SnakesAndLaddersGame />
            </SnakeGameWrapper>
        </div>
    );
};

export default SnakeLadderGame;
