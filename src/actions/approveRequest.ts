'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveAccessRequest(requestId: string, originalLinkId: string) {
    try {
        const originalLink = await prisma.shareLink.findUnique({
            where: { id: originalLinkId }
        });

        if (!originalLink) throw new Error("Original link not found");

        const newLink = await prisma.$transaction(async (tx) => {
            await tx.accessRequest.update({
                where: { id: requestId },
                data: { status: 'approved' }
            });

            const freshLink = await tx.shareLink.create({
                data: {
                    repoFullName: originalLink.repoFullName,
                    userId: originalLink.userId,
                    ref: originalLink.ref,
                    rootPath: originalLink.rootPath,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    isOneTime: originalLink.isOneTime,
                    requireEmail: originalLink.requireEmail,
                }
            });

            return freshLink;
        });

        revalidatePath('/dashboard');

        return { success: true, newLinkId: newLink.id };

    } catch (error) {
        console.error("Failed to approve request:", error);
        return { error: "Failed to generate new link" };
    }
}