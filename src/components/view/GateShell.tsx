import type { ReactNode } from 'react';
import Logo from '@/components/site/Logo';
import { Chip, Tile, buttonClass, cx, inputClass as kitInputClass, type ChipTone } from '@/components/kit';

/*
 * Shared frame for everything a reader can hit before the repository itself:
 * password, email wall, expired / used link, request access, and the
 * "can't open this" error states. Server-safe (no hooks) so the view page can
 * render it directly.
 */

export type GateTone = 'accent' | 'danger' | 'warn' | 'up' | 'neutral';
export type GateIconName = 'lock' | 'mail' | 'clock' | 'plus' | 'alert' | 'check';

const circleTone: Record<GateTone, string> = {
    accent: 'bg-accent-soft text-accent',
    danger: 'bg-danger-soft text-danger',
    warn: 'bg-sun-soft text-sun',
    up: 'bg-up-soft text-up',
    neutral: 'bg-surface-2 text-ink-3',
};

const chipTone: Record<GateTone, ChipTone> = {
    accent: 'accent',
    danger: 'danger',
    warn: 'sun',
    up: 'up',
    neutral: 'default',
};

export const inputClass = cx(kitInputClass, 'h-12');

export const textareaClass = cx(kitInputClass, 'resize-y py-3 leading-relaxed');

export const primaryButtonClass = buttonClass('primary', 'lg', 'w-full');

export const secondaryButtonClass = buttonClass('secondary', 'lg', 'w-full');

/** The logo wrapped in its own pill, as in the app's top bars. */
export function LogoPill({ href = '/', className }: { href?: string; className?: string }) {
    return (
        <div className={cx('inline-flex h-12 shrink-0 items-center rounded-full border border-line bg-surface px-4', className)}>
            <Logo href={href} />
        </div>
    );
}

export function RepoGlyph({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
        </svg>
    );
}

export function GateIcon({ name, className }: { name: GateIconName; className?: string }) {
    const common = {
        className,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
    };
    switch (name) {
        case 'lock':
            return (
                <svg {...common}>
                    <rect x="2.75" y="7" width="10.5" height="7" rx="1.5" />
                    <path d="M5.25 7V4.75a2.75 2.75 0 0 1 5.5 0V7" />
                </svg>
            );
        case 'mail':
            return (
                <svg {...common}>
                    <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
                    <path d="M2.25 4.5L8 8.75l5.75-4.25" />
                </svg>
            );
        case 'clock':
            return (
                <svg {...common}>
                    <circle cx="8" cy="8" r="6.25" />
                    <path d="M8 4.5V8l2.5 1.75" />
                </svg>
            );
        case 'plus':
            return (
                <svg {...common}>
                    <path d="M8 3.25v9.5M3.25 8h9.5" />
                </svg>
            );
        case 'check':
            return (
                <svg {...common} strokeWidth={1.8}>
                    <path d="M3 8.5l3.2 3.2L13 5" />
                </svg>
            );
        case 'alert':
        default:
            return (
                <svg {...common}>
                    <circle cx="8" cy="8" r="6.25" />
                    <path d="M8 4.75v3.75M8 11.1v.15" />
                </svg>
            );
    }
}

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg className={cx('animate-spin', className)} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function ErrorLine({ id, children }: { id?: string; children: ReactNode }) {
    return (
        <div id={id} role="alert" className="flex items-start gap-2.5 rounded-xl bg-danger-soft px-3.5 py-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
            <span className="text-[13px] leading-relaxed text-danger">{children}</span>
        </div>
    );
}

type GateShellProps = {
    repoFullName?: string | null;
    /** Short state shown as a chip next to the repo name, e.g. "expired". */
    status?: string;
    statusTone?: GateTone;
    icon: GateIconName;
    tone?: GateTone;
    title: ReactNode;
    blurb?: ReactNode;
    children?: ReactNode;
    foot?: ReactNode;
};

export default function GateShell({
    repoFullName,
    status,
    statusTone = 'neutral',
    icon,
    tone = 'accent',
    title,
    blurb,
    children,
    foot,
}: GateShellProps) {
    return (
        <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-bg px-3 py-10 sm:px-4 sm:py-14">
            <div className="w-full max-w-[440px]">
                <div className="mb-3 flex justify-center">
                    <LogoPill />
                </div>

                <Tile as="div" bodyClassName="p-6 sm:p-8">
                    {repoFullName && (
                        <div className="mb-7 flex items-center justify-between gap-3 rounded-full bg-surface-2 py-1.5 pl-3.5 pr-1.5">
                            <div className="flex min-w-0 items-center gap-2">
                                <RepoGlyph className="h-3.5 w-3.5 shrink-0 text-ink-4" />
                                <span className="truncate text-[13px] font-medium text-ink-2" title={repoFullName}>
                                    {repoFullName}
                                </span>
                            </div>
                            {status && (
                                <Chip tone={chipTone[statusTone]} dot className="shrink-0">
                                    {status}
                                </Chip>
                            )}
                        </div>
                    )}

                    <div className={cx('mb-5 flex h-12 w-12 items-center justify-center rounded-full', circleTone[tone])}>
                        <GateIcon name={icon} className="h-5 w-5" />
                    </div>

                    <h1 className="mb-2 text-[22px] font-semibold leading-tight text-ink">{title}</h1>
                    {blurb && (
                        <p className={cx('text-[14.5px] leading-relaxed text-ink-3', children ? 'mb-6' : '')}>{blurb}</p>
                    )}

                    {children}
                </Tile>

                {foot && <p className="mt-4 px-4 text-center text-xs leading-[1.7] text-ink-4">{foot}</p>}
            </div>
        </main>
    );
}
