'use client';
import { Endpoints } from '@octokit/types';
import { cx } from '@/components/kit';
import { timeAgo } from './format';

type Repository = Endpoints['GET /user/repos']['response']['data'][number];

type RepositorySelectorProps = {
    repos: Repository[];
    reposLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedRepo: string;
    setSelectedRepo: (repo: string) => void;
};

/** Filter box + scrollable list of the repositories the GitHub App can see. */
export default function RepositorySelector({
    repos,
    reposLoading,
    searchQuery,
    setSearchQuery,
    selectedRepo,
    setSelectedRepo,
}: RepositorySelectorProps) {
    const q = searchQuery.trim().toLowerCase();
    const filteredRepos = repos.filter(
        (repo) => repo.name.toLowerCase().includes(q) || repo.full_name.toLowerCase().includes(q)
    );

    return (
        <div className="rounded-[18px] bg-surface-2 p-1.5">
            <div className="mb-1.5 flex h-10 items-center gap-2.5 rounded-full border border-line bg-surface px-4 focus-within:border-accent">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-ink-3" aria-hidden="true">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="M10.5 10.5L14 14" />
                </svg>
                <input
                    type="text"
                    placeholder="Filter repositories"
                    aria-label="Filter repositories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-4"
                />
                {!reposLoading && (
                    <span className="shrink-0 text-xs tabular-nums text-ink-4">
                        {filteredRepos.length}/{repos.length}
                    </span>
                )}
            </div>

            <div role="listbox" aria-label="Repository" className="custom-scrollbar max-h-[220px] overflow-y-auto">
                {reposLoading ? (
                    <div className="flex flex-col gap-1 p-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-xl px-3 py-2.5">
                                <div className="mb-1.5 h-3 w-2/3 animate-pulse rounded-full bg-hover" />
                                <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-hover" />
                            </div>
                        ))}
                    </div>
                ) : repos.length === 0 ? (
                    <div className="px-3 py-6 text-center text-[13px] leading-relaxed text-ink-3">
                        No repositories found. If the GitHub App can&apos;t see any yet, use{' '}
                        <span className="text-ink">Manage access</span> on the dashboard to add some.
                    </div>
                ) : filteredRepos.length === 0 ? (
                    <div className="px-3 py-6 text-center text-[13px] text-ink-3">Nothing matches that.</div>
                ) : (
                    filteredRepos.map((repo) => {
                        const on = repo.full_name === selectedRepo;
                        const updated = repo.pushed_at || repo.updated_at;
                        const meta = [repo.language, updated ? `updated ${timeAgo(updated)}` : null]
                            .filter(Boolean)
                            .join(' · ');
                        return (
                            <button
                                key={repo.full_name}
                                type="button"
                                role="option"
                                aria-selected={on}
                                title={repo.description || undefined}
                                onClick={() => setSelectedRepo(repo.full_name)}
                                className={cx(
                                    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                                    on ? 'bg-ink text-bg' : 'hover:bg-hover',
                                )}
                            >
                                <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className={cx('truncate text-[13.5px] font-medium', on ? 'text-bg' : 'text-ink')}>
                                        {repo.full_name}
                                    </span>
                                    {meta && (
                                        <span className={cx('truncate text-xs', on ? 'text-bg/60' : 'text-ink-4')}>{meta}</span>
                                    )}
                                </span>
                                <span
                                    className={cx(
                                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                        on ? 'bg-bg/10 text-bg/70' : 'border border-line-strong text-ink-3',
                                    )}
                                >
                                    {repo.private ? 'Private' : 'Public'}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
