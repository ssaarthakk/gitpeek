import prisma from "@/lib/prisma";
import RepoContentView from "@/components/RepoContentView";
import { getFreshAccessToken } from "@/lib/github";

export default async function SharePageView({ params }: { params: { shareId: string } }) {

    const { shareId } = await params;

    const shareLink = await prisma.shareLink.findUnique({
        where: { id: shareId },
    });

    if (!shareLink || (shareLink.expiresAt && shareLink.expiresAt < new Date())) {
        return <h1>Link not found or has expired.</h1>;
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: shareLink.userId,
            provider: 'github',
        },
    });

    if (!account?.installation_token) {
        return <h1>Could not retrieve permission to view this repository.</h1>;
    }

    const freshAccessToken = account.installation_token;
    const repoFullName = shareLink.repoFullName;

    return (
        <main className="flex h-screen w-screen">
            <RepoContentView
                repoFullName={repoFullName}
                accessToken={freshAccessToken}
            />
        </main>
    );
}