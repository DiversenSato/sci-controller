import { ToastContainer } from 'react-toastify';
import Board from './components/Board';
import GameController from './components/GameController';
import useGame from './contexts/useGame';
import React, { useEffect, useState } from 'react';

export default function App() {
    const game = useGame();
    const [FEN, setFEN] = useState(game.FEN);

    useEffect(() => {
        setFEN(game.FEN);
    }, [game.FEN]);

    function onCancel() {
        setFEN(game.FEN);
    }

    function onSetFEN(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        game.loadFEN(FEN);
    }

    return (
        <>
            <header className='bg-zinc-50 py-10 mb-8'>
                <h1 className='text-4xl max-w-screen-2xl mx-auto'>SCI Controller</h1>
            </header>
            <main className='max-w-screen-2xl mx-auto'>
                <div className='flex gap-4'>
                    <Board />
                    <GameController />
                </div>
                <form onSubmit={onSetFEN}>
                    <input value={FEN} onChange={(e) => setFEN(e.target.value)} onBlur={onCancel} className={'focus:border block w-full'} />
                </form>
            </main>
            <footer className='bg-zinc-100 p-20 mt-8'>Footer</footer>
            <ToastContainer position='bottom-right' />
        </>
    );
}
