'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Octokit } from '@octokit/core';

const GITHUB_APP_SLUG = 'git-peek';

export default function useGitHubInstallation() {
  const { data: session, status, update } = useSession();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = session?.accessToken;

  console.log(accessToken);

  const checkInstallation = async () => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const octokit = new Octokit({ auth: accessToken });
      const { data } = await octokit.request('GET /user/installations', { per_page: 10 });
      const appInstallation = data.installations.find(
        (inst) => inst.app_slug === GITHUB_APP_SLUG
      );
      console.log("Data: ", data);
      console.log("AppInstall: ", appInstallation);

      setIsInstalled(!!appInstallation);
    } catch (error) {
      console.error("Failed to check for installation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      checkInstallation();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session]);


  // useEffect(() => {
  //   const channel = new BroadcastChannel('github_installation');

  //   const handleMessage = async (event: MessageEvent) => {
  //     if (event.data === 'success') {
  //       console.log("Installation success message received!");
  //       await update();
  //       await checkInstallation();
  //     }
  //   };

  //   channel.addEventListener('message', handleMessage);

  //   return () => {
  //     channel.removeEventListener('message', handleMessage);
  //     channel.close();
  //   };
  // }, [checkInstallation, update]);

  const openInstallationWindow = () => {
    // const installUrl = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
    // window.open(installUrl, 'GitHub App Installation', 'width=800,height=700');

    window.location.href = `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`;
  };

  return { isInstalled, isLoading, openInstallationWindow };
}