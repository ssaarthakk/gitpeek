'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckIcon } from '@/components/site/icons';
import { buttonClass, cx } from '@/components/kit';

/*
 * Pricing facts, from the code:
 * - prisma/schema.prisma: User.credits defaults to 1 (one free link on sign-up).
 * - src/app/api/share/route.ts: creating a link spends one credit.
 * - src/app/api/checkout/route.ts: Stripe checkout, any quantity of one price;
 *   a coupon is applied to orders of 10 or more.
 */
export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startFreeLoading, setStartFreeLoading] = useState(false);
  const [buyCreditsLoading, setBuyCreditsLoading] = useState(false);

  const handleStartFree = async () => {
    setStartFreeLoading(true);
    try {
      if (session?.user) {
        router.push('/dashboard');
      } else {
        await signIn('github', { callbackUrl: '/dashboard' });
      }
    } catch (error) {
      console.error('Error in handleStartFree:', error);
      setStartFreeLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    setBuyCreditsLoading(true);
    try {
      if (session?.user) {
        router.push('/dashboard/billing');
      } else {
        await signIn('github', { callbackUrl: '/dashboard/billing' });
      }
    } catch (error) {
      console.error('Error in handleBuyCredits:', error);
      setBuyCreditsLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      unit: '1 credit on sign-up',
      desc: 'Enough to make your first link and see what the reader sees. No card needed.',
      items: ['Every link option', 'Access requests after a link expires', 'View count for each link'],
      cta: session?.user ? 'Go to dashboard' : 'Start free',
      loadingLabel: session?.user ? 'Opening…' : 'Redirecting to GitHub…',
      onClick: handleStartFree,
      loading: startFreeLoading,
      accent: false,
    },
    {
      name: 'Pay as you go',
      price: '$1',
      unit: 'per credit',
      desc: 'Buy as many credits as you need, when you need them. Orders of 10 or more get a bulk discount.',
      items: ['One credit makes one link', 'Credits don’t expire', 'No subscription. Card payment through Stripe'],
      cta: session?.user ? 'Go to billing' : 'Buy credits',
      loadingLabel: session?.user ? 'Opening…' : 'Redirecting to GitHub…',
      onClick: handleBuyCredits,
      loading: buyCreditsLoading,
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {plans.map((p) => (
        <div
          key={p.name}
          className={cx(
            'flex flex-col rounded-[22px] p-5 sm:p-6',
            p.accent ? 'bg-accent text-white' : 'tile-sheen border border-line bg-surface text-ink',
          )}
        >
          <span className="text-[15px] font-semibold">{p.name}</span>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-[48px] leading-none font-semibold tabular-nums">{p.price}</span>
            <span className={cx('text-[14px]', p.accent ? 'text-white/80' : 'text-ink-3')}>{p.unit}</span>
          </div>
          <p className={cx('mt-4 text-[14.5px] leading-relaxed', p.accent ? 'text-white/85' : 'text-ink-2')}>{p.desc}</p>
          <ul className={cx('mt-5 flex flex-col gap-2.5 border-t pt-5', p.accent ? 'border-white/25' : 'border-line')}>
            {p.items.map((t) => (
              <li key={t} className={cx('flex items-start gap-2.5 text-[14px]', p.accent ? 'text-white' : 'text-ink-2')}>
                <span
                  className={cx(
                    'mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                    p.accent ? 'bg-white text-accent' : 'bg-up-soft text-up',
                  )}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <button type="button" onClick={p.onClick} disabled={p.loading} className={buttonClass('primary', 'md', 'w-full')}>
              {p.loading ? p.loadingLabel : p.cta}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
