'use server'

import prisma from "@/lib/prisma";

export async function getPendingRequests(userId: string) {
    const pendingRequests = await prisma.accessRequest.findMany({
        where: {
            status: 'pending',
            shareLink: {
                userId: userId
            }
        },
        include: {
            shareLink: true
        },
        orderBy: { createdAt: 'desc' }
    });
    return pendingRequests;
}
