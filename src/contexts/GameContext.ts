import { createContext } from 'react';
import EngineInterface from '../core/EngineInterface';
import Player from '../core/Player';

export interface Game {
    FEN: string;
    loadFEN: (fen: string) => void,
    pieces: number[],
    engines: EngineInterface[];
    registerEngine: (name: string, url: string) => Promise<void>,
    getEngine: (name: string) => EngineInterface | undefined,
    removeEngine: (engine: EngineInterface) => void,
    players: Player[],
    addPlayer: (engineInterface: EngineInterface, asColor: number) => void,
    getPlayerToMove: () => Player,
    playMove: (sourceSquare: number, targetSquare: number) => Promise<void>,
    gameLog: string[],
}

export const GameContext = createContext<Game | undefined>(undefined);
