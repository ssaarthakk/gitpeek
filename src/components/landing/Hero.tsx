'use client';

import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import Reveal from '@/components/animations/Reveal';

export default function Hero() {
  return (
    <div
      className="relative mx-auto w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-16"
    >
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute right-[-120px] bottom-[-120px] h-[380px] w-[380px] rounded-full bg-white/10 blur-[110px]" />
      </div>

      <div className="flex flex-col mx-auto max-w-4xl h-full items-center justify-center text-center">
        <div>
          <Reveal>
            <div className="mb-6 flex items-center justify-center gap-2">
              <Chip color="primary" variant="flat" className="bg-primary/10 text-primary">New</Chip>
              <span className="text-white/70 text-sm md:text-base">Secure sharing for private repos</span>
            </div>
          </Reveal>
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Share Private GitHub Repos, Securely & Temporarily.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg md:text-xl text-white/70">
              Generate a time-limited, read-only link to your private code for interviews, code reviews, or collaboration.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button as={Link as any} href="/api/auth/signin" size="lg" color="primary" className="px-7 md:px-8 font-semibold">
                Get Started for Free
              </Button>
              {/* <Button as={Link as any} href="#how-it-works" size="lg" variant="bordered" className="px-6">
                How it works
              </Button> */}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
