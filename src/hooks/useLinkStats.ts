'use client';

import { useCallback, useEffect, useState } from 'react';

export type StatsRange = '7d' | '30d' | '90d' | 'all';

/** Shape returned by GET /api/links/stats. */
export type LinkStats = {
    range: StatsRange;
    viewsByDay: { date: string; views: number }[];
    totals: { views: number; previousViews: number; allTimeViews: number; links: number };
    byRepo: { repoFullName: string; links: number; views: number; spark: number[] }[];
    linksByStatus: { live: number; expiring: number; expired: number; used: number };
    pendingRequests: number;
};

/** % change vs the previous period, or null when there is nothing to compare against. */
export function viewsDelta(stats: LinkStats | null): number | null {
    if (!stats) return null;
    const { views, previousViews } = stats.totals;
    if (previousViews === 0) return views === 0 ? 0 : null;
    return ((views - previousViews) / previousViews) * 100;
}

export default function useLinkStats(initialRange: StatsRange = '30d') {
    const [range, setRange] = useState<StatsRange>(initialRange);
    const [stats, setStats] = useState<LinkStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/links/stats?range=${range}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            setStats(await res.json());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not load stats');
        } finally {
            setIsLoading(false);
        }
    }, [range]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { stats, range, setRange, isLoading, error, refresh };
}
