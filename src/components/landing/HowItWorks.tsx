'use client';

import { Card, CardBody } from '@heroui/react';
import Reveal from '@/components/animations/Reveal';

const steps = [
  {
    title: 'Connect Account',
    desc: 'Securely sign in with your GitHub account in seconds.',
  },
  {
    title: 'Generate Link',
    desc: 'Select any private repository, choose an expiration, and instantly create your shareable link.',
  },
  {
    title: 'Share with Confidence',
    desc: 'Share the secure, read-only link with recruiters, clients, or colleagues.',
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">How It Works</h2>
          <p className="mt-2 text-white/70">Three simple steps to share your code securely.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <Card className="bg-white/5 border border-white/10">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{s.desc}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
