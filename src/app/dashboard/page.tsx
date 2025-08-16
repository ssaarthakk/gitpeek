"use client"
import MainContent from '@/components/landing/MainContent';
import Navbar from '@/components/landing/Navbar'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

function page() {

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

  return (
    <div className="flex flex-col flex-1 h-screen w-full overflow-hidden">
      <Navbar
        onRepoSelect={setSelectedRepo}
        handleShare={handleShare}
        selectedRepo={selectedRepo}
      />
      <MainContent selectedRepo={selectedRepo} />
    </div>
  )
}

export default page