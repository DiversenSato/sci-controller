import { ToastContainer } from 'react-toastify';
import Board from './components/Board';
import GameController from './components/GameController';
import EvalBar from './components/EvalBar';

export default function App() {
    return (
        <>
            <main className='max-w-screen-2xl mx-auto'>
                <div className='flex gap-4'>
                    <EvalBar />
                    <Board />
                    <GameController />
                </div>
            </main>
            <ToastContainer position='bottom-right' />
        </>
    );
}
