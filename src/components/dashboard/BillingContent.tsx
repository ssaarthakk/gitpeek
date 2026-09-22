'use client';
import { useEffect, useMemo, useState } from 'react';
import { Session } from 'next-auth';
import Link from 'next/link';
import axios from '@/lib/api';
import useLinkStats from '@/hooks/useLinkStats';
import BuyCreditsButton from '@/components/BuyCreditsButton';
import { Chip, Gauge, StatCell, Tile, buttonClass, cx } from '@/components/kit';
import DashboardNavbar from './DashboardNavbar';
import { ShareLink, linkBucket } from './types';
import { formatNumber } from './format';
import { Bone } from './DashboardSkeleton';

/**
 * Card payments are switched off while the payment processor issue is open; readers request
 * credits by email or DM instead. Flip this to bring back Stripe Checkout (/api/checkout).
 */
const PURCHASES_ENABLED = false;

type BillingContentProps = {
  session: Session;
  /** From the Stripe redirect: /dashboard/billing?success=true or ?canceled=true */
  checkoutResult?: 'success' | 'canceled' | null;
};

function Notice({ tick, title, children }: { tick: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className={cx('h-3.5 w-[3px] rounded-full', tick)} />
        {title}
      </div>
      <div className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

export default function BillingContent({ session, checkoutResult = null }: BillingContentProps) {
  const credits = session.user?.credits || 0;
  const [links, setLinks] = useState<ShareLink[] | null>(null);
  // Only used for the Requests badge / bell dot in the shell.
  const { stats: linkStats } = useLinkStats('7d');

  useEffect(() => {
    axios
      .get('/api/links')
      .then((res) => setLinks(res.data))
      .catch((err) => {
        console.error('Failed to fetch share links:', err);
        setLinks([]);
      });
  }, []);

  const stats = useMemo(() => {
    if (!links) return null;
    const now = Date.now();
    let live = 0;
    let ended = 0;
    let opens = 0;
    let expiringSoon = 0;
    for (const l of links) {
      const b = linkBucket(l, now);
      opens += l._count?.linkViews || 0;
      if (b === 'expired' || b === 'used') ended++;
      else {
        live++;
        if (b === 'expiring') expiringSoon++;
      }
    }
    return { created: links.length, opens, live, ended, expiringSoon };
  }, [links]);

  const held = credits + (stats?.created ?? 0);

  return (
    <div className="min-h-screen overflow-x-clip bg-bg text-ink">
      <DashboardNavbar session={session} active="billing" pendingCount={linkStats?.pendingRequests ?? 0} />

      <main className="flex flex-col gap-4 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
        {checkoutResult === 'success' && (
          <Notice tick="bg-up" title="Payment received">
            Credits are added as soon as Stripe confirms, usually within a minute. Reload this page if the balance
            hasn’t changed.
          </Notice>
        )}
        {checkoutResult === 'canceled' && (
          <Notice tick="bg-ink-3" title="Checkout cancelled">
            You weren’t charged.
          </Notice>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <Tile title="Balance" className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className={cx('text-[48px] font-semibold leading-none tabular-nums', credits > 0 ? 'text-ink' : 'text-danger')}>
                {credits}
              </span>
              <span className="text-lg text-ink-3">{credits === 1 ? 'credit' : 'credits'}</span>
            </div>
            <p className="mt-2 text-[13px] text-ink-3">
              {credits > 0
                ? 'Each credit creates one share link. Unused credits don’t expire.'
                : 'You’re out of credits. New links can’t be created until you add more.'}
            </p>
            <Gauge
              className="mt-4"
              value={credits}
              max={Math.max(held, 1)}
              caption={
                stats
                  ? `${credits} ${credits === 1 ? 'link' : 'links'} left · ${formatNumber(stats.created)} created so far`
                  : `${credits} ${credits === 1 ? 'link' : 'links'} left`
              }
            />
          </Tile>

          <Tile
            title="Add credits"
            className="min-w-0"
            actions={
              PURCHASES_ENABLED ? <Chip>One-off, no subscription</Chip> : <Chip tone="sun" dot>Card payments paused</Chip>
            }
          >
            {PURCHASES_ENABLED ? (
              <BuyCreditsButton />
            ) : (
              <div className="flex flex-col gap-5">
                <div className="rounded-[18px] bg-surface-2 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="h-3.5 w-[3px] rounded-full bg-sun" />
                    Card payments are paused
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
                    Our payment processor is having issues and we’re working on it. Until it’s fixed, credits are free on
                    request.
                  </p>
                </div>

                <p className="text-[15px] leading-relaxed text-ink-2">
                  Ask by email or on X. Include your GitHub primary email address so we can find your account; credits are
                  added within 24 hours.
                </p>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={`mailto:${session.user?.email}?subject=GitPeek Credits Request&body=Hi, I would like to request additional (number of credits) credits for my GitPeek account (your primary email address). Please let me know how many credits you can provide. Thank you!`}
                    target="_blank"
                    className={buttonClass('primary', 'lg', 'hover:text-bg')}
                  >
                    Email a request
                  </a>
                  <a
                    href="https://twitter.com/ssaarthakk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('secondary', 'lg', 'hover:text-ink')}
                  >
                    Message @ssaarthakk on X
                  </a>
                </div>
              </div>
            )}
          </Tile>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <Tile title="Your links" className="min-w-0">
              {stats ? (
                <div className="grid grid-cols-2 gap-3">
                  <StatCell label="Links created" tick="ink" value={formatNumber(stats.created)} />
                  <StatCell label="Opened by readers" tick="up" value={formatNumber(stats.opens)} />
                  <StatCell label="Live now" tick="accent" value={stats.live} />
                  <StatCell label="Expired or used" tick="danger" value={stats.ended} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <Bone key={i} className="h-[86px] rounded-2xl" />
                  ))}
                </div>
              )}
              <p className="mt-3.5 text-xs text-ink-4">All time. Revoked links aren’t counted.</p>
            </Tile>

            {stats && stats.expiringSoon > 0 && (
              <Notice tick="bg-sun" title="Expiring soon">
                {stats.expiringSoon === 1 ? 'One link expires' : `${stats.expiringSoon} links expire`} in the next 24 hours.
                Links aren’t renewed automatically.{' '}
                <Link href="/dashboard#links" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  Review them
                </Link>
              </Notice>
            )}
          </div>

          <Tile title="How credits work" className="min-w-0">
            <dl className="flex flex-col gap-2">
              {[
                ['One credit, one link', 'Creating a share link uses one credit, whatever its expiry or restrictions.'],
                ['Opens are free', 'Readers can open a link as often as its rules allow. One-time links close after the first open.'],
                ['Approving a request is free', 'When a reader asks for access to an ended link, approving it creates a new 7-day link at no cost.'],
                ['Revoking doesn’t refund', 'A revoked or expired link keeps the credit it used.'],
                ['Bulk savings', 'Buying 10 or more credits at once takes 10% off.'],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 rounded-2xl bg-surface-2 px-4 py-3 sm:grid-cols-[210px_1fr] sm:gap-4">
                  <dt className="text-[13.5px] font-medium text-ink">{k}</dt>
                  <dd className="text-[13.5px] text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Tile>
        </div>
      </main>
    </div>
  );
}
