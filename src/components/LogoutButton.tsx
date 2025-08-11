'use client';
import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button isLoading={loading} onClickCapture={handleSignOut} radius="sm" size="md" disabled={loading} >
      <Image src="/icons/SignoutLogo.svg" alt="Logo" width={20} height={20} /> 
      Sign out
    </Button>
  );
}