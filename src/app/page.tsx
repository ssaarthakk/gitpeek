'use client';
import LoginButton from "@/components/LoginButton";
import MainContent from "@/components/landing/MainContent";
import Navbar from "@/components/landing/Navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const handleShare = async (repoFullName: string) => {
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoFullName }),
    });

    const data = await response.json();

    if (response.ok) {
      const fullLink = `${window.location.origin}/view/${data.id}`;
      return { link: fullLink };
    } else {
      return { error: data.error || "Failed to create link." };
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) return <div className="flex flex-1 items-center justify-center"><LoginButton /></div>;

  return (
    <div className="flex flex-col flex-1 h-screen w-full overflow-hidden">
      <Navbar
        onRepoSelect={setSelectedRepo}
        handleShare={handleShare}
        selectedRepo={selectedRepo}
      />
      <MainContent selectedRepo={selectedRepo} />
    </div>
  );
}