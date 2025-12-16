import React from 'react';

export default function FormGroupDescription({ children }: { children?: React.ReactNode }) {
    return <p className='text-sm text-zinc-500'>{children}</p>;
}
