import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GameProvider from './contexts/GameProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <GameProvider>
                <App />
            </GameProvider>
        </QueryClientProvider>
    </StrictMode>
);
