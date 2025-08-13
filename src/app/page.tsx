'use client';
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import RepoContentView from "@/components/RepoContentView";
import RepoList from "@/components/RepoList";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@heroui/button";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const [shareResult, setShareResult] = useState<{ link?: string; error?: string } | null>(null);

  const handleShare = async (repoFullName: string) => {
    setShareResult(null);

    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoFullName }),
    });

    const data = await response.json();

    if (response.ok) {
      // On success, construct the full shareable link
      const fullLink = `${window.location.origin}/view/${data.id}`;
      setShareResult({ link: fullLink });
    } else {
      // On failure, store the error message from the API
      setShareResult({ error: data.error || "Failed to create link." });
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) return <div className="flex flex-1 items-center justify-center"><LoginButton /></div>;

  return (
    <div className="flex flex-col flex-1 h-screen w-full overflow-hidden">
      {/* Navbar */}
      <nav className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="h-10 w-10 rounded-full ring-2 ring-white/10 object-cover"
            />
          )}
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[13px] font-semibold text-white/90 truncate max-w-[200px]" title={session.user?.name || ''}>{session.user?.name}</span>
            {session.user?.email && (
              <span className="text-[11px] text-white/50 truncate max-w-[200px]" title={session.user.email}>{session.user.email}</span>
            )}
          </div>
          <div className="hidden sm:block">
            <LogoutButton />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-[11px] text-white/40 uppercase tracking-wide">Repository</div>
          <RepoList onRepoSelect={setSelectedRepo} />
          <button onClick={() => handleShare(selectedRepo!)} className="px-3 py-1 bg-sky-500 text-white rounded-md text-xs hover:bg-sky-600 transition-colors">
            Share
          </button>
          {shareResult?.link && (
            <div>
              <p>Share link created!</p>
              <input type="text" readOnly value={shareResult.link} style={{ width: '300px' }} />
              <button onClick={() => navigator.clipboard.writeText(shareResult.link!)}>Copy</button>
            </div>
          )}
          {shareResult?.error && (
            <p style={{ color: 'red' }}>Error: {shareResult.error}</p>
          )}
          <div className="sm:hidden">
            <LogoutButton />
          </div>
        </div>
      </nav>
      {/* Main Repository View */}
      <main className="flex-1 overflow-hidden">
        {selectedRepo ? (
          <RepoContentView repoFullName={selectedRepo} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-white/40">
            Select a repository to browse its contents.
          </div>
        )}
      </main>
    </div>
  );
}