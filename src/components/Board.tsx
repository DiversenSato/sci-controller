import React from 'react';
import useGame from '../contexts/useGame';
import SPiece from '../core/Piece';
import BoardHelper from '../core/BoardHelper';
import Player from '../core/Player';
import Coordinate from '../core/Coordinate';

export default function Board() {
    const game = useGame();

    const from = new Coordinate(game.recentMove >> 6);
    const to = new Coordinate(game.recentMove & 0b111111);

    return (
        <div className='py-4'>
            <div className='mb-2'>
                <PlayerIcons color='Black' player={game.bPlayer} />
            </div>
            <div className='board'>
                {game.recentMove && (
                    <>
                        <svg className={`piece square-${from.x + 1}${from.y + 1}`}>
                            <rect width='100%' height='100%' fill='yellow' opacity='50%' />
                        </svg>
                        <svg className={`piece square-${to.x + 1}${to.y + 1}`}>
                            <rect width='100%' height='100%' fill='yellow' opacity='50%' />
                        </svg>
                    </>
                )}
                {game.pieces.map((piece, i) => (piece ? <Piece piece={piece} squareIndex={i} key={i} /> : undefined))}
            </div>
            <div className='mt-2'>
                <PlayerIcons color='White' player={game.wPlayer} />
            </div>
        </div>
    );
}

function Piece({ piece, squareIndex }: { piece: number; squareIndex: number }) {
    const game = useGame();
    const canMove = game.getPlayerToMove()?.label === 'human';

    async function onDragEnd(e: React.DragEvent<HTMLDivElement>) {
        const board = (e.target as Element).parentElement?.getBoundingClientRect();
        if (!board) return;
        if (!canMove) return;

        const file = Math.floor((e.clientX - board.left) / (board.width / 8));
        const rank = 7 - Math.floor((e.clientY - board.top) / (board.height / 8));

        if (squareIndex === BoardHelper.positionToSquareIndex(file, rank)) return;

        await game.playMove(squareIndex, BoardHelper.positionToSquareIndex(file, rank));
    }

    return (
        <div
            onDragEnd={onDragEnd}
            draggable={canMove}
            className={`piece ${squareIndex} ${SPiece.toCSSClass(piece)} square-${8 - (squareIndex % 8)}${Math.floor(squareIndex / 8) + 1}`}
        />
    );
}

function PlayerIcons({ color, player }: { color: 'White' | 'Black'; player?: Player }) {
    return (
        <div className='flex gap-2'>
            <img src={player?.pfp} width={48} height={48} />
            <div className='flex flex-col'>
                <p>{player?.label ?? color}</p>
            </div>
        </div>
    );
}
