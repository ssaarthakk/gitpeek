'use client';

import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startFreeLoading, setStartFreeLoading] = useState(false);
  const [buyCreditsLoading, setBuyCreditsLoading] = useState(false);

  const handleStartFree = async () => {
    setStartFreeLoading(true);
    try {
      if (session?.user) {
        router.push('/dashboard/billing');
        // Keep loading state until redirect happens
      } else {
        await signIn('github');
        // Keep loading state until sign in completes
      }
    } catch (error) {
      console.error('Error in handleStartFree:', error);
      setStartFreeLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    setBuyCreditsLoading(true);
    try {
      if (session?.user) {
        router.push('/dashboard/billing');
        // Keep loading state until redirect happens
      } else {
        await signIn('github');
        // Keep loading state until sign in completes
      }
    } catch (error) {
      console.error('Error in handleBuyCredits:', error);
      setBuyCreditsLoading(false);
    }
  };
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
            <Button 
              onPress={handleStartFree} 
              color="primary" 
              className="mt-6 w-full font-semibold"
              isLoading={startFreeLoading}
              isDisabled={startFreeLoading}
            >
              {session?.user ? 'Go to Billing' : 'Start Free'}
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
            <Button 
              onPress={handleBuyCredits} 
              variant="bordered" 
              className="mt-6 w-full font-semibold"
              isLoading={buyCreditsLoading}
              isDisabled={buyCreditsLoading}
            >
              {session?.user ? 'Go to Billing' : 'Buy Credits'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
