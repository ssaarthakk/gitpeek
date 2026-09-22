import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginButton from '@/components/LoginButton';
import { CheckIcon, CrossIcon } from '@/components/site/icons';
import Container, { Section } from '@/components/landing/Container';
import ViewerPreview from '@/components/landing/ViewerPreview';
import RequestsPreview from '@/components/landing/RequestsPreview';
import Pricing from '@/components/landing/Pricing';
import Faq, { type FaqItem } from '@/components/landing/Faq';
import { Chip, Sparkline, StatCell, Tile, buttonClass } from '@/components/kit';

const body = 'text-[15px] leading-[1.7] text-ink-2';
const code = 'rounded-md bg-hover px-1.5 py-0.5 text-[13px] text-ink';
const tile = 'tile-sheen rounded-[22px] border border-line bg-surface';

const steps = [
  {
    title: 'Install the GitHub App',
    text: 'Sign in with GitHub, then install the GitPeek app on the repositories you want to share. It only sees the ones you pick.',
  },
  {
    title: 'Create a link',
    text: 'Pick the branch and how long the link lasts. Add a password, make it one-time, or ask readers for their email.',
  },
  {
    title: 'Send it, delete it',
    text: 'Paste the link wherever you talk to them. Your dashboard shows how often it has been opened, and you can delete it at any time.',
  },
];

const cans = [
  'Browse every file and folder on the branch you shared',
  'Read code with syntax highlighting, and Markdown rendered',
  'Download the branch as a ZIP, if you allow it',
  'Ask for a new link after this one expires',
];

const cants = [
  'Clone, fork, or push',
  'See other repositories in your account',
  'Copy text or download files, if you turn that off',
  'Open the link after it expires or you delete it',
];

const options = [
  { name: 'Branch', desc: 'Pick which branch the link shows. The reader browses that branch only.', value: 'one branch' },
  { name: 'Expiry', desc: 'An hour for a live interview, a week for a review, or no expiry at all.', value: '1h, 24h, 7d, never' },
  { name: 'Password', desc: 'Readers enter a password before the code loads. Send it separately from the link.', value: 'optional' },
  { name: 'One-time', desc: 'The link stops working after it has been opened once.', value: 'optional' },
  {
    name: 'Copy and download',
    desc: 'Lets readers select and copy text and download the branch as a ZIP. Turn it off and they can only read.',
    value: 'on or off',
  },
  {
    name: 'Ask for email',
    desc: 'Readers type their email address before the code loads. It is saved with each view so you can see who opened the link. The address is not verified.',
    value: 'optional',
  },
];

const faq: FaqItem[] = [
  {
    q: 'What access does GitPeek need to my GitHub account?',
    a: (
      <>
        Two things. Signing in uses GitHub OAuth with the <code className={code}>repo</code>,{' '}
        <code className={code}>read:user</code> and <code className={code}>user:email</code>{' '}
        scopes. GitHub&rsquo;s <code className={code}>repo</code> scope covers your private repositories and is
        broader than read-only. Reading code for a link goes through the GitPeek GitHub App, which you install only on the
        repositories you choose. [Confirm the App&rsquo;s exact permissions, for example Contents: read-only and Metadata:
        read-only, before launch.]
      </>
    ),
  },
  {
    q: 'Can the reader clone or download the repository?',
    a: 'They can’t clone, fork or push. There is no git remote behind the link, only the viewer. Downloading is up to you: with copy and download on, they can download the branch as a ZIP. Turn it off and text selection and the download button go away. Anyone can still take screenshots, so don’t share anything you couldn’t live with being copied by hand.',
  },
  {
    q: 'Do you store my code?',
    a: 'No. Files are fetched from GitHub when the reader opens them and are not saved in GitPeek’s database. GitPeek stores the repository name, branch and settings for each link, and a record of each view: the time, browser, IP address, and email address if you asked for one.',
  },
  {
    q: 'What happens when I delete a link?',
    a: 'It stops working right away. Anyone who opens it after that sees “Link not found”. Deleting a link does not refund the credit.',
  },
  {
    q: 'What happens when a link expires?',
    a: 'The reader sees a form to ask for access, with their email and an optional message. The request appears in your dashboard. If you approve it, GitPeek makes a new link to the same repository and branch that lasts 7 days, without using a credit. You copy it and send it to them.',
  },
  {
    q: 'Does the reader need a GitHub account?',
    a: 'No. They only need the link, plus the password or their email address if you set either.',
  },
  {
    q: 'Can I use it for a public repository?',
    a: 'You can, but you probably don’t need to. Public repositories are already readable on GitHub.',
  },
];

