import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {

  const session = await auth();

  if (!session || !session.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { repoFullName, expiresIn, password, isOneTime, allowCopying } = await request.json();
  if (!repoFullName || typeof repoFullName !== 'string') {
    return new NextResponse(JSON.stringify({ error: "Repository name not provided" }), { status: 400 });
  }

  let expiresAt: Date | null = null;
  if (expiresIn === '1-hour') {
    expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  } else if (expiresIn === '24-hours') {
    expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else if (expiresIn === '7-days') {
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  let hashedPassword: string | null = null;
  if (password && typeof password === 'string'&& password.length > 0) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  try {
  const newShareLink = await prisma.$transaction(
    async (
      tx: Omit<
        PrismaClient,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >
    ) => {

      const user = await tx.user.findUnique({
        where: { id: session.user!.id },
      });

      if (!user || user.credits <= 0) {
        // By throwing an error here, the transaction will be rolled back.
        throw new Error("Insufficient credits.");
      }

      await tx.user.update({
        where: { id: session.user!.id },
        data: { credits: { decrement: 1 } },
      });

      const shareLink = await tx.shareLink.create({
        data: {
          repoFullName: repoFullName,
          userId: session.user!.id as string,
          expiresAt: expiresAt,
          hashedPassword: hashedPassword,
          isOneTime: !!isOneTime,
          allowCopying: allowCopying ?? false,
        },
      });

      return shareLink;
    });

    return new NextResponse(JSON.stringify(newShareLink), { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message === "Insufficient credits.") {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 402 });
    }
    console.log(error);

    return new NextResponse(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
  }
}