'use client';

import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import Reveal from '@/components/animations/Reveal';

export default function Hero() {
  return (
    <div className="relative mx-auto w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-12 md:pb-20">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-120px] bottom-[-120px] h-[360px] w-[360px] rounded-full bg-white/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="mb-6 flex items-center justify-center gap-2">
            <Chip color="primary" variant="flat" className="bg-primary/10 text-primary">New</Chip>
            <span className="text-white/70 text-sm">Secure sharing for private repos</span>
          </div>
        </Reveal>
        <Reveal>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Share Private GitHub Repos, Securely & Temporarily.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-base md:text-lg text-white/70">
            Generate a time-limited, read-only link to your private code for interviews, code reviews, or collaboration.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button as={Link as any} href="/api/auth/signin" size="lg" color="primary" className="px-6 font-semibold">
              Get Started for Free
            </Button>
            {/* <Button as={Link as any} href="#how-it-works" size="lg" variant="bordered" className="px-6">
              How it works
            </Button> */}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
