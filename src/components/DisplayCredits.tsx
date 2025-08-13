'use client';

import { useSession } from 'next-auth/react';

export default function DisplayCredits() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading credits...</p>;
  }

  return (
    <div>
      <h2>Your Credits</h2>
      <p>You have {session?.user?.credits ?? 0} credits remaining.</p>
    </div>
  );
}