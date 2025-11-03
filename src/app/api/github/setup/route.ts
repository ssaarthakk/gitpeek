import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { createInstallationToken } from '@/lib/github';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect('/');
  }

  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get('installation_id');

  if (!installationId) {
    return NextResponse.json({ error: 'Installation ID not found' }, { status: 400 });
  }

  try {
    const token = await createInstallationToken(installationId);
    
    await prisma.account.updateMany({
      where: { userId: session.user.id, provider: 'github' },
      data: {
        installation_id: installationId,
        installation_token: token
      },
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Installation Success</title></head>
        <body>
          <p>Installation successful! Closing...</p>
          <script>
            // Send the success message to the main window
            if (window.opener) {
              window.opener.postMessage('github_installation_success', '*');
            }
            window.close();
          </script>
        </body>
      </html>
    `;

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error("Failed to save installation:", error);
    return NextResponse.redirect(new URL('/dashboard?error=setup_failed', request.url));
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}