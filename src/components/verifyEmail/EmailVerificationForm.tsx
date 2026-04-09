'use client';

import { useTransition, useEffect, useState } from 'react';
import { verifyViewerEmail } from '@/actions/verifyEmail';
import { Input, Button, Card, CardBody, Spinner } from '@heroui/react';
import { EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function EmailVerificationForm({ shareId }: { shareId: string }) {
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

    if (!mounted) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0b0f14] via-[#14181e] to-[#0b0f14]">
                 <Spinner color="primary" size="lg" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0b0f14] via-[#14181e] to-[#0b0f14]">
            <Card className="w-full max-w-md bg-[#161b22] border border-white/10">
                <CardBody className="gap-6 p-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Secure Repository
                            </h1>
                            <p className="text-white/70 text-sm">
                                The developer has requested your email address to grant access to this code.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                        <input type="hidden" name="shareId" defaultValue={shareId} />

                        <Input
                            type="email"
                            id="email"
                            name="email"
                            label="Email Address"
                            placeholder="recruiter@company.com"
                            isRequired
                            autoComplete="email"
                            suppressHydrationWarning
                            classNames={{
                                inputWrapper: 'bg-white/10 border-white/20',
                                input: 'text-white',
                                label: 'text-white/70',
                            }}
                            startContent={
                                <EnvelopeIcon className="h-5 w-5 text-white/50 pointer-events-none" />
                            }
                        />

                        <Button
                            type="submit"
                            color="primary"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium mt-2"
                            isLoading={isPending}
                        >
                            {isPending ? 'Verifying...' : 'View Repository'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}