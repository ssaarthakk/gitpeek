'use client'

import { useState, useEffect } from 'react';
import { submitAccessRequest } from '@/actions/requestAccess';
import { Input, Textarea, Button } from "@heroui/react";

export default function RequestAccessForm({ shareId }: { shareId: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitAccessRequest(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center px-4">
        <div className="rounded-xl shadow-2xl bg-white/5 p-8 flex flex-col items-center border border-white/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-success/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Request Sent!</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            The developer has been notified. You will receive an email if they grant you a new access link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center px-4">
      <div className="rounded-xl shadow-2xl bg-white/5 p-8 flex flex-col border border-white/10 max-w-md w-full relative overflow-hidden backdrop-blur-sm">
        {/* Decorative blur effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 text-white">Link Expired</h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">
            This repository link has expired or reached its view limit. Request a new link directly from the developer by filling out the form below.
          </p>

          {isMounted ? (
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <input type="hidden" name="shareId" value={shareId} />

              <Input
                id="email"
                type="email"
                name="email"
                label="Your Email"
                placeholder="you@company.com"
                isRequired
                variant="bordered"
                data-1p-ignore="true"
                data-lpignore="true"
                autoComplete="off"
                classNames={{
                  label: "text-white/80",
                  input: "text-white placeholder:text-white/30",
                  inputWrapper: "border-white/10 hover:border-white/20 focus-within:border-primary/50 bg-white/5 group-data-[focus=true]:border-primary/50"
                }}
              />

              <Textarea
                id="message"
                name="message"
                label="Message (Optional)"
                placeholder="Hi, I'd like to access this repository to review your code..."
                variant="bordered"
                classNames={{
                  label: "text-white/80",
                  input: "text-white placeholder:text-white/30",
                  inputWrapper: "border-white/10 hover:border-white/20 focus-within:border-primary/50 bg-white/5 group-data-[focus=true]:border-primary/50"
                }}
              />

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                className="w-full mt-4 font-semibold shadow-lg shadow-primary/20"
                size="lg"
              >
                Request Access
              </Button>
            </form>
          ) : (
             <div className="space-y-5 opacity-0">
                <div className="h-[52px] w-full bg-white/5 rounded-medium"></div>
                <div className="h-[76px] w-full bg-white/5 rounded-medium"></div>
                <div className="h-[56px] w-full mt-4 bg-white/5 rounded-large"></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}