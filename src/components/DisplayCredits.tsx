'use client';
import { useSession } from 'next-auth/react';

export default function DisplayCredits() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-white/5 rounded-xl p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">Your Credits</h2>
        <p className="text-sm text-white/50 mt-1">Current balance available for use.</p>
      </div>
      {status === 'loading' ? (
        <div className="h-12 w-24 bg-white/10 rounded-md animate-pulse mt-4" />
      ) : (
        <p className="text-5xl font-bold text-white mt-4">{session?.user?.credits ?? 0}</p>
      )}
    </div>
  );
}