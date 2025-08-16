'use client';
import LoginButton from "@/components/LoginButton";
import MainContent from "@/components/landing/MainContent";
import Navbar from "@/components/landing/Navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const handleShare = async (repoFullName: string) => {
    try {
      const response = await axios.post('/api/share', { repoFullName });

      const fullLink = `${window.location.origin}/view/${response.data.id}`;
      return { link: fullLink };
    } catch (error: any) {
      return { error: error.response?.data?.error || "Failed to create link." };
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