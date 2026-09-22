'use client';
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm text-ink-2 hover:bg-hover hover:text-ink disabled:opacity-60 ${className}`}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
