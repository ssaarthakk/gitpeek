import prisma from "@/lib/prisma";
import { Octokit } from "@octokit/core";
import RepoContentView from "@/components/RepoContentView";

export default async function SharePageView({ params }: { params: { shareId: string } }) {

    const shareId = await params.shareId;

    const shareLink = await prisma.shareLink.findUnique({
        where: { id: shareId },
    });

    if (!shareLink) {
        return <h1>Link not found or has expired.</h1>;
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: shareLink.userId,
            provider: 'github',
        },
    });

    if (!account?.access_token) {
        return <h1>Could not retrieve permission to view this repository.</h1>;
    }

    const accessToken = account.access_token;
    const repoFullName = shareLink.repoFullName;

    // We can pass the repoFullName to our existing component.
    // Note: For a fully public view, we would create a new version of RepoContentView 
    // that uses this server-provided access token instead of the session's token.
    // For now, this structure sets up the server-side data fetching.

    return (
        <main className="flex h-screen w-screen">
            {/* <h1>Viewing: {repoFullName}</h1>
            <p style={{ fontStyle: 'italic' }}>This is a shared, read-only view.</p> */}

            <RepoContentView
                repoFullName={repoFullName}
                accessToken={accessToken}
            />
        </main>
    );
}