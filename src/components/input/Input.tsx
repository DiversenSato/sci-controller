import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export default function Input(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return <input {...props} className={'block w-full border ' + props.className} />;
}
