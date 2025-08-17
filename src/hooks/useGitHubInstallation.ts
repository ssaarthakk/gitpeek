'use client';

import { useSession } from 'next-auth/react';

const GITHUB_APP_SLUG = 'git-peek';

export default function useGitHubInstallation() {
  const { data: session, status } = useSession();

  const isInstalled = !!session?.user?.installationId;
  const isLoading = status === 'loading';

  const redirectToInstallation = () => {
    window.location.href = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
  };

  return { isInstalled, isLoading, redirectToInstallation };
}