'use client';
import { useMemo, useState } from 'react';
import { Button, Chip, ChipTone, PillTabs, Tile, cx } from '@/components/kit';
import { LinkBucket, ShareLink, hasPassword, linkBucket } from './types';
import { formatNumber, timeAgo, timeUntil } from './format';
import useNow from './useNow';

type ShareLinksTableProps = {
    shareLinks: ShareLink[];
    shareLinksLoading: boolean;
    onDeleteConfirm: (link: ShareLink) => void;
    onNewLink: () => void;
    id?: string;
};

type Filter = 'all' | 'active' | 'expiring' | 'ended';

const cols = 'grid grid-cols-[minmax(220px,1.6fr)_minmax(150px,1fr)_minmax(130px,0.9fr)_64px_104px_168px] items-center gap-4';

/** How long the link was created for, from createdAt → expiresAt: "1h", "24h", "7d". */
function durationBadge(link: ShareLink): string | null {
    if (!link.expiresAt) return null;
    const hours = (new Date(link.expiresAt).getTime() - new Date(link.createdAt).getTime()) / 3_600_000;
    if (hours <= 0) return null;
    if (hours >= 24 && Math.abs(hours / 24 - Math.round(hours / 24)) < 0.05) return `${Math.round(hours / 24)}d`.replace(/^1d$/, '24h');
    return `${Math.max(1, Math.round(hours))}h`;
}

function status(link: ShareLink, bucket: LinkBucket, now: number): { tone: ChipTone; text: string } {
    if (bucket === 'used') return { tone: 'danger', text: 'Used once' };
    if (bucket === 'expired') return { tone: 'danger', text: 'Expired' };
    if (!link.expiresAt) return { tone: 'up', text: 'Live' };
    return { tone: bucket === 'expiring' ? 'sun' : 'up', text: `Closes ${timeUntil(link.expiresAt, now)}` };
}

