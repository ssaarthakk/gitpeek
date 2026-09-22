// Shapes returned by GET /api/links and getPendingRequests().

export type ShareLink = {
    id: string;
    repoFullName: string;
    createdAt: string;
    expiresAt: string | null;
    ref?: string;
    isOneTime?: boolean;
    allowCopying?: boolean;
    requireEmail?: boolean;
    hashedPassword?: string | null;
    /** Not returned today; accepted so the API can stop sending the hash without breaking the badge. */
    hasPassword?: boolean;
    _count?: {
        linkViews: number;
    };
};

export type PendingRequest = {
    id: string;
    viewerEmail: string;
    message: string | null;
    createdAt: string | Date;
    shareLinkId: string;
    shareLink: {
        repoFullName: string;
        ref: string;
    };
};

export type ExpiryOption = 'never' | '1-hour' | '24-hours' | '7-days';

export type LinkState = 'live' | 'expiring' | 'expired' | 'used';

/**
 * live = works; expiring = under an hour left (amber);
 * expired / used (one-time link already opened) = ended (red).
 * Mirrors the checks in src/app/view/[shareId]/page.tsx.
 */
export function linkState(
    link: Pick<ShareLink, 'expiresAt' | 'isOneTime' | '_count'>,
    now = Date.now()
): LinkState {
    if (link.isOneTime && (link._count?.linkViews ?? 0) >= 1) return 'used';
    if (!link.expiresAt) return 'live';
    const left = new Date(link.expiresAt).getTime() - now;
    if (left <= 0) return 'expired';
    if (left < 60 * 60 * 1000) return 'expiring';
    return 'live';
}

export function hasPassword(link: Pick<ShareLink, 'hashedPassword' | 'hasPassword'>): boolean {
    return !!(link.hasPassword || link.hashedPassword);
}

/**
 * Dashboard grouping used by the overview numbers, the status bars and the links filter:
 * active = works for more than 24h; expiring = works, closes within 24h;
 * expired / used = ended. Built on linkState so it never disagrees with the view page.
 */
export type LinkBucket = 'active' | 'expiring' | 'expired' | 'used';

export function linkBucket(
    link: Pick<ShareLink, 'expiresAt' | 'isOneTime' | '_count'>,
    now = Date.now()
): LinkBucket {
    const state = linkState(link, now);
    if (state === 'expired' || state === 'used') return state;
    if (link.expiresAt && new Date(link.expiresAt).getTime() - now < 24 * 60 * 60 * 1000) return 'expiring';
    return 'active';
}

/** Sections of the signed-in dashboard; mirrored in the URL hash (#links, #requests). */
export type DashTab = 'overview' | 'links' | 'requests';
