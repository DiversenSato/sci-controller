import { useEffect, useState } from 'react';
import useGame from '../contexts/useGame';
import { evaluatePosition } from '../api/evaluatePosition';

export default function EvalBar() {
    const game = useGame();
    const [score, setScore] = useState(0);
    const [evalType, setEvalType] = useState<'cp' | 'mate'>('cp');

    useEffect(() => {
        void evaluatePosition(game.FEN).then((evaluation) => {
            setEvalType(evaluation.type);
            setScore(evaluation.score);
            if (evaluation.type === 'cp') setScore((prev) => prev / 100);
        });
    }, [game.FEN]);

    return (
        <div className='relative inline-block w-10 bg-gray-100 my-[72px] text-black'>
            <span
                className='absolute top-0 left-0 inline-block w-full bg-gray-700 transition-all duration-300'
                style={{
                    height:
                        evalType === 'cp'
                            ? `${((4 - 10 / (Math.abs(score) + 2.5)) / 4 * -Math.sign(score) + 1) * 50}%`
                            : (Math.sign(score) + 1) * 50 + '%',
                }}
            />
            <span className='absolute bottom-0 left-0 w-full text-center font-bold inline-block'>
                {evalType === 'cp' ? score.toFixed(1).replace(/\.0$/, '') : `M${Math.abs(score)}`}
            </span>
        </div>
    );
}
