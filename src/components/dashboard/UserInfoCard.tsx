'use client';
import { Card, CardHeader, Avatar } from '@heroui/react';
import { Session } from 'next-auth';

type UserInfoCardProps = {
    session: Session;
};

export default function UserInfoCard({ session }: UserInfoCardProps) {
    return (
        <Card className="bg-white/5 border border-white/10">
            <CardHeader className="pb-3 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
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
    );
}