/* Small illustrations under each "How it works" step. Sample data, like the viewer preview. */
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        {[
          { name: 'acme/payments-api', on: true },
          { name: 'acme/infra-terraform', on: true },
          { name: 'acme/website', on: false },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3 py-2">
            <span className={`truncate text-[13px] ${r.on ? 'text-ink' : 'text-ink-4'}`}>{r.name}</span>
            <span
              className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                r.on ? 'bg-up-soft text-up' : 'hatch border border-line-strong'
              }`}
            >
              {r.on && <CheckIcon className="h-3 w-3" />}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex w-full items-center gap-0.5 rounded-full border border-line bg-bg p-1">
          {['1h', '24h', '7d', 'never'].map((v) => (
            <span
              key={v}
              className={`inline-flex h-7 flex-1 items-center justify-center rounded-full text-xs font-medium ${
                v === '7d' ? 'bg-ink text-bg' : 'text-ink-3'
              }`}
            >
              {v}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip tone="sun">Password</Chip>
          <Chip>One-time</Chip>
          <Chip>Ask for email</Chip>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-[13px] text-ink">acme/payments-api</div>
        <div className="text-xs text-ink-3">Views</div>
      </div>
      <Sparkline values={[0, 1, 1, 3, 2, 4, 6]} width={64} />
      <span className="inline-flex h-7 shrink-0 items-center rounded-full border border-danger/40 px-3 text-xs font-semibold text-danger">
        Delete
      </span>
    </div>
  );
}

function ListRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-surface-2 px-3.5 py-3 text-[14.5px] text-ink-2">
      <span
        className={`mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          ok ? 'bg-up-soft text-up' : 'bg-danger-soft text-danger'
        }`}
      >
        {ok ? <CheckIcon className="h-3 w-3" /> : <CrossIcon className="h-3 w-3" />}
      </span>
      {children}
    </li>
  );
}

export default async function HomePage() {
  const session = await auth();

  // Signed-in users go straight to their dashboard.
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-bg">
        {/* Hero: copy on the left, the reader's view on the orange tile */}
        <section className="pt-3 sm:pt-6">
          <Container>
            <div className="tile-sheen grid grid-cols-1 gap-3 rounded-[22px] border border-line bg-surface p-2.5 sm:p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-4">
              <div className="flex flex-col justify-center px-2.5 pt-4 pb-3 sm:px-4 sm:pt-6 lg:py-8">
                <h1 className="text-[38px] leading-[1.08] font-semibold text-ink sm:text-[48px] lg:text-[52px]">
                  Share a private GitHub repo as a read-only link
                </h1>
                <p className="mt-5 text-[16px] leading-[1.65] text-ink-2 sm:text-[17px]">
                  Pick a repo and a branch, choose when the link expires, and send it. The person you send it to can browse
                  the code in their browser. They can&rsquo;t clone it, push to it, or see anything else in your account.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <LoginButton variant="primary" callbackUrl="/dashboard" />
                  <Link href="/pricing" className={buttonClass('secondary', 'lg', 'hover:no-underline')}>
                    See pricing
                  </Link>
                </div>
                <p className="mt-4 text-[13.5px] text-ink-3">Your first link is free. No card needed.</p>
              </div>

              <div className="min-w-0 rounded-[18px] bg-accent p-2 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1.5 pb-3 sm:pb-4">
                  <span className="text-[14px] font-semibold text-white">What the reader sees</span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white">No GitHub account needed</span>
                </div>
                <ViewerPreview />
              </div>
            </div>

            {/* Facts, all taken from the pricing and access-request copy below */}
            <div className={`${tile} mt-3 grid grid-cols-1 gap-2 p-2.5 sm:mt-4 sm:grid-cols-3 sm:p-3`}>
              <StatCell tick="up" label="On sign-up" value="1" unit="free link" />
              <StatCell tick="accent" label="After that" value="$1" unit="per link" />
              <StatCell tick="sun" label="Approved access requests" value="7" unit="day link, no credit" />
            </div>
          </Container>
        </section>

        {/* How it works */}
        <Section id="how-it-works" title="How it works">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {steps.map((s, i) => (
              <Tile key={s.title} as="article" className="flex flex-col" bodyClassName="flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold tabular-nums text-ink">
                    {i + 1}
                  </span>
                  <h3 className="text-[16px] font-semibold text-ink">{s.title}</h3>
                </div>
                <p className={`${body} mt-4 mb-6`}>{s.text}</p>
                <div className="mt-auto">
                  <StepVisual index={i} />
                </div>
              </Tile>
            ))}
          </div>
        </Section>

        {/* Can / can't */}
        <Section title="What the reader gets" intro="The person who opens your link does not need a GitHub account.">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <Tile title="They can">
              <ul className="flex flex-col gap-1.5">
                {cans.map((t) => (
                  <ListRow key={t} ok>
                    {t}
                  </ListRow>
                ))}
              </ul>
            </Tile>
            <Tile title={<>They can&rsquo;t</>}>
              <ul className="flex flex-col gap-1.5">
                {cants.map((t) => (
                  <ListRow key={t} ok={false}>
                    {t}
                  </ListRow>
                ))}
              </ul>
            </Tile>
          </div>
        </Section>

        {/* Link options */}
        <Section
          title="Link options"
          intro={
            <>
              Each link has its own settings, so an interview take-home and a due-diligence review don&rsquo;t have to share
              them.
            </>
          }
        >
          <div className={`${tile} p-2 sm:p-3`}>
            {options.map((o) => (
              <div
                key={o.name}
                className="grid grid-cols-1 gap-2 rounded-2xl px-3 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <div className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                  <span className="h-3 w-[3px] shrink-0 rounded-full bg-accent" />
                  {o.name}
                </div>
                <p className="text-[14.5px] leading-[1.6] text-ink-2">{o.desc}</p>
                <div className="sm:text-right">
                  <span className="inline-flex rounded-full border border-line-strong px-3 py-1 text-xs font-medium whitespace-nowrap text-ink-2">
                    {o.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Access requests */}
        <Section>
          <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 md:gap-4">
            <div className="flex flex-col justify-center rounded-[22px] bg-surface-2 p-5 sm:p-8">
              <h2 className="text-[26px] leading-[1.2] font-semibold text-ink sm:text-[32px]">
                When a link runs out, the reader can ask for a new one
              </h2>
              <p className={`${body} mt-4 max-w-[46ch]`}>
                Instead of a dead page, they see a short form for their email and an optional message. The request shows up
                in your dashboard. Approving it makes a new link to the same repo and branch that lasts 7 days and
                doesn&rsquo;t use a credit. You copy it and send it to them.
              </p>
            </div>
            <RequestsPreview />
          </div>
        </Section>

        {/* Pricing */}
        <Section
          title="Pricing"
          intro={
            <>
              You pay per link, not per seat. One credit makes one link. Credits don&rsquo;t expire and there&rsquo;s no
              subscription.
            </>
          }
        >
          <Pricing />
          <div className="mt-3">
            <Link href="/pricing" className={buttonClass('ghost', 'sm', 'hover:no-underline')}>
              How credits work &rarr;
            </Link>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" title="Questions">
          <div className={`${tile} p-2 sm:p-3`}>
            <Faq items={faq} />
          </div>
        </Section>

        {/* Who built this */}
        <Section>
          <Tile tone="inset">
            <p className={`${body} max-w-[70ch]`}>
              GitPeek is built by [YOUR NAME]. [Why you made it, in one or two sentences.] If something breaks or you need
              a feature, contact [YOUR CONTACT].
            </p>
          </Tile>
        </Section>
      </main>
      <Footer />
    </>
  );
}
