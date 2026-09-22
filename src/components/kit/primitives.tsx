import React from 'react';

/*
 * Building blocks for the app's design language: soft-radius tiles on a near-black
 * canvas, pill controls, round icon buttons, coloured stat ticks and delta pills.
 * Tokens live in src/app/globals.css.
 */

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

const buttonBase =
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-ink text-bg hover:bg-white',
    secondary: 'border border-line-strong bg-transparent text-ink hover:bg-hover',
    ghost: 'text-ink-2 hover:bg-hover hover:text-ink',
    danger: 'border border-danger/40 text-danger hover:bg-danger-soft',
    accent: 'bg-accent text-white hover:bg-accent/90',
};

const buttonSizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3.5 text-[13px]',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-[15px]',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
    return cx(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: ButtonProps) {
    return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}

/** 40px round outlined button, like the search / bell / refresh buttons in the reference. */
const iconButtonBase =
    'relative inline-flex shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:opacity-50';

export const iconButtonClass = cx(iconButtonBase, 'h-10 w-10');

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    /** Shows a small orange dot in the corner (e.g. unread requests). */
    dot?: boolean;
    size?: 'sm' | 'md';
};

export function IconButton({ label, dot, size = 'md', className, children, type = 'button', ...rest }: IconButtonProps) {
    return (
        <button
            type={type}
            aria-label={label}
            title={label}
            className={cx(iconButtonBase, size === 'sm' ? 'h-8 w-8' : 'h-10 w-10', className)}
            {...rest}
        >
            {children}
            {dot && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />}
        </button>
    );
}

/* ─── Tiles ───────────────────────────────────────────────────────────────── */

export type TileTone = 'default' | 'accent' | 'glass' | 'inset';

const tileTones: Record<TileTone, string> = {
    default: 'border border-line bg-surface tile-sheen',
    accent: 'bg-accent text-white',
    glass: 'border border-white/10 bg-glass tile-sheen',
    inset: 'bg-surface-2',
};

type TileProps = {
    tone?: TileTone;
    title?: React.ReactNode;
    /** Right side of the header row: filters, round buttons, pills. */
    actions?: React.ReactNode;
    className?: string;
    bodyClassName?: string;
    children?: React.ReactNode;
    as?: 'section' | 'div' | 'article';
    id?: string;
};

