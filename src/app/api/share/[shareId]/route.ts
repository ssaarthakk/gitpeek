import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ shareId: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { shareId } = await params;

    try {
        // If a user tries to delete a link that isn't theirs, 'count' will be 0.
        const { count } = await prisma.shareLink.deleteMany({
            where: {
                id: shareId,
                userId: session.user.id,
            },
        });

        if (count === 0) {
            return new NextResponse(JSON.stringify({ error: "Link not found or you do not have permission to delete it." }), { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Failed to delete share link:", error);
        return new NextResponse(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
    }
}