'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0f14]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f14]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-white">Git Peek</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Button as={Link as any} href="/pricing" variant="flat" className="text-sm">Pricing</Button>
          <Button
            as={Link as any}
            href="/api/auth/signin"
            color="primary"
            className="text-sm font-semibold"
          >
            Sign In with GitHub
          </Button>
        </nav>
      </div>
    </header>
  );
}
