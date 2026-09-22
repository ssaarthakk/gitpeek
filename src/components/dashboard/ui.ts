// Shared class strings for the dashboard and billing screens. Buttons, tiles and pills come
// from '@/components/kit'; this file only holds what the kit doesn't: HeroUI overlay styling.

/** Small muted label above a field or value. Sentence case, no letter-spacing. */
export const label = 'text-[13px] text-ink-3';

/** HeroUI Modal classNames: 22px tile radius, subtle border, no glow. */
export const modalClassNames = {
    backdrop: 'bg-black/70',
    base: 'rounded-[22px] border border-line bg-surface text-ink shadow-[0_32px_80px_-24px_rgba(0,0,0,.7)]',
    header: 'px-6 pb-2 pt-6',
    body: 'px-6 py-3 gap-4',
    footer: 'px-6 pb-6 pt-3 gap-2.5',
    closeButton: 'top-4 right-4 h-8 w-8 rounded-full text-ink-3 hover:bg-hover active:bg-hover',
};

/** HeroUI Drawer classNames for the right-hand "New link" sheet. */
export const sheetClassNames = {
    backdrop: 'bg-black/70',
    base: 'w-full max-w-[440px] rounded-none border-l border-line bg-surface text-ink sm:m-3 sm:rounded-[22px] sm:border',
    header: 'px-6 pb-2 pt-6',
    body: 'custom-scrollbar px-6 py-3',
    footer: 'px-6 pb-6 pt-3',
    closeButton: 'top-5 right-5 h-9 w-9 rounded-full border border-line-strong text-ink-2 hover:bg-hover active:bg-hover',
};
