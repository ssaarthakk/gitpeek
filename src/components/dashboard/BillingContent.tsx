'use client';
import { Session } from 'next-auth';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Chip,
  Spacer,
  Avatar
} from '@heroui/react';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';
import DashboardNavbar from './DashboardNavbar';
import Link from 'next/link';

type BillingContentProps = {
  session: Session;
};

export default function BillingContent({ session }: BillingContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleBuyCredits = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/checkout', { quantity });
      const { url } = response.data;
      
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to create checkout session");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to create checkout session");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e6edf3]">
      <DashboardNavbar session={session} />
      
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            as={Link}
            href="/dashboard"
            variant="light"
            size="sm"
            startContent={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            className="text-white/70 hover:text-white"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Billing & Credits</h1>
          <p className="text-white/70">
            Manage your credits and purchase additional ones as needed
          </p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border border-white/10 flex items-center justify-center">
            <CardHeader className="pb-3 px-8">
              <div className="flex items-center justify-center gap-3">
                <Avatar
                  src={session.user?.image || undefined}
                  name={session.user?.name || 'User'}
                  size="lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{session.user?.name}</h3>
                  <p className="text-sm text-white/70">{session.user?.email}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-white">Available Credits</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold text-indigo-400">
                    {session.user?.credits || 0}
                  </span>
                  <p className="text-sm text-white/70 mt-1">
                    Credits remaining
                  </p>
                </div>
                <div className="text-right">
                  <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                    classNames={{
                      base: "bg-indigo-500/20 text-indigo-200",
                      content: "font-semibold"
                    }}
                  >
                    Active
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Spacer y={4} />

        {/* Purchase Credits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">Purchase Credits</h3>
            </CardHeader>
            <CardBody className="space-y-6">
              <p className="text-white/70">
                Each credit allows you to create one shareable repository link. 
                Purchase credits in bulk to save money.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Number of Credits
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={String(quantity)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Enter quantity"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/10 border-white/20"
                    }}
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Credits:</span>
                    <span className="text-white">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Price per credit:</span>
                    <span className="text-white">$1.00</span>
                  </div>
                  {quantity >= 10 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Bulk discount (10% off):</span>
                      <span>-${(quantity * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-white/10" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-white">
                      ${quantity >= 10 ? (quantity * 0.9).toFixed(2) : quantity.toFixed(2)}
                    </span>
                  </div>
                </div>

                {quantity >= 10 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-400 font-medium">
                        Bulk discount applied! Save 10% on orders of 10+ credits
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  color="primary"
                  size="lg"
                  onPress={handleBuyCredits}
                  isLoading={isLoading}
                  className="w-full"
                  isDisabled={quantity < 1 || quantity > 100}
                >
                  {isLoading ? 'Processing...' : `Purchase ${quantity} Credit${quantity === 1 ? '' : 's'}`}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* How Credits Work */}
          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">How Credits Work</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-400 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Create Share Links</h4>
                    <p className="text-sm text-white/70">
                      Each credit allows you to create one shareable repository link
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-400 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Unlimited Views</h4>
                    <p className="text-sm text-white/70">
                      Once created, share links can be viewed unlimited times
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-400 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Flexible Expiration</h4>
                    <p className="text-sm text-white/70">
                      Set custom expiration times or create permanent links
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 font-semibold text-sm">💡</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Bulk Savings</h4>
                    <p className="text-sm text-white/70">
                      Save 10% when purchasing 10 or more credits at once
                    </p>
                  </div>
                </div>
              </div>

              <Spacer y={4} />

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-400 mb-2">Need Help?</h4>
                <p className="text-sm text-white/70">
                  Contact our support team if you have questions about billing or credits.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
