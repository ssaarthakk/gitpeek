'use client';

import { useFormStatus } from 'react-dom';
import { verifyViewerEmail } from '@/app/actions/verifyEmail';
import { Input, Button, Card, CardBody } from '@heroui/react';
import { EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// A small submit button component to handle the loading state automatically
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            color="primary"
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium mt-2"
            isLoading={pending}
        >
            {pending ? 'Verifying...' : 'View Repository'}
        </Button>
    );
}

export default function EmailVerificationForm({ shareId }: { shareId: string }) {
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

                    <form action={verifyViewerEmail} className="space-y-4">
                        <input type="hidden" name="shareId" value={shareId} />

                        <Input
                            type="email"
                            id="email"
                            name="email"
                            label="Email Address"
                            placeholder="recruiter@company.com"
                            isRequired
                            classNames={{
                                inputWrapper: 'bg-white/10 border-white/20',
                                input: 'text-white',
                                label: 'text-white/70',
                            }}
                            startContent={
                                <EnvelopeIcon className="h-5 w-5 text-white/50 pointer-events-none" />
                            }
                        />

                        <SubmitButton />
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}