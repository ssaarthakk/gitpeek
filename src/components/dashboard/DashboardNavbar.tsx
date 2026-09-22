'use client';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/site/Logo';
import { Button, IconButton, PillTabs, cx } from '@/components/kit';
import { DashTab } from './types';

type NavKey = DashTab | 'billing';

type DashboardNavbarProps = {
    session: Session;
    active: NavKey;
    /** Requests waiting on the user: badge on the Requests tab and a dot on the bell. */
    pendingCount?: number;
    /** On /dashboard the first three tabs switch in place; elsewhere they navigate. */
    onNavigate?: (tab: DashTab) => void;
    /** Opens the New link sheet; elsewhere "New link" goes to /dashboard#new. */
    onNewLink?: () => void;
};

const hrefFor: Record<NavKey, string> = {
    overview: '/dashboard',
    links: '/dashboard#links',
    requests: '/dashboard#requests',
    billing: '/dashboard/billing',
};

function initials(name: string) {
    return name
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

/** Signed-in shell: logo pill · pill tabs · bell, credits, account, New link. */
export default function DashboardNavbar({ session, active, pendingCount = 0, onNavigate, onNewLink }: DashboardNavbarProps) {
    const router = useRouter();
    const credits = session.user?.credits || 0;
    const name = session.user?.name || session.user?.email || 'Account';
    const image = session.user?.image || null;

    const go = (key: NavKey) => {
        if (key !== 'billing' && onNavigate) onNavigate(key);
        else router.push(hrefFor[key]);
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <header className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="order-1 flex h-12 shrink-0 items-center rounded-full border border-line bg-surface px-5">
                    <Logo href="/dashboard" />
                </div>

                <nav aria-label="Dashboard" className="order-3 w-full min-w-0 lg:order-2 lg:w-auto">
                    <PillTabs<NavKey>
                        ariaLabel="Dashboard sections"
                        value={active}
                        onChange={go}
                        className="h-12 px-1.5"
                        options={[
                            { value: 'overview', label: 'Overview' },
                            { value: 'links', label: 'Links' },
                            { value: 'requests', label: 'Requests', badge: pendingCount },
                            { value: 'billing', label: 'Billing' },
                        ]}
                    />
                </nav>

                <div className="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3">
                    <IconButton
                        label={pendingCount > 0 ? `${pendingCount} access request${pendingCount === 1 ? '' : 's'} waiting` : 'Access requests'}
                        dot={pendingCount > 0}
                        onClick={() => go('requests')}
                    >
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 8a5 5 0 0110 0c0 4 1.5 5.5 1.5 5.5h-13S5 12 5 8z" />
                            <path d="M8.5 16.5a1.6 1.6 0 003 0" />
                        </svg>
                    </IconButton>

                    <Link
                        href="/dashboard/billing"
                        title={credits > 0 ? 'Add credits' : 'Out of credits, add more'}
                        className="hidden h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink md:inline-flex"
                    >
                        <span className={cx('h-1.5 w-1.5 rounded-full', credits > 0 ? 'bg-up' : 'bg-danger')} />
                        <span className="tabular-nums">{credits}</span> {credits === 1 ? 'credit' : 'credits'}
                    </Link>

                    <Dropdown placement="bottom-end" classNames={{ content: 'min-w-[240px] rounded-[18px] border border-line bg-surface p-1.5' }}>
                        <DropdownTrigger>
                            <button
                                type="button"
                                aria-label="Account menu"
                                className="flex h-10 items-center gap-1.5 rounded-full border border-line-strong pl-1 pr-2.5 outline-none transition-colors hover:bg-hover"
                            >
                                {image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image} alt="" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-ink-2">
                                        {initials(name)}
                                    </span>
                                )}
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink-3" aria-hidden="true">
                                    <path d="M4 6l4 4 4-4" />
                                </svg>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Account"
                            variant="light"
                            itemClasses={{
                                base: 'rounded-xl px-3 py-2 text-ink-2 data-[hover=true]:bg-hover data-[hover=true]:text-ink',
                            }}
                        >
                            <DropdownSection showDivider classNames={{ divider: 'bg-line' }}>
                                <DropdownItem key="profile" isReadOnly className="cursor-default opacity-100" textValue="Signed in as">
                                    <p className="text-xs text-ink-3">Signed in as</p>
                                    <p className="truncate text-[13px] font-medium text-ink">{session.user?.email || name}</p>
                                </DropdownItem>
                                <DropdownItem key="credits" isReadOnly className="cursor-default opacity-100" textValue="Credits">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[13px] text-ink-3">Credits</span>
                                        <span className={cx('text-[13px] font-semibold tabular-nums', credits > 0 ? 'text-ink' : 'text-danger')}>
                                            {credits}
                                        </span>
                                    </div>
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection showDivider classNames={{ divider: 'bg-line' }}>
                                <DropdownItem key="buy" as={Link} href="/dashboard/billing">
                                    Buy credits
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection>
                                <DropdownItem
                                    key="logout"
                                    onPress={handleSignOut}
                                    className="text-danger data-[hover=true]:bg-danger-soft data-[hover=true]:text-danger"
                                >
                                    Sign out
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>

                    <Button
                        onClick={() => (onNewLink ? onNewLink() : router.push('/dashboard#new'))}
                        aria-label="New link"
                        className="px-4 sm:px-5"
                    >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M8 3v10M3 8h10" />
                        </svg>
                        <span className="hidden sm:inline">New link</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
