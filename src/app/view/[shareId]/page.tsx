import prisma from "@/lib/prisma";
import { createInstallationToken } from '@/lib/github';
import ProtectedRepoView from '@/components/ProtectedRepoView';
import EmailVerificationForm from '@/components/verifyEmail/EmailVerificationForm';
import RequestAccessForm from '@/components/view/RequestAccessForm';
import { headers, cookies } from 'next/headers';
import { Metadata } from 'next';
import { cache } from 'react';

const getShareLink = cache(async (shareId: string) => {
    return await prisma.shareLink.findUnique({
        where: { id: shareId },
        include: {
            _count: {
                select: { linkViews: true },
            },
        },
    });
});

export async function generateMetadata({ params }: { params: Promise<{ shareId: string }> }): Promise<Metadata> {
    const { shareId } = await params;
    const shareLink = await getShareLink(shareId);

    if (shareLink) {
        return {
            title: `${shareLink.repoFullName} - Shared via GitPeek`,
            description: `View and explore the ${shareLink.repoFullName} repository shared securely with GitPeek. Browse code, files, and documentation in a clean, read-only interface.`,
        };
    }

    return {
        title: 'GitPeek - Repository View',
        description: 'View shared GitHub repositories securely with GitPeek. Access code, files, and documentation in a clean, read-only interface.',
    };
}

export default async function SharePageView({ params }: { params: Promise<{ shareId: string }> }) {

    const { shareId } = await params;
    const shareLink = await getShareLink(shareId);



    if (!shareLink) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="font-bold text-2xl">Link not found.</h1>
            </div>
        );
    }

    const isExpired = shareLink.expiresAt ? new Date() > shareLink.expiresAt : false;
    const isOneTimeExhausted = shareLink.isOneTime && shareLink._count.linkViews >= 1;

    if (isExpired || isOneTimeExhausted) {
        // if (isOneTimeExhausted) {
        //     prisma.shareLink.delete({ where: { id: shareLink.id } }).catch(err =>
        //         console.error("Failed to clean up one-time link:", err)
        //     );
        // }
        return <RequestAccessForm shareId={shareLink.id} />;
    }

    const cookieStore = await cookies();
    const viewerEmail = cookieStore.get('gitpeek_viewer_email')?.value;

    if (shareLink.requireEmail && !viewerEmail) {
        return <EmailVerificationForm shareId={shareLink.id} />;
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
                viewerEmail: viewerEmail || null,
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
                allowCopying={shareLink.allowCopying}
                branch={shareLink.ref}
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