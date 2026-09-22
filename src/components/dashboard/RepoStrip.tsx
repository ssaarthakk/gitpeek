'use client';
import { useRef } from 'react';
import { Button, IconButton, Sparkline, Tile } from '@/components/kit';
import { LinkStats } from '@/hooks/useLinkStats';
import { formatNumber } from './format';
import { Bone } from './DashboardSkeleton';

type RepoStripProps = {
    repos: LinkStats['byRepo'] | null;
    loading: boolean;
    onPick: (repoFullName: string) => void;
    onNewLink: () => void;
};

function trend(spark: number[]): 'up' | 'danger' | 'muted' {
    const last = spark.slice(-7).reduce((s, v) => s + v, 0);
    const prev = spark.slice(0, -7).reduce((s, v) => s + v, 0);
    if (last > prev) return 'up';
    if (last < prev) return 'danger';
    return 'muted';
}

/** Watchlist-style row of shared repositories: avatar, views, links, 14-day sparkline. */
export default function RepoStrip({ repos, loading, onPick, onNewLink }: RepoStripProps) {
    const scroller = useRef<HTMLDivElement>(null);

    const scrollBy = () => {
        const el = scroller.current;
        if (!el) return;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + Math.max(260, el.clientWidth * 0.8), behavior: 'smooth' });
    };

    return (
        <Tile className="min-w-0" bodyClassName="!py-3 sm:!py-3">
            <div className="flex min-w-0 items-center gap-4">
                <div className="hidden w-24 shrink-0 text-[13px] text-ink-3 md:block">Repositories</div>

                {loading && !repos ? (
                    <div className="flex min-w-0 flex-1 gap-3 overflow-hidden">
                        {[0, 1, 2, 3].map((i) => (
                            <Bone key={i} className="h-[68px] w-[240px] shrink-0 rounded-2xl" />
                        ))}
                    </div>
                ) : !repos || repos.length === 0 ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3 py-2">
                        <p className="text-[13px] text-ink-3">
                            No links yet. Repositories you share show up here with their views.
                        </p>
                        <Button size="sm" variant="secondary" onClick={onNewLink}>
                            Create your first link
                        </Button>
                    </div>
                ) : (
                    <>
                        <div
                            ref={scroller}
                            className="no-scrollbar flex min-w-0 flex-1 snap-x items-stretch overflow-x-auto"
                            aria-label="Shared repositories"
                        >
                            {repos.map((r, i) => {
                                const [owner, name] = r.repoFullName.split('/');
                                return (
                                    <div key={r.repoFullName} className="flex shrink-0 snap-start items-stretch">
                                        {i > 0 && <span className="my-3 w-px bg-line" aria-hidden="true" />}
                                        <button
                                            type="button"
                                            onClick={() => onPick(r.repoFullName)}
                                            title={`New link for ${r.repoFullName}`}
                                            className="flex w-[260px] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-hover"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://github.com/${owner}.png?size=64`}
                                                alt=""
                                                width={44}
                                                height={44}
                                                loading="lazy"
                                                className="h-11 w-11 shrink-0 rounded-full border-2 border-white bg-white object-cover"
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold text-ink">{name || r.repoFullName}</span>
                                                <span className="mt-0.5 block truncate text-xs tabular-nums text-ink-3">
                                                    {formatNumber(r.views)} {r.views === 1 ? 'view' : 'views'} · {r.links}{' '}
                                                    {r.links === 1 ? 'link' : 'links'}
                                                </span>
                                            </span>
                                            <Sparkline values={r.spark} tone={trend(r.spark)} width={64} height={28} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {repos.length > 1 && (
                            <IconButton label="Scroll repositories" onClick={scrollBy}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M6 3l5 5-5 5" />
                                </svg>
                            </IconButton>
                        )}
                    </>
                )}
            </div>
        </Tile>
    );
}
