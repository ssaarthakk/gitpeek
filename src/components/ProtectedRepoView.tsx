'use client';

import { useState, useEffect } from 'react';
import PasswordProtection from '@/components/PasswordProtection';
import RepoContentView from '@/components/RepoContentView';

type ProtectedRepoViewProps = {
  shareId: string;
  repoFullName: string;
  accessToken: string;
  isPasswordProtected: boolean;
  isInitiallyVerified: boolean;
  allowCopying: boolean;
};

export default function ProtectedRepoView({
  shareId,
  repoFullName,
  accessToken,
  isPasswordProtected,
  isInitiallyVerified,
  allowCopying
}: ProtectedRepoViewProps) {
  const [isVerified, setIsVerified] = useState(isInitiallyVerified);

  if (isPasswordProtected && !isVerified) {
    return (
      <PasswordProtection
        shareId={shareId}
        onSuccess={() => setIsVerified(true)}
      />
    );
  }

  return (
    <main className="flex h-screen w-screen">
      <RepoContentView
        repoFullName={repoFullName}
        accessToken={accessToken}
        allowCopying={allowCopying}
        shareId={shareId}
      />
    </main>
  );
}
