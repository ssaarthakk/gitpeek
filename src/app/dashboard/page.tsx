"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import useGitHubInstallation from '@/hooks/useGitHubInstallation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isInstalled, isLoading: loadingInstall, openInstallationWindow } = useGitHubInstallation();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Only show the skeleton on first load. A session refresh (e.g. after creating a link, to pick up
  // the new credit balance) also reports status "loading", and must not unmount the dashboard.
  if (!session) {
    if (status === 'unauthenticated') return null;
    return <DashboardSkeleton />;
  }

  return (
    <DashboardContent
      session={session}
      isInstalled={isInstalled}
      // Don't flash "Checking…" during a session refresh when the app is already known to be installed.
      isLoadingInstall={loadingInstall && !isInstalled}
      openInstallationWindow={openInstallationWindow}
    />
  );
}
