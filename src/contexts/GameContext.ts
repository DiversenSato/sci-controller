import { createContext } from 'react';
import EngineInterface from '../core/EngineInterface';
import Player from '../core/Player';
import GameState from '../core/GameState';

export interface Game {
    FEN: string;
    loadFEN: (fen: string) => void,
    pieces: number[],

    engines: EngineInterface[];
    registerEngine: (name: string, url: string) => Promise<void>,
    getEngine: (name: string) => EngineInterface | undefined,
    removeEngine: (engine: EngineInterface) => void,

    wPlayer?: Player;
    bPlayer?: Player;
    setWPlayer: (player: Player) => void,
    setBPlayer: (player: Player) => void,
    getPlayerToMove: () => Player | undefined,

    playMove: (sourceSquare: number, targetSquare: number) => Promise<void>,

    gameState: GameState,
    gameLog: string[],
    clearLog: () => void,
    recentMove: number,  // 12 bit number, first 6 bits represent the source square index and the last 6 bits represent the target square index
    startGame: (wPlayer: Player, bPlayer: Player) => void,
}

export const GameContext = createContext<Game | undefined>(undefined);
