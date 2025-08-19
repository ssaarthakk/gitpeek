import prisma from "@/lib/prisma";
import RepoContentView from "@/components/RepoContentView";
import { createInstallationToken } from '@/lib/github';

export default async function SharePageView({ params }: { params: Promise<{ shareId: string }> }) {

    const { shareId } = await params;

    const shareLink = await prisma.shareLink.findUnique({
        where: { id: shareId },
    });

    if (!shareLink || (shareLink.expiresAt && shareLink.expiresAt < new Date())) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="font-bold text-2xl">Link not found or has expired. Please request a new link.</h1>
            </div>
        );
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

        return (
            <main className="flex h-screen w-screen">
                <RepoContentView
                    repoFullName={shareLink.repoFullName}
                    accessToken={freshInstallationToken}
                />
            </main>
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