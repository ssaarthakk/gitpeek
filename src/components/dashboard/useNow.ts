'use client';
import { useEffect, useState } from 'react';

/** Current time, refreshed every `intervalMs` so relative times ("in 23h 14m") stay honest. */
export default function useNow(intervalMs = 30_000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}
