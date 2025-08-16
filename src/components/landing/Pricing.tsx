'use client';

import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">Pricing</h2>
        <p className="mt-2 text-white/70">Start free, only pay when you need more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starter */}
        <Card className="bg-white/5 border border-white/10">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-xl font-semibold text-white">Starter</h3>
            <p className="text-3xl font-bold text-white mt-1">$0</p>
          </CardHeader>
          <Divider className="bg-white/10" />
          <CardBody>
            <ul className="text-sm text-white/80 list-disc pl-5 space-y-2">
              <li>1 Free Share Credits on Sign-Up</li>
            </ul>
            <Button as={Link as any} href="/api/auth/signin" color="primary" className="mt-6 w-full font-semibold">
              Start Free
            </Button>
          </CardBody>
        </Card>

        {/* Pay As You Go */}
        <Card className="bg-white/5 border border-white/10">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-xl font-semibold text-white">Pay As You Go</h3>
            <p className="text-3xl font-bold text-white mt-1">$5</p>
          </CardHeader>
          <Divider className="bg-white/10" />
          <CardBody>
            <ul className="text-sm text-white/80 list-disc pl-5 space-y-2">
              <li>Purchase 5 additional credits anytime.</li>
            </ul>
            <Button as={Link as any} href="/dashboard/billing" variant="bordered" className="mt-6 w-full font-semibold">
              Buy Credits
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
