import React from 'react';
import useGame from '../contexts/useGame';
import SPiece from '../core/Piece';
import BoardHelper from '../core/BoardHelper';

export default function Board() {
    const game = useGame();

    return (
        <div className='board' style={{ width: '900px', height: '900px' }}>
            {game.pieces.map((piece, i) => piece ? <Piece piece={piece} squareIndex={i} key={i} /> : undefined)}
        </div>
    );
}

function Piece({ piece, squareIndex }: { piece: number, squareIndex: number }) {
    const game = useGame();

    async function onDragEnd(e: React.DragEvent<HTMLDivElement>) {
        const board = (e.target as Element).parentElement?.getBoundingClientRect();
        if (!board) return;

        const file = Math.floor((e.clientX - board.left) / (board.width / 8));
        const rank = 7 - Math.floor((e.clientY - board.top) / (board.height / 8));

        await game.playMove(
            squareIndex,
            BoardHelper.positionToSquareIndex(file, rank),
        );
    }

    return (
        <div
            onDragEnd={onDragEnd}
            draggable
            className={`piece ${squareIndex} ${SPiece.toCSSClass(piece)} square-${8 - (squareIndex % 8)}${Math.floor(squareIndex / 8) + 1}`}
        />
    );
}
