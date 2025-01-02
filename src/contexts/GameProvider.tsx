import React, { useCallback, useState } from 'react';
import { GameContext } from './GameContext';
import EngineInterface from '../core/EngineInterface';
import Piece from '../core/Piece';
import BoardHelper from '../core/BoardHelper';
import Player from '../core/Player';

const moveAudio = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_WEBM_/default/move-self.webm');

export default function GameProvider({ children }: { children: React.ReactNode }) {
    const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [engines, setEngines] = useState<EngineInterface[]>([]);
    const [pieces, setPieces] = useState(Array.from({ length: 64 }, () => Piece.None));
    const [players, setPlayers] = useState<Player[]>([]);
    const [colorToMove, setColorToMove] = useState(Piece.White);

    const loadFEN = useCallback((FEN: string) => {
        setFEN(FEN);
        const fields = FEN.split(' ');
        const newPieces = Array.from({ length: 64 }, () => Piece.None);

        const pieceDict = new Map<string, number>([
            ['k', Piece.King], ['p', Piece.Pawn], ['n', Piece.Knight],
            ['b', Piece.Bishop], ['r', Piece.Rook], ['q', Piece.Queen],
        ]);

        let rank = 7;
        let file = 0;
        for (const char of fields[0]) {
            if (char === '/') {
                rank--;
                file = 0;
                continue;
            }

            if (/\d/.test(char)) {
                file += parseInt(char);
                continue;
            }

            const color = char === char.toUpperCase() ? Piece.White : Piece.Black;
            const piece = pieceDict.get(char.toLowerCase());
            if (piece === undefined) throw new Error('Invalid piece in FEN string!');

            const squareIndex = rank * 8 + (7 - file);
            const newPiece = piece | color;
            newPieces[squareIndex] = newPiece;

            file++;
        }
        setPieces(newPieces);

        setColorToMove(fields[1] === 'w' ? Piece.White : Piece.Black);
    }, []);

    async function registerEngine(name: string, url: string) {
        let duplicateCounter = 1;
        const originalName = name;
        while (engines.find((e) => e.label === name)) {
            name = `${originalName} (${duplicateCounter})`;
            duplicateCounter++;
        }

        const engineInterface = new EngineInterface(name, new URL(url));
        if (await engineInterface.sendCommand('sciokay') !== 'sciokay') throw new Error('Engine is not SCI compatible');
        setEngines((prev) => [...prev, engineInterface]);
    }

    const getEngine = useCallback((name: string) => {
        return engines.find((e) => e.label === name);
    }, [engines]);

    const removeEngine = useCallback((engine: EngineInterface) => {
        setEngines((prev) => prev.filter((e) => e !== engine));
        setPlayers((prev) => prev.filter((player) => player.engineInterface !== engine));
    }, []);

    async function playMove(sourceSquare: number, targetSquare: number) {
        const move = BoardHelper.squareIndexToAlgebraic(sourceSquare) + BoardHelper.squareIndexToAlgebraic(targetSquare);
        for (const player of players) {
            await player.engineInterface.sendCommand(`move ${move}`);
        }

        void moveAudio.play();

        const piecesCopy = [...pieces];
        const sourcePiece = piecesCopy[sourceSquare];
        const targetPiece = piecesCopy[targetSquare];

        // if targetPiece is empty then swap pieces
        if (!targetPiece) {
            piecesCopy[sourceSquare] = targetPiece;
            piecesCopy[targetSquare] = sourcePiece;
        } else {
            // else replace target and set source to empty
            piecesCopy[targetSquare] = sourcePiece;
            piecesCopy[sourceSquare] = 0;
        }

        setPieces(piecesCopy);
    }

    function addPlayer(engineInterface: EngineInterface, asColor: number) {
        if (players.find((p) => p.side === asColor)) throw new Error('This color already has a player');
        if (players.find((p) => p.engineInterface === engineInterface)) throw new Error('Engine already added as a player');

        setPlayers((prev) => [...prev, new Player(asColor, engineInterface)]);
    }

    function getPlayerToMove() {
        const player = players.find((player) => player.side === colorToMove);
        if (!player) throw new Error('Player not found');
        return player;
    }

    return (
        <GameContext.Provider value={{
            FEN,
            loadFEN,
            pieces,
            engines,
            registerEngine,
            getEngine,
            removeEngine,
            players,
            addPlayer,
            getPlayerToMove,
            playMove,
            gameLog: [],
        }}>
            {children}
        </GameContext.Provider>
    );
}
