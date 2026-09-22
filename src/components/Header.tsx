'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/site/Logo';
import LoginButton from '@/components/LoginButton';
import { cx } from '@/components/kit';

const links = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

function NavPills({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className={cx('no-scrollbar items-center gap-0.5 overflow-x-auto rounded-full border border-line bg-surface p-1', className)}
    >
      {links.map((l) => {
        const active = !l.href.includes('#') && pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13.5px] font-medium transition-colors hover:no-underline',
              active ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink',
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-12 shrink-0 items-center rounded-full border border-line bg-surface px-4">
              <Logo />
            </div>
            <NavPills className="hidden md:inline-flex" />
          </div>
          <LoginButton variant="nav" />
        </div>
      </header>
      {/* Phones: the nav pills get their own row under the bar, so the sticky part stays short. */}
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-1 sm:px-6 md:hidden">
        <NavPills className="flex w-full justify-between" />
      </div>
    </>
  );
}
