import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { id: shareId },
    });

    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
    }

    if (!shareLink.hashedPassword) {
      return NextResponse.json({ error: 'This link is not password protected' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, shareLink.hashedPassword);

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
