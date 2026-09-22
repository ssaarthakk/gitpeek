'use client'

import { useState, useEffect } from 'react';
import { submitAccessRequest } from '@/actions/requestAccess';
import GateShell, { ErrorLine, Spinner, inputClass, primaryButtonClass, secondaryButtonClass, textareaClass } from '@/components/view/GateShell';

function StatRow({ label, value, tick, valueClass = 'text-ink' }: { label: string; value: string; tick: string; valueClass?: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-surface-2 p-3.5 first:last:col-span-2">
      <dt className="flex items-center gap-2 text-[12.5px] text-ink-3">
        <span className={`h-3 w-[3px] rounded-full ${tick}`} />
        {label}
      </dt>
      <dd className={`mt-1.5 text-[15px] font-semibold leading-snug ${valueClass}`}>{value}</dd>
    </div>
  );
}

type RequestAccessFormProps = {
  shareId: string;
  repoFullName?: string;
  /** Why the link stopped working. */
  reason?: 'expired' | 'used';
  /** Relative, pre-formatted on the server, e.g. "6 days ago". */
  createdAgo?: string;
  /** Relative, pre-formatted on the server, e.g. "2 hours ago". */
  expiredAgo?: string;
};

export default function RequestAccessForm({
  shareId,
  repoFullName,
  reason = 'expired',
  createdAgo,
  expiredAgo,
}: RequestAccessFormProps) {
  const [step, setStep] = useState<'info' | 'form'>('info');
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

  const status = reason === 'used' ? 'Already used' : 'Expired';

  if (isSubmitted) {
    return (
      <GateShell
        repoFullName={repoFullName}
        status={status}
        statusTone="danger"
        icon="check"
        tone="up"
        title="Request sent."
        foot="Only the person who shared this link can give you access again."
      >
        <div className="flex items-start gap-3 rounded-2xl bg-up-soft px-4 py-3.5">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-up" />
          <p className="text-[13.5px] leading-normal text-up">
            Your request was sent to the owner. If they approve it, they&apos;ll send you a new link.
          </p>
        </div>
      </GateShell>
    );
  }

  if (step === 'info') {
    const title =
      reason === 'used'
        ? 'This link has already been used.'
        : expiredAgo
          ? `This link expired ${expiredAgo}.`
          : 'This link has expired.';
    const blurb =
      reason === 'used'
        ? 'It was a one-time link and it has already been opened. The person who shared it can send you a new one.'
        : 'It was set to run out, and it did. Nothing is broken — the person who shared it can send you a new link.';

    return (
      <GateShell
        repoFullName={repoFullName}
        status={status}
        statusTone="danger"
        icon="clock"
        tone="danger"
        title={title}
        blurb={blurb}
        foot="Only the person who shared this link can give you access again."
      >
        <div className="flex flex-col gap-3.5">
          {(createdAgo || expiredAgo || reason === 'used') && (
            <dl className="grid grid-cols-2 gap-2">
              {createdAgo && (
                <StatRow label="Created" tick="bg-up" value={createdAgo} />
              )}
              {reason === 'used' ? (
                <StatRow label="Type" tick="bg-danger" value="One-time, already opened" valueClass="text-danger" />
              ) : (
                expiredAgo && <StatRow label="Expired" tick="bg-danger" value={expiredAgo} valueClass="text-danger" />
              )}
            </dl>
          )}
          <button type="button" onClick={() => setStep('form')} className={primaryButtonClass}>
            Request access
          </button>
        </div>
      </GateShell>
    );
  }

  return (
    <GateShell
      repoFullName={repoFullName}
      status={status}
      statusTone="danger"
      icon="plus"
      tone="accent"
      title="Request access."
      blurb="Your email and note go to the person who created this link. If they approve, they'll send you a new link."
      foot="The owner sees the address you enter so they know where to send the new link. No account needed."
    >
      {isMounted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" autoComplete="off">
          <input type="hidden" name="shareId" value={shareId} />

          <label htmlFor="email" className="sr-only">
            Your email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@company.com"
            required
            autoFocus
            data-1p-ignore="true"
            data-lpignore="true"
            autoComplete="off"
            className={inputClass}
          />

          <label htmlFor="message" className="sr-only">
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Why you need it (optional)"
            className={textareaClass}
          />

          {error && <ErrorLine>{error}</ErrorLine>}

          <button type="submit" disabled={isLoading} className={primaryButtonClass}>
            {isLoading && <Spinner />}
            {isLoading ? 'Sending…' : 'Send request'}
          </button>

          <button
            type="button"
            onClick={() => setStep('info')}
            className={secondaryButtonClass}
          >
            Back
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3" aria-hidden="true">
          <div className="h-12 w-full rounded-xl bg-surface-2" />
          <div className="h-[94px] w-full rounded-xl bg-surface-2" />
          <div className="h-12 w-full rounded-full bg-surface-2" />
          <div className="h-12 w-full rounded-full border border-line" />
        </div>
      )}
    </GateShell>
  );
}
