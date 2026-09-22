'use client';

import { useState } from 'react';
import { cx } from '@/components/kit';

export type FaqItem = { q: string; a: React.ReactNode };

/** Accordion rows for use inside a Tile. The open row becomes a raised cell. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={item.q} className={cx('rounded-2xl transition-colors', isOpen ? 'bg-surface-2' : 'hover:bg-surface-2/60')}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
            >
              <span className="text-[15px] font-medium text-ink">{item.q}</span>
              <span
                aria-hidden="true"
                className={cx(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                  isOpen ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink-2',
                )}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M2 6h8" />
                  {!isOpen && <path d="M6 2v8" />}
                </svg>
              </span>
            </button>
            {isOpen && (
              <div id={panelId} className="max-w-[70ch] px-4 pb-4 text-[14.5px] leading-[1.7] text-ink-2">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
