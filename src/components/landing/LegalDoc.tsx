import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Container from '@/components/landing/Container';
import { cx } from '@/components/kit';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

type Props = {
  doc: 'privacy' | 'terms';
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

const docs = [
  { key: 'privacy', label: 'Privacy', href: '/privacy' },
  { key: 'terms', label: 'Terms', href: '/terms' },
] as const;

function DocSwitch({ doc }: { doc: Props['doc'] }) {
  return (
    <nav aria-label="Legal documents" className="flex w-full gap-0.5 rounded-full border border-line bg-surface p-1">
      {docs.map((d) => (
        <Link
          key={d.key}
          href={d.href}
          aria-current={d.key === doc ? 'page' : undefined}
          className={cx(
            'inline-flex h-9 flex-1 items-center justify-center rounded-full text-[13.5px] font-medium hover:no-underline',
            d.key === doc ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink',
          )}
        >
          {d.label}
        </Link>
      ))}
    </nav>
  );
}

/** Shared layout for the privacy and terms pages: a side column with the switch and contents, and the prose in a tile. */
export default function LegalDoc({ doc, title, updated, intro, sections }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-bg">
        <Container className="grid grid-cols-1 items-start gap-3 pt-6 sm:pt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-4">
          <aside className="flex flex-col gap-3 lg:sticky lg:top-24">
            <DocSwitch doc={doc} />

            <nav aria-label="On this page" className="tile-sheen hidden rounded-[22px] border border-line bg-surface p-3 lg:block">
              <div className="px-3 pt-2 pb-2 text-[13px] text-ink-3">On this page</div>
              <ul className="flex flex-col">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-baseline gap-3 rounded-xl px-3 py-2 text-[13.5px] text-ink-2 hover:bg-hover hover:text-ink hover:no-underline"
                    >
                      <span className="w-4 shrink-0 text-xs tabular-nums text-ink-4">{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden rounded-[22px] bg-surface-2 px-5 py-4 lg:block">
              <div className="flex items-center gap-2 text-[13px] text-ink-3">
                <span className="h-3 w-[3px] rounded-full bg-sun" />
                Last updated
              </div>
              <div className="mt-1.5 text-[15px] font-semibold tabular-nums text-ink">{updated}</div>
            </div>
          </aside>

          <article className="tile-sheen min-w-0 rounded-[22px] border border-line bg-surface p-5 sm:p-8 lg:p-10">
            <div className="max-w-[680px]">
              <h1 className="text-[32px] leading-[1.15] font-semibold text-ink sm:text-[40px]">{title}</h1>
              <p className="mt-2 text-[13px] text-ink-3 lg:hidden">Last updated {updated}</p>
              <div className="mt-5 pb-8 text-[16.5px] leading-[1.65] text-ink-2">{intro}</div>

              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-line py-7">
                  <h2 className="mb-3 flex items-baseline gap-3 text-[19px] leading-[1.3] font-semibold text-ink">
                    <span className="text-[13px] tabular-nums text-ink-4">{i + 1}</span>
                    {s.title}
                  </h2>
                  <div className="flex flex-col gap-3.5 text-[15.5px] leading-[1.72] text-ink-2">{s.body}</div>
                </section>
              ))}
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
