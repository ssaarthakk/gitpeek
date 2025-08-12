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
      <div className="flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-6 py-10 overflow-y-auto">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name!}
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        )}
        <div className="flex flex-col items-center gap-3 mt-4 mb-6">
          <p className="text-sm text-white/60">Signed in as <span className="font-medium text-white/90">{session.user?.name}</span></p>
          <LogoutButton />
        </div>
        <div className="w-full flex flex-col items-stretch">
          <RepoList onRepoSelect={setSelectedRepo} />
          {!!selectedRepo && <RepoContentView repoFullName={selectedRepo} />}
        </div>
      </div>
    );
  }
  return (
    <LoginButton />
  )
}