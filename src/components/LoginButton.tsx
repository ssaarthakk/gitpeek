'use client';
import { Button } from "@heroui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button isLoading={loading} onClickCapture={handleSignIn} radius="sm" size="lg" disabled={loading} >
        <Image src="/icons/GithubLogo.svg" alt="Logo" width={24} height={24} />
        Sign in with GitHub
      </Button>
    </>
  );
}