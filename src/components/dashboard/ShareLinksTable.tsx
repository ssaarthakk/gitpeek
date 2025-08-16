'use client';
import {
    Card,
    CardHeader,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Button,
    Skeleton
} from '@heroui/react';
import { useToast } from '@/hooks/useToast';

type ShareLink = {
    id: string;
    repoFullName: string;
    createdAt: string;
    expiresAt: string | null;
};

type ShareLinksTableProps = {
    shareLinks: ShareLink[];
    shareLinksLoading: boolean;
    onDeleteConfirm: (link: ShareLink) => void;
};

export default function ShareLinksTable({
    shareLinks,
    shareLinksLoading,
    onDeleteConfirm
}: ShareLinksTableProps) {
    const toast = useToast();

    const copyToClipboard = async (linkId: string) => {
        const fullLink = `${window.location.origin}/view/${linkId}`;
        await navigator.clipboard.writeText(fullLink);
        toast.success('Link copied to clipboard!');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    return (
        <Card className="bg-white/5 border border-white/10">
            <CardHeader>
                <h3 className="text-xl font-semibold text-white">Your Share Links</h3>
            </CardHeader>
            <CardBody>
                {shareLinksLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : shareLinks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-white/50">No share links created yet</p>
                        <p className="text-sm text-white/30">Create your first share link to get started</p>
                    </div>
                ) : (
                    <Table
                        aria-label="Share links table"
                        classNames={{
                            wrapper: "bg-transparent",
                            th: "bg-white/5 text-white/90 border-b border-white/10",
                            td: "text-white/80 border-b border-white/5"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>Repository</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Created</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {shareLinks.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell>
                                        <div className="font-mono text-sm">{link.repoFullName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            color={isExpired(link.expiresAt) ? "danger" : "success"}
                                            variant="flat"
                                        >
                                            {isExpired(link.expiresAt) ? "Expired" : "Active"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{formatDate(link.createdAt)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Tooltip content="Copy link">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => copyToClipboard(link.id)}
                                                    className="text-white/70 hover:text-white"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Delete link">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => onDeleteConfirm(link)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
}
