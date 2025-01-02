import { ToastContentProps } from 'react-toastify';

export default function toastErrorHandler(fallbackMessage = 'Something went wrong') {
    return {
        render: (content: ToastContentProps<unknown>) => (content.data as Error).message ?? fallbackMessage,
    };
}
