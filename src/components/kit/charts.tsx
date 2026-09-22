'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cx } from './primitives';

/*
 * Hand-rolled SVG charts (no chart library). Colours come from the CSS tokens.
 */

function useWidth<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        setWidth(el.getBoundingClientRect().width);
        return () => ro.disconnect();
    }, []);
    return [ref, width] as const;
}

function niceMax(n: number) {
    if (n <= 4) return 4;
    const pow = 10 ** Math.floor(Math.log10(n));
    const steps = [1, 2, 2.5, 5, 10];
    for (const s of steps) if (s * pow >= n) return s * pow;
    return 10 * pow;
}

/* ─── AreaChart — the hero chart on the orange tile ───────────────────────── */

export type SeriesPoint = { label: string; value: number; /** Longer label for the tooltip. */ detail?: string };

export function AreaChart({
    data,
    height = 220,
    formatValue = (v) => String(v),
    unit = '',
    className,
}: {
    data: SeriesPoint[];
    height?: number;
    formatValue?: (v: number) => string;
    unit?: string;
    className?: string;
}) {
    const [ref, width] = useWidth<HTMLDivElement>();
    const [hover, setHover] = useState<number | null>(null);
    const patternId = useId().replace(/:/g, '');

    const padL = 36;
    const padR = 8;
    const padT = 12;
    const padB = 26;
    const w = Math.max(width, 1);
    const innerW = Math.max(w - padL - padR, 1);
    const innerH = height - padT - padB;
    const max = niceMax(Math.max(0, ...data.map((d) => d.value)));

    const pts = useMemo(
        () =>
            data.map((d, i) => ({
                x: padL + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
                y: padT + innerH - (d.value / max) * innerH,
            })),
        [data, innerW, innerH, max],
    );

    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const area = pts.length ? `${line} L${pts[pts.length - 1].x.toFixed(1)},${padT + innerH} L${pts[0].x.toFixed(1)},${padT + innerH} Z` : '';

    const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 64))));
    const grid = [max, max / 2];

    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!data.length) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const i = Math.round(((x - padL) / innerW) * (data.length - 1));
        setHover(Math.min(data.length - 1, Math.max(0, i)));
    };

    const h = hover !== null ? pts[hover] : null;
    const bandW = data.length > 1 ? Math.max(8, innerW / (data.length - 1) / 2) : 12;

    return (
        <div ref={ref} className={cx('relative w-full select-none', className)} style={{ height }}>
            {width > 0 && (
                <svg
                    width={w}
                    height={height}
                    className="block touch-none"
                    onPointerMove={onMove}
                    onPointerLeave={() => setHover(null)}
                    role="img"
                    aria-label="Views over time"
                >
                    <defs>
                        <pattern id={patternId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                            <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,.28)" strokeWidth="1.2" />
                        </pattern>
                    </defs>

                    {grid.map((g) => {
                        const y = padT + innerH - (g / max) * innerH;
                        return (
                            <g key={g}>
                                <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="rgba(255,255,255,.18)" strokeDasharray="2 4" />
                                <text x={0} y={y + 4} fontSize="11" fill="rgba(255,255,255,.75)">
                                    {formatValue(g)}
                                </text>
                            </g>
                        );
                    })}
                    <line x1={padL} x2={w - padR} y1={padT + innerH} y2={padT + innerH} stroke="rgba(255,255,255,.25)" />

                    {h && <rect x={h.x - bandW / 2} y={padT} width={bandW} height={innerH} fill="rgba(255,255,255,.16)" rx="2" />}

                    <path d={area} fill={`url(#${patternId})`} />
                    <path d={line} fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

                    {data.map((d, i) =>
                        i % labelEvery === 0 || i === data.length - 1 ? (
                            <text
                                key={i}
                                x={pts[i].x}
                                y={height - 6}
                                fontSize="11"
                                textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
                                fill="rgba(255,255,255,.75)"
                            >
                                {d.label}
                            </text>
                        ) : null,
                    )}

                    {h && <circle cx={h.x} cy={h.y} r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="2" />}
                </svg>
            )}

            {h && hover !== null && (
                <div
                    className="pointer-events-none absolute z-10 min-w-[150px] rounded-2xl border border-white/10 bg-bg/95 p-3 text-xs text-ink shadow-[0_12px_32px_-12px_rgba(0,0,0,.6)]"
                    style={{
                        left: Math.min(Math.max(h.x + 12, 0), Math.max(w - 170, 0)),
                        top: Math.max(h.y - 70, 0),
                    }}
                >
                    <div className="text-ink-3">{data[hover].detail ?? data[hover].label}</div>
                    <div className="mt-1 text-base font-semibold tabular-nums">
                        {formatValue(data[hover].value)}
                        {unit && <span className="ml-1 text-xs font-normal text-ink-3">{unit}</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Sparkline — tiny trend in the repo strip ────────────────────────────── */

export function Sparkline({
    values,
    tone = 'up',
    width = 72,
    height = 28,
}: {
    values: number[];
    tone?: 'up' | 'danger' | 'accent' | 'muted';
    width?: number;
    height?: number;
}) {
    const colour = {
        up: 'var(--color-up)',
        danger: 'var(--color-danger)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-ink-4)',
    }[tone];
    if (values.length < 2) values = [0, ...values, 0].slice(-2);
    const max = Math.max(1, ...values);
    const pts = values.map((v, i) => ({
        x: 3 + (i / (values.length - 1)) * (width - 6),
        y: 3 + (height - 6) - (v / max) * (height - 6),
    }));
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const last = pts[pts.length - 1];
    return (
        <svg width={width} height={height} aria-hidden="true" className="shrink-0">
            <path d={d} fill="none" stroke={colour} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
            <circle cx={last.x} cy={last.y} r="3" fill={colour} />
            <circle cx={last.x} cy={last.y} r="6" fill={colour} opacity="0.2" />
        </svg>
    );
}

/* ─── BlockBars — allocation-style columns ────────────────────────────────── */

export type BlockBar = { label: string; value: number; tone: 'accent' | 'sun' | 'ink' | 'hatch' };

export function BlockBars({ bars, height = 150, className }: { bars: BlockBar[]; height?: number; className?: string }) {
    const total = bars.reduce((s, b) => s + b.value, 0);
    const fill = { accent: 'bg-accent text-white', sun: 'bg-sun text-bg', ink: 'bg-ink text-bg', hatch: 'hatch bg-surface-2 text-ink-2' };
    return (
        <div className={cx('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))` }}>
            {bars.map((b) => {
                const pct = total ? Math.round((b.value / total) * 100) : 0;
                const h = total ? Math.max(pct, b.value ? 18 : 0) : 0;
                return (
                    <div key={b.label} className="flex min-w-0 flex-col items-center gap-2">
                        <div className="hatch relative w-full overflow-hidden rounded-xl bg-surface-2" style={{ height }}>
                            {b.value > 0 && (
                                <div
                                    className={cx('absolute inset-x-0 bottom-0 rounded-xl p-2 text-[13px] font-semibold tabular-nums', fill[b.tone])}
                                    style={{ height: `${h}%` }}
                                >
                                    {b.value}
                                </div>
                            )}
                        </div>
                        <span className="w-full truncate text-center text-xs text-ink-3">{b.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Gauge — semicircle with a green arc and a knob ──────────────────────── */

export function Gauge({ value, max, caption, className }: { value: number; max: number; caption?: React.ReactNode; className?: string }) {
    const size = 220;
    const stroke = 26;
    const r = (size - stroke) / 2;
    const cx0 = size / 2;
    const cy0 = size / 2;
    const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
    const angle = Math.PI * (1 - ratio);
    const end = { x: cx0 + r * Math.cos(angle), y: cy0 - r * Math.sin(angle) };
    const arc = (to: { x: number; y: number }) => `M${cx0 - r},${cy0} A${r},${r} 0 0 1 ${to.x.toFixed(2)},${to.y.toFixed(2)}`;
    const trackId = useId().replace(/:/g, '');

    return (
        <div className={cx('flex flex-col items-center', className)}>
            <svg viewBox={`0 0 ${size} ${size / 2 + stroke / 2 + 4}`} className="w-full max-w-[260px]" aria-hidden="true">
                <defs>
                    <pattern id={trackId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-line-strong)" strokeWidth="1.4" />
                    </pattern>
                </defs>
                <path d={arc({ x: cx0 + r, y: cy0 })} fill="none" stroke="var(--color-surface-2)" strokeWidth={stroke} strokeLinecap="round" />
                <path d={arc({ x: cx0 + r, y: cy0 })} fill="none" stroke={`url(#${trackId})`} strokeWidth={stroke} strokeLinecap="round" />
                {ratio > 0 && <path d={arc(end)} fill="none" stroke="var(--color-up)" strokeWidth={stroke} strokeLinecap="round" />}
                <circle cx={end.x} cy={end.y} r={stroke / 2 - 2} fill="#fff" stroke="var(--color-up)" strokeWidth="4" />
            </svg>
            {caption && <div className="-mt-2 text-center text-[13px] text-ink-3">{caption}</div>}
        </div>
    );
}
