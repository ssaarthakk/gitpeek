'use client';
import Link from 'next/link';
import { BlockBars, Button, Chip, Gauge, IconButton, Tile, iconButtonClass } from '@/components/kit';
import { PendingRequest } from './types';
import { formatNumber, timeAgo } from './format';
import { Bone } from './DashboardSkeleton';

type OverviewBottomRowProps = {
    buckets: { active: number; expiring: number; expired: number; used: number } | null;
    credits: number;
    /** Links created so far (all time), for the credit gauge. */
    linksCreated: number | null;
    requests: PendingRequest[];
    approvedLinks: Record<string, string>;
    approvingId: string | null;
    onApprove: (requestId: string, originalLinkId: string) => void;
    onOpenLinks: () => void;
    onOpenRequests: () => void;
};

const Arrow = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 11l6-6M6 5h5v5" />
    </svg>
);

/** Links by status (block bars) · Credits (gauge) · Access requests (glass). */
export default function OverviewBottomRow({
    buckets,
    credits,
    linksCreated,
    requests,
    approvedLinks,
    approvingId,
    onApprove,
    onOpenLinks,
    onOpenRequests,
}: OverviewBottomRowProps) {
    const held = credits + (linksCreated ?? 0);
    const latest = requests.slice(0, 3);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Tile
                title="Links by status"
                className="min-w-0 md:col-span-2 xl:col-span-1"
                actions={
                    <IconButton label="Open links" onClick={onOpenLinks}>
                        <Arrow />
                    </IconButton>
                }
            >
                {buckets ? (
                    <BlockBars
                        height={150}
                        bars={[
                            { label: 'Active', value: buckets.active, tone: 'accent' },
                            { label: 'Expiring', value: buckets.expiring, tone: 'sun' },
                            { label: 'Expired', value: buckets.expired, tone: 'ink' },
                            { label: 'Used once', value: buckets.used, tone: 'hatch' },
                        ]}
                    />
                ) : (
                    <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                            <Bone key={i} className="h-[150px] rounded-xl" />
                        ))}
                    </div>
                )}
            </Tile>

            <Tile
                title="Credits"
                className="min-w-0"
                actions={
                    <Link href="/dashboard/billing" aria-label="Billing" title="Billing" className={iconButtonClass}>
                        <Arrow />
                    </Link>
                }
            >
                <div className="flex items-baseline gap-1.5">
                    <span className="text-[40px] font-semibold leading-none tabular-nums text-ink">{credits}</span>
                    {linksCreated !== null && <span className="text-lg tabular-nums text-ink-3">/{formatNumber(held)}</span>}
                </div>
                <div className="mt-1.5 text-xs text-ink-3">
                    {credits === 1 ? 'Link' : 'Links'} left
                    {linksCreated !== null && ` · ${formatNumber(linksCreated)} created so far`}
                </div>
                <Gauge
                    className="mt-3"
                    value={credits}
                    max={Math.max(held, 1)}
                    caption={credits > 0 ? 'One credit makes one link' : 'Out of credits. Add more to keep sharing'}
                />
            </Tile>

            <Tile
                tone="glass"
                title="Access requests"
                className="min-w-0"
                actions={
                    <IconButton label="Open requests" onClick={onOpenRequests}>
                        <Arrow />
                    </IconButton>
                }
            >
                {latest.length === 0 ? (
                    <div className="flex h-full min-h-[160px] flex-col justify-end">
                        <p className="text-[15px] font-medium leading-snug text-ink">No one is waiting on you.</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                            Readers who hit an ended link can ask for access. Approving sends them a fresh 7-day link, free.
                        </p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {latest.map((r) => (
                            <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-white/[.05] px-3.5 py-3">
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13.5px] font-medium text-ink" title={r.viewerEmail}>
                                        {r.viewerEmail}
                                    </div>
                                    <div className="truncate text-xs text-ink-3">
                                        {r.shareLink.repoFullName} · {timeAgo(r.createdAt)}
                                    </div>
                                </div>
                                {approvedLinks[r.id] ? (
                                    <Chip tone="up">Approved</Chip>
                                ) : (
                                    <Button size="sm" onClick={() => onApprove(r.id, r.shareLinkId)} disabled={approvingId === r.id}>
                                        {approvingId === r.id ? 'Approving…' : 'Approve'}
                                    </Button>
                                )}
                            </li>
                        ))}
                        {requests.length > latest.length && (
                            <li>
                                <button type="button" onClick={onOpenRequests} className="px-1 pt-1 text-[13px] text-ink-2 hover:text-ink">
                                    {requests.length - latest.length} more
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </Tile>
        </div>
    );
}
