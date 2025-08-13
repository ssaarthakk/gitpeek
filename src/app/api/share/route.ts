import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {

  const session = await auth();

  if (!session || !session.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { repoFullName } = await request.json();
  if (!repoFullName || typeof repoFullName !== 'string') {
    return new NextResponse(JSON.stringify({ error: "Repository name not provided" }), { status: 400 });
  }

  try {
    const newShareLink = await prisma.$transaction(async (tx) => {

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
        },
      });
      
      return shareLink;
    });

    return new NextResponse(JSON.stringify(newShareLink), { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message === "Insufficient credits.") {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 402 });
    }

    return new NextResponse(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
  }
}