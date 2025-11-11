import { NextResponse } from 'next/server';
import { createInstallationToken } from '@/lib/github';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { slug: string[] } }
) {
    const [shareId, ref] = params.slug;

    if (!shareId || !ref) {
        return new NextResponse(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const shareLink = await prisma.shareLink.findUnique({
        where: { id: shareId },
    });

    if (!shareLink || !shareLink.allowCopying) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const account = await prisma.account.findFirst({
        where: { userId: shareLink.userId, provider: 'github' },
    });
    if (!account?.installation_id) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const token = await createInstallationToken(account.installation_id);
    const [owner, repo] = shareLink.repoFullName.split('/');

    // Fetch the ZIP file from GitHub
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${ref}`;
    const response = await fetch(zipUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch ZIP' }), { status: 500 });
    }

    return new Response(response.body, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${repo}-${ref}.zip"`,
        },
    });
}