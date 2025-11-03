'use client';

import { useState } from 'react';
import { Input, Button, Card, CardBody } from '@heroui/react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

type PasswordProtectionProps = {
  shareId: string;
  onSuccess: () => void;
};

export default function PasswordProtection({ shareId, onSuccess }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch(`/api/share/${shareId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0b0f14] via-[#14181e] to-[#0b0f14]">
      <Card className="w-full max-w-md bg-[#161b22] border border-white/10">
        <CardBody className="gap-6 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <LockClosedIcon className="h-8 w-8 text-indigo-400" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">
                Password Protected
              </h1>
              <p className="text-white/70 text-sm">
                This repository is password protected. Please enter the password to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type={isVisible ? 'text' : 'password'}
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!error}
              errorMessage={error}
              classNames={{
                inputWrapper: 'bg-white/10 border-white/20',
                input: 'text-white',
                label: 'text-white/70',
              }}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-5 w-5 text-white/50 pointer-events-none" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-white/50 pointer-events-none" />
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              color="primary"
              className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium"
              isLoading={isVerifying}
              isDisabled={!password}
            >
              {isVerifying ? 'Verifying...' : 'Unlock Repository'}
            </Button>
          </form>

          <div className="text-center text-xs text-white/50">
            <p>Don't have the password? Contact the repository owner.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
