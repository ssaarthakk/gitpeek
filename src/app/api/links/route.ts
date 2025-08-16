import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {

    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const links = await prisma.shareLink.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new NextResponse(JSON.stringify(links), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch links:", error);
        return new NextResponse(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
    }
}