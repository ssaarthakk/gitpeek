// Small date helpers for the dashboard. Copy names the real thing:
// "in 23h 14m", "11 min ago" — never "Active".

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** "in 23h 14m", "in 5d 2h", "in 42m", "in under a minute". */
export function timeUntil(date: string | Date, now = Date.now()): string {
    const ms = new Date(date).getTime() - now;
    if (ms <= 0) return 'expired';
    if (ms < MIN) return 'in under a minute';
    const d = Math.floor(ms / DAY);
    const h = Math.floor((ms % DAY) / HOUR);
    const m = Math.floor((ms % HOUR) / MIN);
    if (d > 0) return h > 0 ? `in ${d}d ${h}h` : `in ${d}d`;
    if (h > 0) return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
    return `in ${m}m`;
}

/** "just now", "11 min ago", "2 hours ago", "yesterday", "3 days ago", "12 Aug 2026". */
export function timeAgo(date: string | Date, now = Date.now()): string {
    const then = new Date(date);
    const ms = now - then.getTime();
    if (ms < MIN) return 'just now';
    if (ms < HOUR) return `${Math.floor(ms / MIN)} min ago`;
    if (ms < DAY) {
        const h = Math.floor(ms / HOUR);
        return `${h} hour${h === 1 ? '' : 's'} ago`;
    }
    if (ms < 2 * DAY) return 'yesterday';
    if (ms < 30 * DAY) return `${Math.floor(ms / DAY)} days ago`;
    return formatDate(then);
}

/** "2 Sep 2026" */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const ONE_HOUR = HOUR;
export const ONE_DAY = DAY;

/** 1234 → "1,234" */
export function formatNumber(n: number): string {
    return n.toLocaleString('en-US');
}

/** Axis-friendly: 2.5 → "2.5", 1200 → "1.2k". */
export function formatCompact(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** "2026-09-12" (UTC day key from the stats API) → "12 Sep". */
export function shortDay(key: string): string {
    return new Date(`${key}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** "2026-09-12" → "Sat 12 Sep 2026". */
export function longDay(key: string): string {
    return new Date(`${key}T00:00:00Z`).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}
