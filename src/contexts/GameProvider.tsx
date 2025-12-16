import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameContext } from './GameContext';
import EngineInterface from '../core/EngineInterface';
import Piece from '../core/Piece';
import BoardHelper from '../core/BoardHelper';
import Player from '../core/Player';
import GameState from '../core/GameState';
import { toast } from 'react-toastify';

const moveAudio = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_WEBM_/default/move-self.webm');

export default function GameProvider({ children }: { children: React.ReactNode }) {
    const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [pieces, setPieces] = useState(Array.from({ length: 64 }, () => Piece.None));

    const [engines, setEngines] = useState<EngineInterface[]>([]);

    const [wPlayer, setWPlayer] = useState<Player>();
    const [bPlayer, setBPlayer] = useState<Player>();

    const [state, setState] = useState<GameState>(GameState.SETUP);
    const [gameLog, setGameLog] = useState<string[]>([]);
    const [recentMove, setRecentMove] = useState<number>(0);

    const colorToMoveRef = useRef(Piece.White);

    const loadFEN = useCallback((FEN: string) => {
        setFEN(FEN);
        const fields = FEN.split(' ');
        const newPieces = Array.from({ length: 64 }, () => Piece.None);

        const pieceDict = new Map<string, number>([
            ['k', Piece.King],
            ['p', Piece.Pawn],
            ['n', Piece.Knight],
            ['b', Piece.Bishop],
            ['r', Piece.Rook],
            ['q', Piece.Queen],
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

        colorToMoveRef.current = fields[1] === 'w' ? Piece.White : Piece.Black;
    }, []);

    // Set board up only once when this component is first rendered
    useEffect(() => {
        loadFEN(FEN);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function registerEngine(name: string, url: string) {
        if (engines.find((e) => e.label === name)) {
            throw new Error('Engine already exists');
        }

        const engineInterface = new EngineInterface(name, new URL(url));
        if ((await engineInterface.sendCommand('sciokay')) !== 'sciokay')
            throw new Error('Engine is not SCI compatible');
        setEngines((prev) => [...prev, engineInterface]);
    }

    const getEngine = useCallback(
        (name: string) => {
            return engines.find((e) => e.label === name);
        },
        [engines]
    );

    const removeEngine = useCallback((engine: EngineInterface) => {
        setEngines((prev) => prev.filter((e) => e !== engine));
    }, []);

    async function playMove(sourceSquare: number, targetSquare: number) {
        if (state !== GameState.GAME) {
            toast.error('No active game');
            return;
        }

        const move =
            BoardHelper.squareIndexToAlgebraic(sourceSquare) + BoardHelper.squareIndexToAlgebraic(targetSquare);

        setPieces((prev) => {
            const copy = [...prev];
            copy[targetSquare] = copy[sourceSquare];
            copy[sourceSquare] = 0;
            return copy;
        });
        void moveAudio.play();
        setGameLog((prev) => [...prev, move]);
        colorToMoveRef.current = colorToMoveRef.current === Piece.Black ? Piece.White : Piece.Black;
        setRecentMove((sourceSquare << 6) + targetSquare);

        if (wPlayer instanceof EngineInterface) await wPlayer.sendCommand(`makeMove ${move}`);
        if (bPlayer instanceof EngineInterface) await bPlayer.sendCommand(`makeMove ${move}`);

        const nextPlayer = colorToMoveRef.current === Piece.White ? wPlayer : bPlayer;
        if (nextPlayer instanceof EngineInterface) {
            const engineMove = await nextPlayer.sendCommand('bestMove');
            const from = BoardHelper.algebraicToSquareIndex(engineMove)[0];
            const to = BoardHelper.algebraicToSquareIndex(engineMove)[1];
            await playMove(from, to);
        }
    }

    function getPlayerToMove() {
        if (colorToMoveRef.current === Piece.White) return wPlayer;
        return bPlayer;
    }

    async function startGame(wPlayer: Player, bPlayer: Player) {
        if (wPlayer instanceof EngineInterface) await wPlayer.sendCommand(`newGame`);
        if (bPlayer instanceof EngineInterface) await bPlayer.sendCommand(`newGame`);
        setState(GameState.GAME);
        setWPlayer(wPlayer);
        setBPlayer(bPlayer);
    }

    function newGame() {
        setState(GameState.SETUP);
        setGameLog([]);
        loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        setWPlayer(undefined);
        setBPlayer(undefined);
        setRecentMove(0);
    }

    return (
        <GameContext.Provider
            value={{
                FEN,
                loadFEN,
                pieces,

                engines,
                registerEngine,
                getEngine,
                removeEngine,

                wPlayer,
                bPlayer,
                setWPlayer,
                setBPlayer,
                getPlayerToMove,
                playMove,

                gameState: state,
                gameLog,
                clearLog: () => setGameLog([]),
                recentMove,
                startGame,
                newGame,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
