'use client';

import { Card, CardBody } from '@heroui/react';
import Reveal from '@/components/animations/Reveal';

const features = [
  {
    title: 'Secure & Read-Only',
    desc: 'Your code is never stored on our servers and cannot be modified by viewers.',
  },
  {
    title: 'Link Expiration',
    desc: 'Control exactly how long your links are active, from one hour to seven days.',
  },
  {
    title: 'Password Protection',
    desc: 'Add an extra layer of security by requiring a password to view a shared repository.',
  },
  {
    title: 'Link Analytics',
    desc: 'Get notified and see exactly when your shared link has been viewed.',
  },
];

function PlaceholderIcon() {
  return (
    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
  );
}

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Features</h2>
          <p className="mt-2 text-white/70">Everything you need to share private code with confidence.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((f, idx) => (
          <Reveal key={f.title} delay={idx * 0.08}>
            <Card className="bg-white/5 border border-white/10">
              <CardBody>
                <div className="flex items-start gap-4">
                  <PlaceholderIcon />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{f.desc}</p>
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