export function Tile({ tone = 'default', title, actions, className, bodyClassName, children, as = 'section', id }: TileProps) {
    const Tag = as;
    return (
        <Tag id={id} className={cx('rounded-[22px]', tileTones[tone], className)}>
            {(title || actions) && (
                <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 px-5 pt-4 sm:px-6">
                    {title ? (
                        <h2 className={cx('text-[15px] font-semibold', tone === 'accent' ? 'text-white' : 'text-ink')}>{title}</h2>
                    ) : (
                        <span />
                    )}
                    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className={cx(title || actions ? 'px-5 pb-5 pt-2 sm:px-6 sm:pb-6' : 'p-5 sm:p-6', bodyClassName)}>{children}</div>
        </Tag>
    );
}

/* ─── Stats ───────────────────────────────────────────────────────────────── */

export type Tick = 'up' | 'sun' | 'accent' | 'ink' | 'danger';

const tickColours: Record<Tick, string> = {
    up: 'bg-up',
    sun: 'bg-sun',
    accent: 'bg-accent',
    ink: 'bg-ink',
    danger: 'bg-danger',
};

/** Label with a coloured tick, a big number and an optional unit / delta. */
export function StatCell({
    label,
    value,
    unit,
    tick = 'ink',
    delta,
    className,
    onClick,
}: {
    label: string;
    value: React.ReactNode;
    unit?: string;
    tick?: Tick;
    delta?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const body = (
        <>
            <div className="flex items-center gap-2 text-[13px] text-ink-3">
                <span className={cx('h-3 w-[3px] rounded-full', tickColours[tick])} />
                {label}
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[26px] font-semibold leading-none tabular-nums text-ink">{value}</span>
                {unit && <span className="text-[13px] text-ink-3">{unit}</span>}
                {delta}
            </div>
        </>
    );
    const cls = cx('rounded-2xl bg-surface-2 p-4 text-left', onClick && 'transition-colors hover:bg-hover', className);
    return onClick ? (
        <button type="button" onClick={onClick} className={cls}>
            {body}
        </button>
    ) : (
        <div className={cls}>{body}</div>
    );
}

/** Green ↗ / red ↘ / neutral pill for a percentage change. `onAccent` = white pill for use on the orange tile. */
export function DeltaPill({ value, onAccent = false, className }: { value: number | null; onAccent?: boolean; className?: string }) {
    if (value === null || !Number.isFinite(value)) {
        return (
            <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', onAccent ? 'bg-white/20 text-white' : 'bg-hover text-ink-3', className)}>
                new
            </span>
        );
    }
    const up = value >= 0;
    const tone = onAccent
        ? 'bg-white text-bg'
        : up
          ? 'bg-up-soft text-up'
          : 'bg-danger-soft text-danger';
    return (
        <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', tone, className)}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {up ? <path d="M3 9l6-6M4 3h5v5" /> : <path d="M3 3l6 6M9 4v5H4" />}
            </svg>
            {Math.abs(value).toFixed(value !== 0 && Math.abs(value) < 10 ? 1 : 0)}%
        </span>
    );
}

/* ─── Pills ───────────────────────────────────────────────────────────────── */

export type PillOption<T extends string> = { value: T; label: React.ReactNode; badge?: number };

/** Segmented pill control — white active pill inside a dark rounded track. Used for nav and filters. */
export function PillTabs<T extends string>({
    options,
    value,
    onChange,
    size = 'md',
    className,
    ariaLabel,
    tone = 'default',
}: {
    options: PillOption<T>[];
    value: T;
    onChange: (v: T) => void;
    size?: 'sm' | 'md';
    className?: string;
    ariaLabel?: string;
    /** `onAccent` for use on the orange tile (transparent track, white text). */
    tone?: 'default' | 'onAccent';
}) {
    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={cx(
                'no-scrollbar inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-1',
                tone === 'default' ? 'border border-line bg-surface' : 'bg-transparent',
                className,
            )}
        >
            {options.map((o) => {
                const on = o.value === value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => onChange(o.value)}
                        className={cx(
                            'inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium transition-colors',
                            size === 'sm' ? 'h-7 px-3 text-xs' : 'h-9 px-4 text-[13.5px]',
                            tone === 'default'
                                ? on
                                    ? 'bg-ink text-bg'
                                    : 'text-ink-2 hover:text-ink'
                                : on
                                  ? 'bg-white/20 text-white'
                                  : 'text-white/70 hover:text-white',
                        )}
                    >
                        {o.label}
                        {!!o.badge && (
                            <span className={cx('min-w-[18px] rounded-full px-1.5 text-[11px] leading-[18px]', on ? 'bg-accent text-white' : 'bg-accent text-white')}>
                                {o.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export type ChipTone = 'default' | 'up' | 'sun' | 'accent' | 'danger';

const chipTones: Record<ChipTone, string> = {
    default: 'border border-line-strong text-ink-2',
    up: 'bg-up-soft text-up',
    sun: 'bg-sun-soft text-sun',
    accent: 'bg-accent-soft text-accent',
    danger: 'bg-danger-soft text-danger',
};

export function Chip({ tone = 'default', dot, className, children, title }: { tone?: ChipTone; dot?: boolean; className?: string; children: React.ReactNode; title?: string }) {
    return (
        <span title={title} className={cx('inline-flex max-w-full items-center gap-1.5 truncate rounded-full px-2.5 py-1 text-xs font-medium', chipTones[tone], className)}>
            {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
            {children}
        </span>
    );
}

/** Shared input look: filled, rounded, orange focus ring. */
export const inputClass =
    'w-full rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-ink-4 outline-none transition-colors focus:border-accent';
