import Link from 'next/link';
import Logo from '@/components/site/Logo';

const groups = [
  {
    title: 'Product',
    links: [
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
  {
    title: 'Contact',
    links: [{ href: 'https://x.com/ssaarthakk', label: 'X / Twitter', external: true }],
  },
];

const pill =
  'inline-flex h-8 items-center rounded-full border border-line-strong px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink hover:no-underline';

export default function Footer() {
  return (
    <footer className="mt-auto pt-16 pb-6 sm:pt-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="tile-sheen grid grid-cols-1 gap-8 rounded-[22px] border border-line bg-surface p-5 sm:p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] md:gap-10">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-[30ch] text-[13.5px] leading-relaxed text-ink-3">Read-only links to private GitHub repositories.</p>
            <p className="mt-auto text-[12.5px] text-ink-4">© {new Date().getFullYear()} GitPeek</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title} className="flex flex-col gap-2.5">
                <div className="text-[13px] text-ink-3">{g.title}</div>
                <div className="flex flex-wrap gap-2">
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={pill}
                      {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
