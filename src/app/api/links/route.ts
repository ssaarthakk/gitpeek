import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {

    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const res = await prisma.shareLink.findMany({
            where: {
                userId: session.user.id,
            },
        });

        if (res.length === 0) {
            return new NextResponse(JSON.stringify({ error: "No links founds for your account" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error("Failed to fetch links:", error);
        return new NextResponse(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
    }
}