import React, { useContext } from 'react';
import { Game, GameContext } from './GameContext';

export default function useGame() {
    return useContext(GameContext as React.Context<Game>);
}
