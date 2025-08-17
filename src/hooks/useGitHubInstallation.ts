// app/hooks/useGitHubInstallation.ts
'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';

const GITHUB_APP_SLUG = 'git-peek';

export default function useGitHubInstallation() {
  const { data: session, update } = useSession();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    if (!session.accessToken) {
      setIsLoading(false);
      return;
    };

    const checkAndRedirect = async () => {
      const octokit = new Octokit({ auth: session.accessToken });
      try {
        const installations = await octokit.request('GET /user/installations');
        const appInstallation = installations.data.installations.find(
          (inst) => inst.app_slug === GITHUB_APP_SLUG
        );

        if (appInstallation) {
          setIsInstalled(true);

          await update();
        } else {
          window.location.href = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
        }
      } catch (error) {
        console.error("Failed to check for installation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAndRedirect();
  }, [session?.accessToken, update]);

  return { isInstalled, isLoading };
}