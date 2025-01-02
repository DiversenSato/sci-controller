import { useMutation } from '@tanstack/react-query';
import { FormEvent, useId, useState } from 'react';
import useGame from '../contexts/useGame';
import FormGroup from './input/form/FormGroup';
import Input from './input/Input';
import FormGroupDescription from './input/form/FormGroupDescription';
import { toast } from 'react-toastify';
import EngineInterface from '../core/EngineInterface';
import Piece from '../core/Piece';
import BoardHelper from '../core/BoardHelper';
import toastErrorHandler from '../util/toastErrorHandler';

export default function GameController() {
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');
    const [activeEngine, setActiveEngine] = useState<EngineInterface>();

    const newEngineURLID = useId();
    const customCommandInputID = useId();
    const newEngineNameID = useId();

    const game = useGame();

    const sendMutation = useMutation({
        mutationFn: (command: string) => {
            if (!activeEngine) throw new Error('Engine not found');
            return activeEngine.sendCommand(command);
        },
        onSuccess: (data) => {
            setResponse(data);
            toast.success('Command successful');
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    async function onRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = data.get('newEngineName');
        const url = data.get('newEngineURL');
        if (!name) return toast.error('Engine name is missing');
        if (!url) return toast.error('Missing engine url');

        await toast.promise(game.registerEngine(name as string, url as string), {
            pending: 'Registering...',
            success: 'Registered engine',
            error: toastErrorHandler('Registration failed'),
        });
    }

    function onCustomCommand(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        sendMutation.mutate(command);
    }

    function onEngineRemove(e: React.MouseEvent, engine: EngineInterface) {
        e.stopPropagation();

        if (activeEngine === engine) setActiveEngine(undefined);
        game.removeEngine(engine);
    }

    async function onSyncToEngine() {
        if (!activeEngine) return toast.error('No engine selected');

        const result = await activeEngine.sendCommand('getBoard');
        game.loadFEN(result);
    }

    function onEnginePlayerAdd() {
        if (activeEngine) {
            try {
                game.addPlayer(activeEngine, Piece.White);
            } catch (err) {
                if (err instanceof Error) toast.error(err.message);
            }
        } else toast.error('Please select an engine first');
    }

    async function onBestMove() {
        const player = game.getPlayerToMove();
        const move = await toast.promise(player.engineInterface.sendCommand('bestMove'), {
            pending: 'Processing command...',
            success: 'Command successful',
            error: toastErrorHandler(),
        });

        const parsedMove = BoardHelper.algebraicToSquareIndex(move);
        await game.playMove(parsedMove[0], parsedMove[1]);
    }

    return (
        <div className='grow'>
            <form onSubmit={onRegister}>
                <h2 className='text-2xl'>Register a new engine</h2>
                <FormGroup>
                    <label htmlFor={newEngineURLID}>Engine URL*</label>
                    <Input type='url' id={newEngineURLID} name='newEngineURL' required />
                    <FormGroupDescription>Must be a valid url</FormGroupDescription>
                </FormGroup>
                <FormGroup>
                    <label htmlFor={newEngineNameID}>Engine name*</label>
                    <Input type='text' id={newEngineNameID} name='newEngineName' placeholder='Example: stockfish' required />
                </FormGroup>
                <button className='border px-2' type='submit'>Register</button>
            </form>
            {game.engines.length > 0 &&
                <div className='mt-8'>
                    <h2 className='text-2xl'>Engines</h2>
                    <p>Click on an engine to select it</p>
                    <ul>
                        {game.engines.map((engine) =>
                            <li onClick={() => setActiveEngine(engine)} className={'flex border p-2 cursor-pointer' + (engine === activeEngine ? ' bg-green-100' : '')} key={engine.label}>
                                <p className='grow'>{engine.label}</p>
                                <button onClick={(e) => onEngineRemove(e, engine)} className='px-2'>X</button>
                            </li>,
                        )}
                    </ul>
                    {activeEngine &&
                        <>
                            <button onClick={onEnginePlayerAdd} className='border px-2 mt-2'>Add as player</button>
                        </>
                    }
                </div>
            }
            {activeEngine &&
                <>
                    <div className='mt-8'>
                        <h2 className='text-2xl'>One-click commands</h2>
                        <div className='flex gap-4'>
                            <button className='border px-2' onClick={() => sendMutation.mutate('init')}>New game</button>
                            <button className='border px-2' onClick={onSyncToEngine}>Get engines board</button>
                            <button className='border px-2' onClick={onBestMove}>Make move</button>
                            <button className='border px-2' onClick={() => sendMutation.mutate('score')}>Get score</button>
                        </div>
                    </div>
                    <form onSubmit={onCustomCommand} className='mt-8'>
                        <h2 className='text-2xl'>Send a custom command</h2>
                        <FormGroup>
                            <label htmlFor={customCommandInputID}>Command</label>
                            <Input id={customCommandInputID} type='text' value={command} onChange={(e) => setCommand(e.target.value)} placeholder='Example: search 28' />
                        </FormGroup>
                        <button type='submit' className='border px-2'>send</button>
                    </form>
                    {response && <p>Response: {response}</p>}
                </>
            }
        </div>
    );
}
