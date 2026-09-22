'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import GateShell, { ErrorLine, Spinner, inputClass, primaryButtonClass } from '@/components/view/GateShell';

type PasswordProtectionProps = {
  shareId: string;
  onSuccess: () => void;
  repoFullName?: string;
};

export default function PasswordProtection({ shareId, onSuccess, repoFullName }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError('');
    }
  };

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
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <GateShell
      repoFullName={repoFullName}
      status="Password required"
      statusTone="accent"
      icon="lock"
      tone="accent"
      title="This link needs a password."
      blurb="The person who shared this repository set a password. They should have sent it to you separately."
      foot="Don't have the password? Ask the person who shared the link."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="gate-password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            id="gate-password"
            type={isVisible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            autoFocus
            aria-invalid={!!error}
            aria-describedby={error ? 'gate-password-error' : undefined}
            className={`${inputClass} pr-12 aria-invalid:border-danger`}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-hover hover:text-ink"
          >
            {isVisible ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>

        {error && <ErrorLine id="gate-password-error">{error}</ErrorLine>}

        <button type="submit" disabled={!password || isVerifying} className={primaryButtonClass}>
          {isVerifying && <Spinner />}
          {isVerifying ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </GateShell>
  );
}
