'use client'

import { useState } from 'react';
import { Button, Card, CardBody } from "@heroui/react";
import { approveAccessRequest } from '@/actions/approveRequest';

export default function PendingRequestsTable({ requests }: { requests: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [approvedLinks, setApprovedLinks] = useState<Record<string, string>>({});

    const handleApprove = async (requestId: string, originalLinkId: string) => {
        setLoadingId(requestId);
        const result = await approveAccessRequest(requestId, originalLinkId);

        if (result.success && result.newLinkId) {
            setApprovedLinks(prev => ({
                ...prev,
                [requestId]: `${window.location.origin}/view/${result.newLinkId}`
            }));
        }
        setLoadingId(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
                <Card key={request.id} className="bg-white/5 border border-white/10 shadow-lg relative overflow-hidden">
                    {/* Decorative blur effect similar to dashboard theme */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

                    <CardBody className="p-5 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-full">
                                <p className="text-sm text-white/50 font-mono mb-1 truncate">
                                    {request.shareLink.repoFullName}
                                    {request.shareLink.ref !== 'main' && ` (${request.shareLink.ref})`}
                                </p>
                                <h3 className="font-bold text-lg text-white">{request.viewerEmail}</h3>
                                {request.message && (
                                    <div className="mt-3 bg-white/5 rounded-lg p-3 border border-white/5 border-l-2 border-l-primary/50">
                                        <p className="text-sm text-white/70 italic">
                                            "{request.message}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10">
                            {approvedLinks[request.id] ? (
                                <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                                    <p className="text-xs text-success/90 font-bold mb-1">Access Granted! Share this new link:</p>
                                    <code className="text-xs text-success-500 break-all select-all font-mono">
                                        {approvedLinks[request.id]}
                                    </code>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        color="primary"
                                        className="font-semibold shadow-lg shadow-primary/20"
                                        isLoading={loadingId === request.id}
                                        onClick={() => handleApprove(request.id, request.shareLinkId)}
                                    >
                                        Approve & Generate Link
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        className="bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}