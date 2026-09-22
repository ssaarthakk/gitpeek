'use client';

import { useTransition, useEffect, useState } from 'react';
import { verifyViewerEmail } from '@/actions/verifyEmail';
import GateShell, { Spinner, inputClass, primaryButtonClass } from '@/components/view/GateShell';

type EmailVerificationFormProps = {
    shareId: string;
    repoFullName?: string;
};

export default function EmailVerificationForm({ shareId, repoFullName }: EmailVerificationFormProps) {
    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            verifyViewerEmail(formData);
        });
    };

    return (
        <GateShell
            repoFullName={repoFullName}
            status="Email required"
            statusTone="accent"
            icon="mail"
            tone="accent"
            title="Enter your email to continue."
            blurb="The owner of this link asked to know who opens it. The address you enter is shared with them."
            foot="Your address is remembered on this device for 30 days, so you won't be asked again."
        >
            {mounted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3" suppressHydrationWarning>
                    <input type="hidden" name="shareId" defaultValue={shareId} />

                    <label htmlFor="email" className="sr-only">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@company.com"
                        required
                        autoComplete="email"
                        autoFocus
                        suppressHydrationWarning
                        className={inputClass}
                    />

                    <button type="submit" disabled={isPending} className={primaryButtonClass}>
                        {isPending && <Spinner />}
                        {isPending ? 'Opening…' : 'Continue to repository'}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col gap-3" aria-hidden="true">
                    <div className="h-12 w-full rounded-xl bg-surface-2" />
                    <div className="h-12 w-full rounded-full bg-surface-2" />
                </div>
            )}
        </GateShell>
    );
}
