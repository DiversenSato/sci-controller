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
        <form onSubmit={onSetFEN} className='mt-4'>
            <input value={FEN} onChange={(e) => setFEN(e.target.value)} onBlur={onCancel} className={'focus:border block w-full'} />
        </form>
    );
}
