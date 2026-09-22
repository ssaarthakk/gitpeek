'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Endpoints } from '@octokit/types';
import { GitHubMark } from '@/components/site/icons';
import { Button, cx, inputClass } from '@/components/kit';
import RepositorySelector from './RepositorySelector';
import { ExpiryOption } from './types';
import { label } from './ui';

type Repository = Endpoints['GET /user/repos']['response']['data'][number];

export type NewLinkOptions = {
    password?: string;
    isOneTime: boolean;
    allowCopying: boolean;
    requireEmail: boolean;
    branch: string;
};

type NewLinkPanelProps = {
    credits: number;
    repos: Repository[];
    reposLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedRepo: string;
    setSelectedRepo: (repo: string) => void;
    selectedExpiry: ExpiryOption;
    setSelectedExpiry: (expiry: ExpiryOption) => void;
    /** Resolves true when the link was created, so the form can reset. */
    onCreate: (options: NewLinkOptions) => Promise<boolean>;
    isCreating: boolean;
    isInstalled: boolean;
    isLoadingInstall: boolean;
    openInstallationWindow: () => void;
};

const expiries: { key: ExpiryOption; label: string }[] = [
    { key: '1-hour', label: '1 hour' },
    { key: '24-hours', label: '24 hours' },
    { key: '7-days', label: '7 days' },
    { key: 'never', label: 'Never' },
];

// Branch pills read well for a handful; beyond that a select is easier to scan.
const MAX_BRANCH_PILLS = 5;

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={cx(
                'h-8 max-w-full truncate rounded-full px-3.5 text-[13px] font-medium transition-colors',
                on ? 'bg-ink text-bg' : 'border border-line-strong text-ink-2 hover:bg-hover hover:text-ink',
            )}
        >
            {children}
        </button>
    );
}

