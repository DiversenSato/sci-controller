import { useEffect, useState } from 'react';
import useGame from '../../contexts/useGame';

export default function FENEditor() {
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
        <div className='mt-8'>
            <h2 className='text-2xl'>Edit FEN</h2>
            <form onSubmit={onSetFEN}>
                <input
                    value={FEN}
                    onChange={(e) => setFEN(e.target.value)}
                    onBlur={onCancel}
                    className={'focus:border block w-full bg-gray-400 text-black p-1'}
                />
            </form>
        </div>
    );
}
