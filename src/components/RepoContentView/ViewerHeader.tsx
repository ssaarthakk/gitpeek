'use client';

import { useEffect, useState } from 'react';
import { DownloadIcon, ListUnorderedIcon } from '@primer/octicons-react';
import { Chip, IconButton, cx, type ChipTone } from '@/components/kit';
import { LogoPill, RepoGlyph } from '@/components/view/GateShell';

type ViewerHeaderProps = {
    repoFullName: string;
    branch?: string;
    expiresAt?: string | null;
    isOneTime?: boolean;
    onDownload?: () => void;
    /** Narrow screens: open the file tree overlay. */
    onOpenTree?: () => void;
};

/** Under this much time left the chip turns yellow. */
const SOON_MS = 3 * 60 * 60 * 1000;

function formatRemaining(ms: number) {
    const totalMinutes = Math.max(1, Math.floor(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function ExpiryChip({ expiresAt, isOneTime }: { expiresAt?: string | null; isOneTime?: boolean }) {
    // Computed on the client only, so server and client markup never disagree about "now".
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now());
        const id = window.setInterval(() => setNow(Date.now()), 30_000);
        return () => window.clearInterval(id);
    }, []);

    if (!expiresAt) {
        if (!isOneTime) return null;
        return <Chip className="shrink-0">One-time link</Chip>;
    }

    if (now === null) {
        return <span className="inline-block h-6 w-[88px] shrink-0 rounded-full bg-surface-2 sm:w-[132px]" aria-hidden="true" />;
    }

    const remaining = new Date(expiresAt).getTime() - now;
    const tone: ChipTone = remaining <= 0 ? 'danger' : remaining < SOON_MS ? 'sun' : 'up';

    return (
        <Chip tone={tone} dot className="shrink-0 tabular-nums" title={new Date(expiresAt).toLocaleString()}>
            {remaining <= 0 ? (
                'Expired'
            ) : (
                <>
                    <span className="hidden sm:inline">Expires in </span>
                    {formatRemaining(remaining)}
                </>
            )}
            {isOneTime && <span className="hidden lg:inline"> · one-time</span>}
        </Chip>
    );
}

export default function ViewerHeader({ repoFullName, branch, expiresAt, isOneTime, onDownload, onOpenTree }: ViewerHeaderProps) {
    const hasExpiry = !!expiresAt || !!isOneTime;
    return (
        <header className="flex shrink-0 items-center gap-2">
            <div className="hidden shrink-0 sm:block">
                <LogoPill />
            </div>

            <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface pl-4 pr-1.5 sm:flex-initial">
                <RepoGlyph className="h-[15px] w-[15px] shrink-0 text-ink-4" />
                <span className="min-w-0 truncate text-sm font-semibold text-ink" title={repoFullName}>
                    {repoFullName}
                </span>
                {branch && (
                    <span className="hidden max-w-[140px] shrink-0 min-[480px]:flex">
                        <Chip title={`Branch: ${branch}`}>{branch}</Chip>
                    </span>
                )}
                {/* Keeps the pill's right padding even when there's no branch chip. */}
                {!branch && <span className="w-2.5 shrink-0" />}
            </div>

            <div className="hidden flex-1 sm:block" />

            <div className={cx('h-12 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-1.5', hasExpiry ? 'flex' : 'hidden md:flex')}>
                <span className="hidden shrink-0 md:flex">
                    <Chip>
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                            <rect x="3" y="7" width="10" height="7" rx="1.5" />
                            <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
                        </svg>
                        Read-only
                    </Chip>
                </span>
                <ExpiryChip expiresAt={expiresAt} isOneTime={isOneTime} />
            </div>

            {onDownload && (
                <button
                    type="button"
                    onClick={onDownload}
                    title="Download ZIP"
                    aria-label="Download ZIP"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-bg transition-colors hover:bg-white sm:h-12 sm:w-auto sm:px-5"
                >
                    <DownloadIcon size={16} />
                    <span className="hidden sm:inline">Download ZIP</span>
                </button>
            )}

            {onOpenTree && (
                <IconButton label="Show files" onClick={onOpenTree} className="md:hidden">
                    <ListUnorderedIcon size={16} />
                </IconButton>
            )}
        </header>
    );
}
