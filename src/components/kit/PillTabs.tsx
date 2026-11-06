'use client';
import { useId } from 'react';
import { motion } from 'motion/react';
import { cx } from './primitives';

export type PillOption<T extends string> = { value: T; label: React.ReactNode; badge?: number };

/** Segmented pill control: the active pill slides between options. Used for nav and filters. */
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
    const indicatorId = useId();
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
                            'relative inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium transition-colors duration-200 active:scale-[0.97]',
                            size === 'sm' ? 'h-7 px-3 text-xs' : 'h-9 px-4 text-[13.5px]',
                            tone === 'default'
                                ? on
                                    ? 'text-bg'
                                    : 'text-ink-2 hover:text-ink'
                                : on
                                  ? 'text-white'
                                  : 'text-white/70 hover:text-white',
                        )}
                    >
                        {on && (
                            <motion.span
                                layoutId={indicatorId}
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                className={cx('absolute inset-0 rounded-full', tone === 'default' ? 'bg-ink' : 'bg-white/20')}
                            />
                        )}
                        <span className="relative">{o.label}</span>
                        {!!o.badge && (
                            <span className="relative min-w-[18px] rounded-full bg-accent px-1.5 text-[11px] leading-[18px] text-white">
                                {o.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
