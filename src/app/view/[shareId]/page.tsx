import prisma from "@/lib/prisma";
import { createInstallationToken } from '@/lib/github';
import ProtectedRepoView from '@/components/ProtectedRepoView';
import EmailVerificationForm from '@/components/verifyEmail/EmailVerificationForm';
import RequestAccessForm from '@/components/view/RequestAccessForm';
import GateShell from '@/components/view/GateShell';
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
            user: {
                select: { name: true },
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

/** Timezone-independent relative time ("2 hours ago", "yesterday"), safe to render on the server. */
function timeAgo(date: Date, now: Date = new Date()): string {
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
}

function NoPermissionGate({ repoFullName }: { repoFullName: string }) {
    return (
        <GateShell
            repoFullName={repoFullName}
            status="Unavailable"
            statusTone="danger"
            icon="alert"
            tone="danger"
            title="This repository can't be opened right now."
            blurb="GitPeek couldn't get permission from GitHub to read it. The person who shared the link may need to reconnect the GitPeek GitHub App."
            foot="Nothing is wrong on your side. Let the person who shared the link know."
        />
    );
}

export default async function SharePageView({ params }: { params: Promise<{ shareId: string }> }) {

    const { shareId } = await params;
    const shareLink = await getShareLink(shareId);

    if (!shareLink) {
        return (
            <GateShell
                icon="alert"
                tone="danger"
                title="This link doesn't exist."
                blurb="Check the address for typos, or ask the person who shared it to send it again."
                foot="GitPeek links are read-only views of a GitHub repository."
            />
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
        const now = new Date();
        return (
            <RequestAccessForm
                shareId={shareLink.id}
                repoFullName={shareLink.repoFullName}
                reason={isExpired ? 'expired' : 'used'}
                createdAgo={timeAgo(shareLink.createdAt, now)}
                expiredAgo={isExpired && shareLink.expiresAt ? timeAgo(shareLink.expiresAt, now) : undefined}
            />
        );
    }

    const cookieStore = await cookies();
    const viewerEmail = cookieStore.get('gitpeek_viewer_email')?.value;

    if (shareLink.requireEmail && !viewerEmail) {
        return <EmailVerificationForm shareId={shareLink.id} repoFullName={shareLink.repoFullName} />;
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
        return <NoPermissionGate repoFullName={shareLink.repoFullName} />;
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
                expiresAt={shareLink.expiresAt ? shareLink.expiresAt.toISOString() : null}
                isOneTime={shareLink.isOneTime}
                sharedBy={shareLink.user?.name ?? null}
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
                <GateShell
                    repoFullName={shareLink.repoFullName}
                    status="Revoked"
                    statusTone="danger"
                    icon="alert"
                    tone="danger"
                    title="Access to this repository was revoked."
                    blurb="The owner removed GitPeek's access to it on GitHub, so this link no longer works."
                    foot="Only the owner can restore access. Ask them for a new link if you still need it."
                />
            );
        }
        return <NoPermissionGate repoFullName={shareLink.repoFullName} />;
    }
}
