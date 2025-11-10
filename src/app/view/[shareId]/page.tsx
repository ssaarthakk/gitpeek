import prisma from "@/lib/prisma";
import { createInstallationToken } from '@/lib/github';
import ProtectedRepoView from '@/components/ProtectedRepoView';
import { headers } from 'next/headers';

export default async function SharePageView({ params }: { params: Promise<{ shareId: string }> }) {

    const { shareId } = await params;

    const shareLink = await prisma.shareLink.findUnique({
        where: { id: shareId },
        include: {
            _count: {
                select: { linkViews: true },
            },
        },
    });

    if (!shareLink || (shareLink.expiresAt && shareLink.expiresAt < new Date())) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="font-bold text-2xl">Link not found or has expired. Please request a new link.</h1>
            </div>
        );
    }

    const viewCount = shareLink._count.linkViews;

    if (shareLink.isOneTime && viewCount > 0) {
        // This link has been viewed before. It is now invalid.
        // We can delete it in the background to clean up the DB.
        prisma.shareLink.delete({ where: { id: shareLink.id } }).catch(err =>
            console.error("Failed to clean up one-time link:", err)
        );
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="rounded-xl shadow-2xl bg-white/5 p-8 flex flex-col items-center border border-white/10 max-w-md w-full">
                    <h1 className="font-bold text-2xl text-white mb-3 text-center">This link has been used and is no longer valid.</h1>
                    <p className="text-white/70 text-center mb-2">For security, one-time links can only be viewed once.</p>
                    <p className="text-white/40 text-center text-sm">Please request a new link if you need access again.</p>
                </div>
            </div>
        );
    }

    try {
        const headersList = await headers();
        const userAgent = headersList.get('user-agent');
        const ipAddress = headersList.get('x-forwarded-for');

        // Asynchronously create a new view record. We don't need to
        // "await" this, as we don't want it to block the page load.
        prisma.linkView.create({
            data: {
                shareLinkId: shareLink.id,
                userAgent: userAgent,
                ipAddress: ipAddress,
            },
        }).catch((err: any) => console.error("Failed to log view:", err)); // Log errors
    } catch (error) {
        console.error("Analytics logging error:", error);
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: shareLink.userId,
            provider: 'github',
        },
    });

    if (!account?.installation_token) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="font-bold text-2xl">Could not retrieve permission to view this repository.</h1>
            </div>
        );
    }

    try {
        const freshInstallationToken = await createInstallationToken(account.installation_id!);

        const isPasswordProtected = !!shareLink.hashedPassword;

        return (
            <ProtectedRepoView
                shareId={shareId}
                repoFullName={shareLink.repoFullName}
                accessToken={freshInstallationToken}
                isPasswordProtected={isPasswordProtected}
                isInitiallyVerified={false}
            />
        );
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message?: unknown }).message === "string" &&
            (error as { message: string }).message.includes("Could not create GitHub installation token")
        ) {
            await prisma.account.update({
                where: { id: account.id },
                data: {
                    installation_id: null,
                    installation_token: null,
                },
            });
            return (
                <div className="flex h-screen w-screen items-center justify-center">
                    <h1 className="font-bold text-2xl">Access has been revoked. The link is no longer valid.</h1>
                </div>
            );
        }
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="font-bold text-2xl">Could not retrieve permission to view this repository.</h1>
            </div>
        );
    }
}