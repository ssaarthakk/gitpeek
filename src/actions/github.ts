'use server'

import { createInstallationToken } from "@/lib/github";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getRepoBranches(repoFullName: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const account = await prisma.account.findFirst({
        where: { userId: session.user?.id, provider: 'github' }
    });

    if (!account?.installation_id) throw new Error("GitHub App not installed");

    const token = await createInstallationToken(account.installation_id);
    const [owner, repo] = repoFullName.split('/');

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'GitPeek-App'
        }
    });

    if (!response.ok) throw new Error("Failed to fetch branches");

    const data = await response.json();
    return data.map((b: any) => b.name);
}