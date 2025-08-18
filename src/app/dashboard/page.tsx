"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Skeleton } from '@heroui/skeleton';
import useGitHubInstallation from '@/hooks/useGitHubInstallation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { isInstalled, isLoading: loadingInstall, openInstallationWindow } = useGitHubInstallation();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-[#e6edf3]">
        <div className="border-b border-white/10 p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e6edf3]">
      <DashboardNavbar session={session} />
      <DashboardContent 
        session={session} 
        isInstalled={isInstalled}
        isLoadingInstall={loadingInstall}
        openInstallationWindow={openInstallationWindow}
      />
    </div>
  );
}