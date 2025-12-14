import { useMutation } from '@tanstack/react-query';
import { FormEvent, useId, useState } from 'react';
import useGame from '../contexts/useGame';
import FormGroup from './input/form/FormGroup';
import Input from './input/Input';
import { toast } from 'react-toastify';
import EngineInterface from '../core/EngineInterface';
import BoardHelper from '../core/BoardHelper';
import toastErrorHandler from '../util/toastErrorHandler';
import Select from './input/Select';
import Player from '../core/Player';
import GameState from '../core/GameState';
import FENEditor from './gameControl/FENEditor';
import RegisterEngine from './gameControl/RegisterEngine';

export default function GameController() {
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');
    const [activeEngine, setActiveEngine] = useState<EngineInterface>();
    const [tempWPlayer, setTempWPlayer] = useState<Player>(new Player());
    const [tempBPlayer, setTempBPlayer] = useState<Player>(new Player());

    const customCommandInputID = useId();

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

    async function onNewGame() {
        if (game.wPlayer instanceof EngineInterface) await game.wPlayer.sendCommand('newGame');
        if (game.bPlayer instanceof EngineInterface) await game.bPlayer.sendCommand('newGame');
        game.clearLog();
        game.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        game.gameState = GameState.PRE_GAME;
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

    async function onBestMove() {
        const player = game.getPlayerToMove();
        if (!player) {
            toast.error('There is no player for the color to move');
            return;
        }

        if (!(player instanceof EngineInterface)) {
            toast.error('Player to move is not an engine');
            return;
        }

        const move = await toast.promise(player.sendCommand('bestMove'), {
            pending: 'Processing command...',
            success: 'Command successful',
            error: toastErrorHandler(),
        });

        const parsedMove = BoardHelper.algebraicToSquareIndex(move);
        await game.playMove(parsedMove[0], parsedMove[1]);
    }

    function onStartGame() {
        game.startGame(tempWPlayer, tempBPlayer);
    }

    return (
        <div className='grow py-4'>
            <RegisterEngine />
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
                        <div className='flex gap-2'>
                            {game.bPlayer !== activeEngine &&
                                <button className='border px-2' onClick={() => game.setWPlayer(activeEngine)}>Set as white</button>
                            }
                            {game.wPlayer !== activeEngine &&
                                <button className='border px-2' onClick={() => game.setBPlayer(activeEngine)}>Set as black</button>
                            }
                        </div>
                    }
                </div>
            }
            {activeEngine &&
                <>
                    <div className='mt-8'>
                        <h2 className='text-2xl'>One-click commands</h2>
                        <div className='flex gap-4'>
                            <button className='border px-2' onClick={onSyncToEngine}>Get engines board</button>
                            <button className='border px-2' onClick={onBestMove}>Make move</button>
                            <button className='border px-2' onClick={() => sendMutation.mutate('evaluate')}>Evaluate</button>
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
            {game.gameState === GameState.PRE_GAME &&
                <div className='mt-8'>
                    <h2 className='text-2xl'>Start a new game</h2>
                    <div className='flex'>
                        <Select values={[
                            ['Human', new Player()],
                            ...game.engines.map((e) => [e.label, e] as [string, Player]),
                        ]} onSelect={setTempWPlayer} />
                        <p className='mx-auto'>vs</p>
                        <Select values={[
                            ['Human', new Player()],
                            ...game.engines.map((e) => [e.label, e] as [string, Player]),
                        ]} onSelect={setTempBPlayer} />
                    </div>
                    <button onClick={onStartGame} className='border px-2'>Start</button>
                </div>
            }
            {game.gameState === GameState.GAME &&
                <div className='mt-8'>
                    <h2 className='text-2xl'>Game</h2>
                    <button className='border px-2' onClick={onBestMove}>Make move</button>
                    <button className='border px-2' onClick={onNewGame}>New game</button>
                </div>
            }
            <div className=''>
                <h2 className='text-2xl'>Game log</h2>
                <p>
                    {game.gameLog.map((l, i) =>
                        <span key={i}>{`${Math.floor(i / 2) + 1}. ${l}`}<br /></span>,
                    )}
                </p>
            </div>
            <FENEditor />
        </div>
    );
}
