'use client';
import { useState } from 'react';
import { Button, Chip, Tile } from '@/components/kit';
import { PendingRequest } from './types';
import { timeAgo } from './format';

type PendingRequestsTableProps = {
    requests: PendingRequest[];
    /** requestId → URL of the fresh link created on approval. */
    approvedLinks: Record<string, string>;
    loadingId: string | null;
    onApprove: (requestId: string, originalLinkId: string) => void;
    onDismiss: (requestId: string) => void;
    id?: string;
};

/** Readers asking for access to an ended link. Approving creates a new 7-day link, free. */
export default function PendingRequestsTable({
    requests,
    approvedLinks,
    loadingId,
    onApprove,
    onDismiss,
    id,
}: PendingRequestsTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const waiting = requests.filter((r) => !approvedLinks[r.id]).length;

    const copy = async (requestId: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(requestId);
            setTimeout(() => setCopiedId((cur) => (cur === requestId ? null : cur)), 1500);
        } catch (e) {
            console.error('Clipboard write failed', e);
        }
    };

    return (
        <Tile
            id={id}
            tone="glass"
            className="min-w-0"
            title={
                <span className="flex items-baseline gap-2">
                    Access requests
                    <span className="text-[13px] font-normal tabular-nums text-ink-3">
                        {waiting > 0 ? `${waiting} waiting` : 'none waiting'}
                    </span>
                </span>
            }
            actions={<span className="hidden text-xs text-ink-3 sm:inline">Approving creates a new 7-day link, free</span>}
        >
            {requests.length === 0 ? (
                <div className="rounded-[18px] bg-white/[.04] px-5 py-12 text-center">
                    <p className="text-[15px] font-medium text-ink">No one is waiting on you.</p>
                    <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-3">
                        When a reader opens a link that has expired or already been used, they can ask you for access.
                        Their request shows up here.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {requests.map((request) => {
                        const approvedUrl = approvedLinks[request.id];
                        const loading = loadingId === request.id;
                        const ref = request.shareLink.ref;
                        return (
                            <li key={request.id} className="rounded-[18px] bg-white/[.04] p-4">
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                                    <span
                                        aria-hidden="true"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-surface text-sm font-semibold text-ink"
                                    >
                                        {request.viewerEmail.slice(0, 1).toUpperCase()}
                                    </span>
                                    <div className="min-w-0 flex-1 basis-[200px]">
                                        <div className="truncate text-sm font-medium text-ink" title={request.viewerEmail}>
                                            {request.viewerEmail}
                                        </div>
                                        <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
                                            <span className="truncate">{request.shareLink.repoFullName}</span>
                                            {ref && ref !== 'main' && <Chip>{ref}</Chip>}
                                            <span title={new Date(request.createdAt).toLocaleString()}>· {timeAgo(request.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-1.5">
                                        {approvedUrl ? (
                                            <Chip tone="up" dot>
                                                Approved
                                            </Chip>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDismiss(request.id)}
                                                    disabled={loading}
                                                    title="Hide this request for now. It isn't declined and will be back after a reload."
                                                >
                                                    Dismiss
                                                </Button>
                                                <Button size="sm" onClick={() => onApprove(request.id, request.shareLinkId)} disabled={loading}>
                                                    {loading ? 'Approving…' : 'Approve'}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {request.message && (
                                    <p className="mt-3 rounded-xl bg-white/[.04] px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-2" title={request.message}>
                                        &ldquo;{request.message}&rdquo;
                                    </p>
                                )}

                                {approvedUrl && (
                                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-up-soft px-3.5 py-2">
                                        <span className="shrink-0 text-[13px] font-medium text-up">New 7-day link</span>
                                        <span className="min-w-0 flex-1 select-all truncate text-xs text-ink">{approvedUrl}</span>
                                        <Button variant="secondary" size="sm" onClick={() => copy(request.id, approvedUrl)}>
                                            {copiedId === request.id ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <p className="mt-4 text-xs text-ink-4">Readers are not told when you dismiss a request.</p>
        </Tile>
    );
}
