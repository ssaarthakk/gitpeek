'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const GITHUB_APP_SLUG = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || '';

export default function useGitHubInstallation() {
  const { data: session, status, update } = useSession();

  const isInstalled = !!session?.user?.installationId;
  const isLoading = status === 'loading';

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data === 'github_installation_success') {
        // await signOut({ redirect: false });
        await signIn('github');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [session]);

  const redirectToInstallation = () => {
    window.location.href = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
  };

  const openInstallationWindow = () => {
    const installUrl = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
    window.open(installUrl, 'GitHub App Installation', 'width=800,height=700');
  };

  return { isInstalled, isLoading, openInstallationWindow };
}