export async function evaluatePosition(fen: string): Promise<{ type: 'cp' | 'mate'; score: number }> {
    const timeout = new AbortController();
    setTimeout(() => timeout.abort(), 5000);

    try {
        const res = await fetch('http://localhost:3000/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ position: fen }),
            signal: timeout.signal,
        });

        const data = (await res.json()) as { type: 'cp' | 'mate'; score: number };
        return data;
    } catch {
        return { type: 'cp', score: 0 };
    }
}
