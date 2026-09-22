import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginButton from '@/components/LoginButton';
import Container from '@/components/landing/Container';
import { Tile } from '@/components/kit';
import Pricing from '@/components/landing/Pricing';

export const metadata: Metadata = {
  title: 'Pricing — GitPeek',
  description:
    'GitPeek charges per link, not per seat. Your first link is free, then $1 per credit. One credit makes one link, and credits don’t expire.',
};

const facts = [
  { q: 'One credit, one link', a: 'Creating a share link spends a credit. Opening it, however many times, doesn’t.' },
  { q: 'Deleting doesn’t refund', a: 'If you delete a link early, the credit is still spent. Pick a short expiry instead.' },
  { q: 'Access requests are free', a: 'When you approve a reader’s request, GitPeek makes a new 7-day link without using a credit.' },
  { q: 'Credits don’t expire', a: 'Bought credits stay on your account until you use them. There is no subscription and no monthly reset.' },
  {
    q: 'Repositories aren’t counted',
    a: 'Install the GitHub App on as many repositories as you like. You pay for links, not for repos or people.',
  },
  {
    q: 'Bulk discount',
    a: 'Orders of 10 or more credits get a discount at checkout. [Confirm the Stripe coupon amount, e.g. 10% off.]',
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-bg">
        <Container className="grid grid-cols-1 items-end gap-3 pt-8 pb-6 sm:pt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)] md:gap-10 md:pb-8">
          <h1 className="px-1 text-[40px] leading-[1.1] font-semibold text-ink sm:text-[52px]">Pricing</h1>
          <p className="px-1 text-[15.5px] leading-[1.65] text-ink-3 md:pb-1.5">
            You pay per link, not per seat or per month. One credit makes one link. Credits don&rsquo;t expire.
          </p>
        </Container>

        <Container>
          <Pricing />
        </Container>

        <Container className="mt-3 md:mt-4">
          <Tile title="How credits work">
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((f) => (
                <div key={f.q} className="rounded-2xl bg-surface-2 p-4 sm:p-5">
                  <dt className="text-[14.5px] font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-1.5 text-[14px] leading-[1.6] text-ink-2">{f.a}</dd>
                </div>
              ))}
            </dl>
          </Tile>
        </Container>

        <Container className="mt-3 md:mt-4">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[22px] bg-surface-2 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-[22px] leading-[1.25] font-semibold text-ink sm:text-[26px]">Try it free</h2>
              <p className="mt-1.5 text-[15px] text-ink-3">Your first link is free. No card needed.</p>
            </div>
            <LoginButton variant="primary" callbackUrl="/dashboard" />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