function Toggle({
    on,
    onChange,
    title,
    hint,
}: {
    on: boolean;
    onChange: (v: boolean) => void;
    title: string;
    hint: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-hover"
        >
            <span className="min-w-0">
                <span className={cx('block text-sm font-medium', on ? 'text-ink' : 'text-ink-2')}>{title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-3">{hint}</span>
            </span>
            <span
                className={cx(
                    'relative block h-6 w-10 shrink-0 rounded-full transition-colors',
                    on ? 'bg-up' : 'bg-line-strong',
                )}
            >
                <span
                    className={cx(
                        'absolute top-1 h-4 w-4 rounded-full bg-white transition-[left] duration-150',
                        on ? 'left-5' : 'left-1',
                    )}
                />
            </span>
        </button>
    );
}

/**
 * "New link" form: repository, branch, expiry and restrictions, then create.
 * Rendered inside the right-hand sheet on the dashboard; same fields and API payload as before.
 */
export default function NewLinkPanel({
    credits,
    repos,
    reposLoading,
    searchQuery,
    setSearchQuery,
    selectedRepo,
    setSelectedRepo,
    selectedExpiry,
    setSelectedExpiry,
    onCreate,
    isCreating,
    isInstalled,
    isLoadingInstall,
    openInstallationWindow,
}: NewLinkPanelProps) {
    const [installLoading, setInstallLoading] = useState(false);

    const [passwordProtected, setPasswordProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [isOneTime, setIsOneTime] = useState(false);
    const [blockCopying, setBlockCopying] = useState(true); // allowCopying defaults to false in the DB
    const [requireEmail, setRequireEmail] = useState(false);

    const [branches, setBranches] = useState<string[]>([]);
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [branchesFailed, setBranchesFailed] = useState(false);

    useEffect(() => {
        if (!selectedRepo) return;
        let stale = false;
        setLoadingBranches(true);
        setBranchesFailed(false);
        setBranches([]);
        setSelectedBranch('main');
        fetch(`/api/github/metadata?repo=${selectedRepo}`)
            .then((res) => res.json())
            .then((data) => {
                if (stale) return;
                if (Array.isArray(data) && data.length > 0) {
                    setBranches(data);
                    setSelectedBranch(data.includes('main') ? 'main' : data[0]);
                } else {
                    setBranchesFailed(true);
                }
            })
            .catch((err) => {
                console.error(err);
                if (!stale) setBranchesFailed(true);
            })
            .finally(() => {
                if (!stale) setLoadingBranches(false);
            });
        return () => {
            stale = true;
        };
    }, [selectedRepo]);

    const handleInstallClick = () => {
        setInstallLoading(true);
        try {
            openInstallationWindow();
        } catch {
            setInstallLoading(false);
        }
    };

    const resetOptions = () => {
        setPasswordProtected(false);
        setPassword('');
        setIsOneTime(false);
        setBlockCopying(true);
        setRequireEmail(false);
    };

    const outOfCredits = credits <= 0;
    const needsPassword = passwordProtected && !password;
    const canCreate = !!selectedRepo && !outOfCredits && !needsPassword && !isCreating && !loadingBranches;

    const handleCreate = async () => {
        if (!canCreate) return;
        const ok = await onCreate({
            password: passwordProtected && password ? password : undefined,
            isOneTime,
            allowCopying: !blockCopying,
            requireEmail,
            branch: selectedBranch,
        });
        if (ok) resetOptions();
    };

    let hint: React.ReactNode;
    if (outOfCredits) {
        hint = (
            <Link href="/dashboard/billing" className="text-accent hover:underline">
                Buy credits to keep sharing
            </Link>
        );
    } else if (!selectedRepo) {
        hint = 'Pick a repository first';
    } else if (needsPassword) {
        hint = 'Enter a password, or turn it off';
    } else {
        hint = `Uses 1 credit · ${credits - 1} will remain`;
    }

    if (isLoadingInstall) {
        return <div className="py-16 text-center text-sm text-ink-3">Checking your GitHub App installation…</div>;
    }

    if (!isInstalled) {
        return (
            <div className="flex flex-col items-start gap-5 py-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
                    <GitHubMark className="h-6 w-6 text-ink" />
                </span>
                <div>
                    <h3 className="text-lg font-semibold text-ink">Install the GitHub App first</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        GitPeek reads repositories through its GitHub App. Install it on your account and choose which
                        repositories it can see; you can change that later.
                    </p>
                </div>
                <Button onClick={handleInstallClick} disabled={installLoading} size="lg" className="w-full">
                    <GitHubMark className="h-4 w-4" />
                    {installLoading ? 'Waiting for GitHub…' : 'Install GitHub App'}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-2">
            <div>
                <div className={cx(label, 'mb-2.5')}>Repository</div>
                <RepositorySelector
                    repos={repos}
                    reposLoading={reposLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedRepo={selectedRepo}
                    setSelectedRepo={setSelectedRepo}
                />
            </div>

            <div>
                <div className={cx(label, 'mb-2.5')}>Branch</div>
                {!selectedRepo ? (
                    <p className="text-[13px] text-ink-4">Pick a repository to see its branches.</p>
                ) : loadingBranches ? (
                    <div className="flex gap-1.5">
                        {[56, 80, 64].map((w) => (
                            <div key={w} style={{ width: w }} className="h-8 animate-pulse rounded-full bg-surface-2" />
                        ))}
                    </div>
                ) : branches.length === 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-[13px] font-medium text-bg">
                            {selectedBranch}
                        </span>
                        {branchesFailed && (
                            <span className="text-xs text-ink-4">
                                Couldn&apos;t load branches; {selectedBranch} will be shared
                            </span>
                        )}
                    </div>
                ) : branches.length <= MAX_BRANCH_PILLS ? (
                    <div className="flex flex-wrap gap-1.5">
                        {branches.map((b) => (
                            <Pill key={b} on={b === selectedBranch} onClick={() => setSelectedBranch(b)}>
                                {b}
                            </Pill>
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        <select
                            aria-label="Branch"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className={cx(inputClass, 'appearance-none pr-10')}
                        >
                            {branches.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true">
                            <path d="M4 6l4 4 4-4" />
                        </svg>
                    </div>
                )}
            </div>

            <div>
                <div className={cx(label, 'mb-2.5')}>Expires</div>
                <div className="flex flex-wrap gap-1.5">
                    {expiries.map((e) => (
                        <Pill key={e.key} on={selectedExpiry === e.key} onClick={() => setSelectedExpiry(e.key)}>
                            {e.label}
                        </Pill>
                    ))}
                </div>
                <p className="mt-2.5 text-xs text-ink-3">
                    {selectedExpiry === 'never'
                        ? 'Stays open until you revoke it.'
                        : `Closes ${expiries.find((e) => e.key === selectedExpiry)?.label} after you create it.`}
                </p>
            </div>

            <div>
                <div className={cx(label, 'mb-2')}>Restrictions</div>
                <div className="rounded-[18px] bg-surface-2 p-1">
                    <Toggle
                        on={passwordProtected}
                        onChange={setPasswordProtected}
                        title="Require a password"
                        hint="Readers enter it before they see the repository"
                    />
                    {passwordProtected && (
                        <div className="px-3 pb-2">
                            <input
                                type="password"
                                aria-label="Password"
                                placeholder="Password readers must enter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-accent"
                            />
                        </div>
                    )}
                    <Toggle
                        on={isOneTime}
                        onChange={setIsOneTime}
                        title="Expire after first open"
                        hint="The link stops working once it has been opened"
                    />
                    <Toggle
                        on={blockCopying}
                        onChange={setBlockCopying}
                        title="Block copy and download"
                        hint="No text selection, no ZIP download"
                    />
                    <Toggle
                        on={requireEmail}
                        onChange={setRequireEmail}
                        title="Require a verified email"
                        hint="Readers verify an address first, so you can see who opened it"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <Button onClick={handleCreate} disabled={!canCreate} size="lg" className="w-full">
                    {isCreating ? 'Creating…' : outOfCredits ? 'Out of credits' : 'Create link'}
                </Button>
                <div className="text-center text-xs text-ink-3">{hint}</div>
            </div>
        </div>
    );
}
