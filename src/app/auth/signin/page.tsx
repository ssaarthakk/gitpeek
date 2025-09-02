'use client';

import { Button } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github');
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign in to GitPeek</h1>
          <p className="mt-2 text-white/70">
            Generate time-limited, read-only links to your private repositories
          </p>
        </div>

        <div className="mt-8 bg-[#161b22] rounded-lg p-8 shadow-lg">
          <div className="space-y-6">
            <Button
              size="lg"
              color="primary"
              className="w-full font-semibold"
              onPress={handleSignIn}
              isLoading={isLoading}
              isDisabled={isLoading}
              startContent={
                !isLoading ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ) : null
              }
            >
              Sign in with GitHub
            </Button>

            <div className="text-center text-sm text-white/50">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}