export default function ShareLinksTable({ shareLinks, shareLinksLoading, onDeleteConfirm, onNewLink, id }: ShareLinksTableProps) {
    const now = useNow();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');

    const copyToClipboard = async (linkId: string) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/view/${linkId}`);
            setCopiedId(linkId);
            setTimeout(() => setCopiedId((cur) => (cur === linkId ? null : cur)), 1500);
        } catch (e) {
            console.error('Clipboard write failed', e);
        }
    };

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return shareLinks
            .map((link) => ({ link, bucket: linkBucket(link, now) }))
            .filter(({ link, bucket }) => {
                if (filter === 'active' && bucket !== 'active') return false;
                if (filter === 'expiring' && bucket !== 'expiring') return false;
                if (filter === 'ended' && bucket !== 'expired' && bucket !== 'used') return false;
                if (!q) return true;
                return (
                    link.repoFullName.toLowerCase().includes(q) ||
                    link.id.toLowerCase().includes(q) ||
                    (link.ref || '').toLowerCase().includes(q)
                );
            });
    }, [shareLinks, filter, query, now]);

    return (
        <Tile id={id} className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-[15px] font-semibold text-ink">Links</h2>
                    {!shareLinksLoading && <span className="text-[13px] tabular-nums text-ink-3">{shareLinks.length}</span>}
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    <PillTabs<Filter>
                        ariaLabel="Filter links"
                        size="sm"
                        value={filter}
                        onChange={setFilter}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'active', label: 'Active' },
                            { value: 'expiring', label: 'Expiring' },
                            { value: 'ended', label: 'Ended' },
                        ]}
                    />
                    <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 focus-within:border-accent sm:w-56 sm:flex-none">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-ink-3" aria-hidden="true">
                            <circle cx="7" cy="7" r="4.5" />
                            <path d="M10.5 10.5L14 14" />
                        </svg>
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search links"
                            aria-label="Search links"
                            className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-4"
                        />
                    </label>
                </div>
            </div>

            {shareLinksLoading ? (
                <div className="flex flex-col gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[60px] animate-pulse rounded-2xl bg-surface-2" />
                    ))}
                </div>
            ) : shareLinks.length === 0 ? (
                <div className="flex flex-col items-center rounded-[18px] bg-surface-2 px-5 py-12 text-center">
                    <p className="text-[15px] font-medium text-ink">You haven&apos;t shared anything yet.</p>
                    <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-3">
                        Pick a repository, set how long the link lasts, and send it. It shows up here.
                    </p>
                    <Button className="mt-5" onClick={onNewLink}>
                        New link
                    </Button>
                </div>
            ) : (
                <div className="custom-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
                    <div className="min-w-[860px]">
                        <div className={cx(cols, 'px-4 pb-2.5 text-xs text-ink-3')}>
                            <div>Repository</div>
                            <div>Restrictions</div>
                            <div>Status</div>
                            <div className="text-right">Views</div>
                            <div>Created</div>
                            <div />
                        </div>

                        {rows.length === 0 ? (
                            <div className="rounded-2xl bg-surface-2 px-4 py-10 text-center text-[13px] text-ink-3">
                                No links match {query.trim() ? 'that search' : 'this filter'}.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                {rows.map(({ link, bucket }) => {
                                    const ended = bucket === 'expired' || bucket === 'used';
                                    const views = link._count?.linkViews || 0;
                                    const copied = copiedId === link.id;
                                    const st = status(link, bucket, now);
                                    const rules = [
                                        durationBadge(link),
                                        hasPassword(link) ? 'Password' : null,
                                        link.isOneTime ? 'One open' : null,
                                        link.allowCopying ? null : 'No copy',
                                        link.requireEmail ? 'Email' : null,
                                    ].filter((b): b is string => !!b);

                                    return (
                                        <div
                                            key={link.id}
                                            className={cx(cols, 'rounded-2xl bg-surface-2 px-4 py-3 transition-colors hover:bg-hover')}
                                        >
                                            <div className={cx('flex min-w-0 flex-col gap-1', ended && 'opacity-50')}>
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <a
                                                        href={`/view/${link.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate text-sm font-medium text-ink hover:text-accent"
                                                        title={`Open /view/${link.id}`}
                                                    >
                                                        {link.repoFullName}
                                                    </a>
                                                    <Chip className="shrink-0">{link.ref || 'main'}</Chip>
                                                </div>
                                                <span className="truncate text-xs text-ink-4">/view/{link.id}</span>
                                            </div>

                                            <div className={cx('flex flex-wrap gap-1', ended && 'opacity-50')}>
                                                {rules.length === 0 ? (
                                                    <span className="text-xs text-ink-4">None</span>
                                                ) : (
                                                    rules.map((b) => (
                                                        <Chip key={b}>
                                                            {b}
                                                        </Chip>
                                                    ))
                                                )}
                                            </div>

                                            <div title={link.expiresAt ? new Date(link.expiresAt).toLocaleString() : undefined}>
                                                <Chip tone={st.tone} dot>
                                                    {st.text}
                                                </Chip>
                                            </div>

                                            <span className={cx('text-right text-sm font-semibold tabular-nums text-ink', ended && 'opacity-50')}>
                                                {formatNumber(views)}
                                                {link.isOneTime && <span className="font-normal text-ink-4"> /1</span>}
                                            </span>

                                            <span className="text-xs text-ink-3" title={new Date(link.createdAt).toLocaleString()}>
                                                {timeAgo(link.createdAt, now)}
                                            </span>

                                            <div className="flex justify-end gap-1.5">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(link.id)}
                                                    className="min-w-[72px]"
                                                >
                                                    {copied ? 'Copied' : 'Copy'}
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => onDeleteConfirm(link)} className="min-w-[72px]">
                                                    {ended ? 'Delete' : 'Revoke'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!shareLinksLoading && shareLinks.length > 0 && (
                <p className="mt-4 text-xs text-ink-4">
                    Revoking is immediate. Anyone with the page open loses it on their next request.
                </p>
            )}
        </Tile>
    );
}
