'use client';

import { useState } from 'react';
import PasswordProtection from '@/components/PasswordProtection';
import RepoContentView from '@/components/RepoContentView';

type ProtectedRepoViewProps = {
  shareId: string;
  repoFullName: string;
  accessToken: string;
  isPasswordProtected: boolean;
  isInitiallyVerified: boolean;
  allowCopying: boolean;
  branch?: string;
  /** ISO timestamp, or null when the link never expires. */
  expiresAt?: string | null;
  isOneTime?: boolean;
  sharedBy?: string | null;
};

export default function ProtectedRepoView({
  shareId,
  repoFullName,
  accessToken,
  isPasswordProtected,
  isInitiallyVerified,
  allowCopying,
  branch,
  expiresAt,
  isOneTime,
  sharedBy,
}: ProtectedRepoViewProps) {
  const [isVerified, setIsVerified] = useState(isInitiallyVerified);

  if (isPasswordProtected && !isVerified) {
    return (
      <PasswordProtection
        shareId={shareId}
        repoFullName={repoFullName}
        onSuccess={() => setIsVerified(true)}
      />
    );
  }

  return (
    <main className="h-dvh w-full overflow-hidden bg-bg">
      <RepoContentView
        repoFullName={repoFullName}
        accessToken={accessToken}
        allowCopying={allowCopying}
        shareId={shareId}
        branch={branch}
        expiresAt={expiresAt}
        isOneTime={isOneTime}
        sharedBy={sharedBy}
      />
    </main>
  );
}
