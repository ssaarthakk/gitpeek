'use client';
import { useSession } from 'next-auth/react';
import { StatCell, cx } from '@/components/kit';

export default function DisplayCredits({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const credits = session?.user?.credits ?? 0;

  if (status === 'loading') {
    return <div className={cx('h-[86px] animate-pulse rounded-2xl bg-surface-2', className)} />;
  }

  return (
    <StatCell
      className={className}
      label="Credits"
      tick={credits > 0 ? 'ink' : 'danger'}
      value={credits}
      unit={credits === 1 ? 'link left' : 'links left'}
    />
  );
}
