'use client';
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { GitHubMark } from "@/components/site/icons";
import { buttonClass, cx } from "@/components/kit";

type Props = {
  /** `nav`: outlined secondary pill for headers. `primary`: large white pill for CTAs. */
  variant?: "nav" | "primary";
  callbackUrl?: string;
  label?: string;
  className?: string;
};

export default function LoginButton({ variant = "primary", callbackUrl = "/dashboard", label, className = "" }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const base = variant === "nav" ? buttonClass("secondary", "md") : buttonClass("primary", "lg");

  if (session?.user) {
    return (
      <Link href="/dashboard" className={cx(base, "hover:no-underline", className)}>
        Dashboard
      </Link>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl });
      // Keep loading until the redirect happens.
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleSignIn} disabled={loading} className={cx(base, className)}>
      {variant === "primary" && <GitHubMark className="h-[18px] w-[18px]" />}
      {loading ? "Redirecting to GitHub…" : label ?? (variant === "nav" ? "Sign in" : "Sign in with GitHub")}
    </button>
  );
}
