'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';

const GITHUB_APP_NAME = 'git-peek';

export default function useGitHubInstallation() {
  const { data: session } = useSession();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const checkInstallation = async () => {
      const octokit = new Octokit({ auth: session.accessToken });
      try {
        const installations = await octokit.request('GET /user/installations');
        const appInstallation = installations.data.installations.find(
          (inst) => inst.app_slug === GITHUB_APP_NAME
        );
        setIsInstalled(!!appInstallation);
      } catch (error) {
        console.error("Failed to check for installation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkInstallation();
  }, [session]);

  const redirectToInstallation = () => {
    window.location.href = `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`;
  };

  return { isInstalled, isLoading, redirectToInstallation };
}