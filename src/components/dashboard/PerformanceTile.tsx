'use client';
import { useMemo } from 'react';
import { AreaChart, Button, Chip, DeltaPill, IconButton, PillTabs, StatCell, Tile, cx } from '@/components/kit';
import { LinkStats, StatsRange, viewsDelta } from '@/hooks/useLinkStats';
import { formatCompact, formatNumber, longDay, shortDay } from './format';
import { Bone } from './DashboardSkeleton';

type PerformanceTileProps = {
    stats: LinkStats | null;
    statsLoading: boolean;
    statsError: string | null;
    range: StatsRange;
    setRange: (r: StatsRange) => void;
    onRefresh: () => void;
    /** Live links (active + expiring); null while links load. */
    activeLinks: number | null;
    expiringSoon: number | null;
    pendingCount: number;
    credits: number;
    onOpenRequests: () => void;
    isInstalled: boolean;
    isLoadingInstall: boolean;
    openInstallationWindow: () => void;
    reposLoading: boolean;
    repoCount: number;
};

const rangeLabel: Record<StatsRange, string> = {
    '7d': 'last 7 days',
    '30d': 'last 30 days',
    '90d': 'last 90 days',
    all: 'all time',
};

const rangeOptions: { value: StatsRange; label: string }[] = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'all', label: 'All' },
];

function InstallStatus({
    isInstalled,
    isLoadingInstall,
    openInstallationWindow,
    reposLoading,
    repoCount,
}: Pick<PerformanceTileProps, 'isInstalled' | 'isLoadingInstall' | 'openInstallationWindow' | 'reposLoading' | 'repoCount'>) {
    if (isLoadingInstall) return <Chip>Checking GitHub App…</Chip>;
    if (!isInstalled) {
        return (
            <>
                <Chip tone="danger" dot>
                    GitHub App not installed
                </Chip>
                <Button size="sm" onClick={openInstallationWindow}>
                    Install
                </Button>
            </>
        );
    }
    return (
        <>
            <Chip tone="up" dot>
                {reposLoading ? 'GitHub App installed' : `${repoCount} ${repoCount === 1 ? 'repository' : 'repositories'} connected`}
            </Chip>
            <Button variant="secondary" size="sm" onClick={openInstallationWindow}>
                Manage access
            </Button>
        </>
    );
}

/** "Link performance": views + four stat cells on the left, the orange views chart on the right. */
export default function PerformanceTile(props: PerformanceTileProps) {
    const { stats, statsLoading, statsError, range, setRange, onRefresh, activeLinks, expiringSoon, pendingCount, credits, onOpenRequests } =
        props;

    const series = useMemo(
        () => (stats?.viewsByDay ?? []).map((d) => ({ label: shortDay(d.date), value: d.views, detail: longDay(d.date) })),
        [stats],
    );
    const delta = viewsDelta(stats);
    const firstLoad = !stats && statsLoading;
    const refreshing = !!stats && statsLoading;

    return (
        <Tile
            title="Link performance"
            className="min-w-0"
            actions={
                <>
                    <InstallStatus {...props} />
                    <IconButton label="Refresh numbers" onClick={onRefresh} disabled={statsLoading}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cx(refreshing && 'animate-spin')}
                            aria-hidden="true"
                        >
                            <path d="M16 10a6 6 0 11-1.8-4.3" />
                            <path d="M16 3.5v3.2h-3.2" />
                        </svg>
                    </IconButton>
                </>
            }
        >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
                <div className="flex min-w-0 flex-col gap-5">
                    <div className="px-1 pt-1">
                        <div className="text-[13px] text-ink-3">Views · {rangeLabel[range]}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            {firstLoad ? (
                                <Bone className="h-10 w-28 rounded-xl" />
                            ) : (
                                <span className="text-[40px] font-semibold leading-none tabular-nums text-ink">
                                    {formatNumber(stats?.totals.views ?? 0)}
                                </span>
                            )}
                            {stats && range !== 'all' && <DeltaPill value={delta} />}
                        </div>
                        <div className="mt-2 text-xs text-ink-4">
                            {stats
                                ? range === 'all'
                                    ? `Across ${formatNumber(stats.totals.links)} ${stats.totals.links === 1 ? 'link' : 'links'}`
                                    : `vs ${formatNumber(stats.totals.previousViews)} the ${rangeLabel[range].replace('last ', 'previous ')}`
                                : ' '}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <StatCell label="Active links" tick="up" value={activeLinks ?? '–'} />
                        <StatCell label="Expiring in 24h" tick="sun" value={expiringSoon ?? '–'} />
                        <StatCell label="Pending requests" tick="accent" value={pendingCount} onClick={onOpenRequests} />
                        <StatCell label="Credits" tick="ink" value={credits} unit={credits === 1 ? 'link left' : 'links left'} />
                    </div>
                </div>

                <Tile tone="accent" as="div" className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-[15px] font-semibold text-white">Views over time</h3>
                            {stats && (
                                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold tabular-nums text-bg">
                                    {formatNumber(stats.totals.views)} {stats.totals.views === 1 ? 'view' : 'views'}
                                </span>
                            )}
                        </div>
                        <PillTabs<StatsRange>
                            ariaLabel="Chart range"
                            tone="onAccent"
                            size="sm"
                            value={range}
                            onChange={setRange}
                            options={rangeOptions}
                        />
                    </div>

                    {statsError && !stats ? (
                        <div className="flex h-[220px] flex-col items-center justify-center gap-3 rounded-2xl bg-white/10 text-center">
                            <p className="text-sm text-white">Couldn&apos;t load views.</p>
                            <Button size="sm" onClick={onRefresh}>
                                Try again
                            </Button>
                        </div>
                    ) : firstLoad ? (
                        <div className="h-[220px] animate-pulse rounded-2xl bg-white/10" />
                    ) : (
                        <div className={cx('relative transition-opacity', refreshing && 'opacity-60')}>
                            <AreaChart data={series} height={220} formatValue={formatCompact} unit="views" />
                            {stats && stats.totals.views === 0 && (
                                <div className="pointer-events-none absolute inset-x-0 top-6 text-center text-[13px] text-white/85">
                                    No views in this period yet.
                                </div>
                            )}
                        </div>
                    )}
                </Tile>
            </div>
        </Tile>
    );
}
