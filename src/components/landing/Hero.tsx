'use client';

import Link from 'next/link';
import { Button, Chip } from '@heroui/react';

export default function Hero() {
  return (
    <div className="mx-auto w-screen px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-12 md:pb-20">
      <div className="mx-auto w-3xl text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Chip color="primary" variant="flat" className="bg-primary/10 text-primary">New</Chip>
          <span className="text-white/70 text-sm">Secure sharing for private repos</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Share Private GitHub Repos, Securely & Temporarily.
        </h1>
        <p className="mt-4 text-base md:text-lg text-white/70">
          Generate a time-limited, read-only link to your private code for interviews, code reviews, or collaboration.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button as={Link as any} href="/api/auth/signin" size="lg" color="primary" className="px-6 font-semibold">
            Get Started for Free
          </Button>
          <Button as={Link as any} href="#how-it-works" size="lg" variant="bordered" className="px-6">
            How it works
          </Button>
        </div>
      </div>

      {/* <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-white/80 text-sm">No code stored on our servers</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-white/80 text-sm">Time-limited, read-only access</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-white/80 text-sm">Audit trail & notifications</p>
        </div>
      </div> */}
    </div>
  );
}
