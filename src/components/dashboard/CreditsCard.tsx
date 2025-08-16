'use client';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { Session } from 'next-auth';

type CreditsCardProps = {
    session: Session;
};

export default function CreditsCard({ session }: CreditsCardProps) {
    return (
        <Card className="bg-white/5 border border-white/10">
            <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-white">Available Credits</h3>
            </CardHeader>
            <CardBody className="pt-0 flex items-center justify-center">
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-indigo-400">
                        {session.user?.credits || 0}
                    </span>
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        as="a"
                        href="/dashboard/billing"
                    >
                        Add Credits
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
