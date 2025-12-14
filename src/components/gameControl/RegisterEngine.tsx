import React, { useId } from 'react';
import FormGroup from '../input/form/FormGroup';
import FormGroupDescription from '../input/form/FormGroupDescription';
import Input from '../input/Input';
import { toast } from 'react-toastify';
import useGame from '../../contexts/useGame';
import toastErrorHandler from '../../util/toastErrorHandler';

export default function RegisterEngine() {
    const newEngineURLID = useId();
    const newEngineNameID = useId();
    const game = useGame();

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
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

    return (
        <form onSubmit={onRegister} className='mt-8'>
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
    );
}
