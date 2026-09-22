import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { linkState } from "@/components/dashboard/types";

/*
 * Aggregated, read-only numbers for the dashboard charts:
 * views per day, per-repo sparklines, links by status, pending requests.
 * Only counts are returned — never IPs, user agents, emails or password hashes.
 */

const DAY = 24 * 60 * 60 * 1000;
const RANGES = { "7d": 7, "30d": 30, "90d": 90 } as const;
type Range = keyof typeof RANGES | "all";

function dayKey(d: Date) {
    return d.toISOString().slice(0, 10);
}

function startOfUtcDay(t: number) {
    const d = new Date(t);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const param = new URL(request.url).searchParams.get("range");
    const range: Range = param === "all" || (param && param in RANGES) ? (param as Range) : "30d";

    try {
        const now = Date.now();
        const today = startOfUtcDay(now);

        const [links, pendingRequests] = await Promise.all([
            prisma.shareLink.findMany({
                where: { userId },
                select: {
                    id: true,
                    repoFullName: true,
                    createdAt: true,
                    expiresAt: true,
                    isOneTime: true,
                    _count: { select: { linkViews: true } },
                },
            }),
            prisma.accessRequest.count({
                where: { status: "pending", shareLink: { userId } },
            }),
        ]);

        const firstLink = links.reduce<number | null>(
            (min, l) => (min === null || l.createdAt.getTime() < min ? l.createdAt.getTime() : min),
            null,
        );
        const days =
            range === "all"
                ? Math.max(7, Math.min(365, firstLink ? Math.ceil((today - startOfUtcDay(firstLink)) / DAY) + 1 : 7))
                : RANGES[range];
        const periodStart = today - (days - 1) * DAY;
        // Previous period of the same length, for the delta pill.
        const prevStart = periodStart - days * DAY;

        const views = await prisma.linkView.findMany({
            where: { shareLink: { userId }, createdAt: { gte: new Date(Math.min(prevStart, today - 13 * DAY)) } },
            select: { createdAt: true, shareLink: { select: { repoFullName: true } } },
        });

        // Views per day in the selected period, zero-filled.
        const perDay = new Map<string, number>();
        for (let i = 0; i < days; i++) perDay.set(dayKey(new Date(periodStart + i * DAY)), 0);
        let current = 0;
        let previous = 0;
        for (const v of views) {
            const t = v.createdAt.getTime();
            if (t >= periodStart) {
                current++;
                const k = dayKey(v.createdAt);
                if (perDay.has(k)) perDay.set(k, (perDay.get(k) ?? 0) + 1);
            } else if (t >= prevStart) {
                previous++;
            }
        }
        const viewsByDay = [...perDay.entries()].map(([date, count]) => ({ date, views: count }));

        // Per-repo totals (all time) and a 14-day sparkline.
        const sparkStart = today - 13 * DAY;
        const repos = new Map<string, { repoFullName: string; links: number; views: number; spark: number[] }>();
        for (const l of links) {
            const r = repos.get(l.repoFullName) ?? { repoFullName: l.repoFullName, links: 0, views: 0, spark: Array(14).fill(0) };
            r.links++;
            r.views += l._count.linkViews;
            repos.set(l.repoFullName, r);
        }
        for (const v of views) {
            const t = v.createdAt.getTime();
            if (t < sparkStart) continue;
            const r = repos.get(v.shareLink.repoFullName);
            if (!r) continue;
            const idx = Math.floor((startOfUtcDay(t) - sparkStart) / DAY);
            if (idx >= 0 && idx < 14) r.spark[idx]++;
        }
        const byRepo = [...repos.values()].sort((a, b) => b.views - a.views || b.links - a.links).slice(0, 8);

        // Links by status (same rules as the dashboard table and the view page).
        const linksByStatus = { live: 0, expiring: 0, expired: 0, used: 0 };
        for (const l of links) {
            linksByStatus[
                linkState({ expiresAt: l.expiresAt ? l.expiresAt.toISOString() : null, isOneTime: l.isOneTime, _count: l._count }, now)
            ]++;
        }

        return NextResponse.json({
            range,
            viewsByDay,
            totals: {
                views: current,
                previousViews: previous,
                allTimeViews: links.reduce((s, l) => s + l._count.linkViews, 0),
                links: links.length,
            },
            byRepo,
            linksByStatus,
            pendingRequests,
        });
    } catch (error) {
        console.error("Failed to compute link stats:", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
