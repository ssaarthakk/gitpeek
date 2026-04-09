import { NextResponse } from 'next/server';
import { createInstallationToken } from "@/lib/github";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoFullName = searchParams.get('repo');
  
  const session = await auth(); 

  if (!session || !repoFullName) {
    return NextResponse.json({ error: "Unauthorized or missing repo" }, { status: 401 });
  }

  try {
    const account = await prisma.account.findFirst({
      where: { userId: session.user?.id, provider: 'github' }
    });

    if (!account?.installation_id) {
      return NextResponse.json({ error: "GitHub App not installed" }, { status: 403 });
    }

    const token = await createInstallationToken(account.installation_id);

    const [owner, repo] = repoFullName.split('/');
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2026-03-10',
        'User-Agent': 'GitPeek-App'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'GitHub API error');
    }

    const branches = await response.json();

    return NextResponse.json(branches.map((b: any) => b.name));
    
  } catch (error: any) {
    console.error("Fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}