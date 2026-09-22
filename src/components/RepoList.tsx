'use client';

import useRepos from '@/hooks/useRepo';
import { cx, inputClass } from '@/components/kit';

type RepoListProps = {
    onRepoSelect: (repoFullName: string) => void;
};

/** Compact repository picker (native select in the kit's input style). */
export default function RepoList({ onRepoSelect }: RepoListProps) {
    const { repos, isLoading } = useRepos();

    if (isLoading) {
        return <div className="h-11 w-full min-w-[280px] animate-pulse rounded-xl bg-surface-2" />;
    }

    if (repos.length === 0) return null;

    return (
        <div className="relative min-w-[280px]">
            <select
                aria-label="Repository selector"
                defaultValue=""
                onChange={(event) => onRepoSelect(event.target.value)}
                className={cx(inputClass, 'appearance-none pr-10')}
            >
                <option value="" disabled>
                    Select a repository
                </option>
                {repos.map((repo) => (
                    <option key={repo.full_name} value={repo.full_name}>
                        {repo.full_name}
                    </option>
                ))}
            </select>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true">
                <path d="M4 6l4 4 4-4" />
            </svg>
        </div>
    );
}
