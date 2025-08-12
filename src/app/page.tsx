'use client';
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import RepoContentView from "@/components/RepoContentView";
import RepoList from "@/components/RepoList";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto px-8 py-10 overflow-y-auto gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
          <div className="flex items-center gap-4 min-w-0">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name!}
                className="h-14 w-14 rounded-full ring-2 ring-white/10 object-cover"
              />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-white/90 truncate max-w-xs" title={session.user?.name || ''}>{session.user?.name}</p>
              {session.user?.email && (
                <p className="text-xs text-white/50 truncate max-w-xs" title={session.user.email}>{session.user.email}</p>
              )}
              <div className="mt-1">
                <LogoutButton />
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-start justify-start md:justify-end min-w-[240px]">
            <div className="w-full max-w-md"><RepoList onRepoSelect={setSelectedRepo} /></div>
          </div>
        </div>
        {!!selectedRepo && <RepoContentView repoFullName={selectedRepo} />}
      </div>
    );
  }
  return (
    <LoginButton />
  )
}