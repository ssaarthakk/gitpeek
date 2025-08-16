'use client';
import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Spacer,
    Listbox,
    ListboxItem,
    Avatar,
    User,
    Skeleton,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Select,
    SelectItem
} from '@heroui/react';
import { useToast } from '@/hooks/useToast';
import useRepos from '@/hooks/useRepo';
import axios from 'axios';

type DashboardContentProps = {
    session: Session;
};

type ShareLink = {
    id: string;
    repoFullName: string;
    createdAt: string;
    expiresAt: string | null;
};

export default function DashboardContent({ session }: DashboardContentProps) {
    const { repos, isLoading: reposLoading } = useRepos();
    const toast = useToast();
    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [shareLinksLoading, setShareLinksLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRepo, setSelectedRepo] = useState<string>('');
    const [linkToDelete, setLinkToDelete] = useState<ShareLink | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreatingShare, setIsCreatingShare] = useState(false);
    const [selectedExpiry, setSelectedExpiry] = useState<string>('never');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isShareModalOpen,
        onOpen: onShareModalOpen,
        onOpenChange: onShareModalOpenChange
    } = useDisclosure();

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchShareLinks();
    }, []);

    const fetchShareLinks = async () => {
        try {
            const response = await axios.get('/api/links');
            setShareLinks(response.data);
        } catch (error) {
            console.error('Failed to fetch share links:', error);
            toast.error('Failed to load share links');
        } finally {
            setShareLinksLoading(false);
        }
    };

    const handleCreateShareLink = async () => {
        if (!selectedRepo) {
            toast.error('Please select a repository');
            return;
        }
        onShareModalOpen();
    };

    const createShareLinkWithExpiry = async () => {
        if (!selectedRepo) return;

        setIsCreatingShare(true);
        try {
            const expiresIn = selectedExpiry === 'never' ? undefined : selectedExpiry;
            const response = await axios.post('/api/share', {
                repoFullName: selectedRepo,
                expiresIn
            });
            const newLink = response.data;
            setShareLinks(prev => [newLink, ...prev]);
            toast.success('Share link created successfully!');

            // Copy to clipboard
            const fullLink = `${window.location.origin}/view/${newLink.id}`;
            await navigator.clipboard.writeText(fullLink);
            toast.success('Link copied to clipboard!');

            onShareModalOpenChange(); // Close the modal
            setSelectedExpiry('never'); // Reset to default

        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to create share link';
            toast.error(message);
        } finally {
            setIsCreatingShare(false);
        }
    };

    const handleDeleteShareLink = async (linkId: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/share/${linkId}`);
            setShareLinks(prev => prev.filter(link => link.id !== linkId));
            toast.success('Share link deleted successfully!');
            onOpenChange(); // Close the modal
            setLinkToDelete(null);
        } catch (error) {
            toast.error('Failed to delete share link');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDeleteShareLink = (link: ShareLink) => {
        setLinkToDelete(link);
        onOpen();
    };

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
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, {session.user?.name?.split(' ')[0] || 'Developer'}!
                </h1>
                <p className="text-white/70">
                    Manage your repositories and share links from your dashboard
                </p>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border border-white/10">
                    <CardHeader className="pb-3 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <Avatar
                                src={session.user?.image || undefined}
                                name={session.user?.name || 'User'}
                                size="lg"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{session.user?.name}</h3>
                                <p className="text-sm text-white/70">{session.user?.email}</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="bg-white/5 border border-white/10">
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold text-white">Available Credits</h3>
                    </CardHeader>
                    <CardBody className="pt-0 flex items-center justify-center">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-indigo-400">
                                {session.user?.credits || 0}
                            </span>
                            <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                as="a"
                                href="/dashboard/billing"
                            >
                                Add Credits
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-white/5 border border-white/10">
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold text-white">Total Repositories</h3>
                    </CardHeader>
                    <CardBody className="pt-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-400">
                            {reposLoading ? '-' : repos.length}
                        </span>
                    </CardBody>
                </Card>
            </div>

            <Spacer y={4} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Repository Selection */}
                <Card className="bg-white/5 border border-white/10">
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-white">Your Repositories</h3>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <Input
                            placeholder="Search repositories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={
                                <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                            classNames={{
                                input: "text-white",
                                inputWrapper: "bg-white/10 border-white/20"
                            }}
                        />

                        {reposLoading ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                <Listbox
                                    aria-label="Repository selection"
                                    selectionMode="single"
                                    selectedKeys={selectedRepo ? [selectedRepo] : []}
                                    onSelectionChange={(keys) => {
                                        const selected = Array.from(keys)[0] as string;
                                        setSelectedRepo(selected);
                                    }}
                                    classNames={{
                                        base: "max-w-none",
                                    }}
                                >
                                    {filteredRepos.map((repo) => (
                                        <ListboxItem
                                            key={repo.full_name}
                                            textValue={repo.full_name}
                                            className="text-white/90 hover:bg-white/10 max-w-[98%]"
                                        >
                                            <div className="flex items-center gap-3 w-full min-w-0 pr-2">
                                                <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                    <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </div>
                                                <div className={`flex flex-col min-w-0 overflow-hidden ${repo.private ? 'max-w-[calc(100%-120px)]' : 'max-w-[calc(100%-60px)]'}`}>
                                                    <p className="font-medium text-white truncate">{repo.name}</p>
                                                    <div className="text-sm text-white/50 truncate max-w-md">{repo.description || 'No description'}</div>
                                                </div>
                                                {repo.private && (
                                                    <Chip
                                                        size="sm"
                                                        variant="flat"
                                                        color="warning"
                                                        className="absolute right-8 top-1/2 transform -translate-y-1/2"
                                                    >
                                                        Private
                                                    </Chip>
                                                )}
                                            </div>
                                        </ListboxItem>
                                    ))}
                                </Listbox>
                            </div>
                        )}

                        <Spacer y={2} />

                        <Button
                            color="primary"
                            size="lg"
                            onPress={handleCreateShareLink}
                            isDisabled={!selectedRepo || (session.user?.credits || 0) <= 0}
                            className="w-full"
                        >
                            Create Share Link ({session.user?.credits || 0} credits)
                        </Button>
                    </CardBody>
                </Card>

                {/* Share Links Table */}
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
                                                            onPress={() => confirmDeleteShareLink(link)}
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
            </div>

            {/* Create Share Link Modal */}
            <Modal
                isOpen={isShareModalOpen}
                onOpenChange={onShareModalOpenChange}
                classNames={{
                    base: "bg-[#161b22] border border-white/10",
                    header: "border-b border-white/10",
                    body: "py-6",
                    footer: "border-t border-white/10"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Create Share Link</h3>
                                        <p className="text-sm text-white/70">Generate a secure link to share your repository</p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <p className="text-white/90">
                                        Create a shareable link for the selected repository. Choose when the link should expire.
                                    </p>

                                    {selectedRepo && (
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-mono text-sm text-white font-medium">
                                                        {selectedRepo}
                                                    </p>
                                                    <p className="text-xs text-white/50">
                                                        Selected repository
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-white">
                                            Link Expiration
                                        </label>
                                        <Select
                                            selectedKeys={[selectedExpiry]}
                                            onSelectionChange={(keys) => {
                                                const selected = Array.from(keys)[0] as string;
                                                setSelectedExpiry(selected);
                                            }}
                                            classNames={{
                                                trigger: "bg-white/10 border-white/20 text-white",
                                                value: "text-white",
                                                popoverContent: "bg-[#161b22] border border-white/10"
                                            }}
                                        >
                                            <SelectItem key="never" className="text-white">
                                                Never (Permanent)
                                            </SelectItem>
                                            <SelectItem key="1-hour" className="text-white">
                                                1 Hour
                                            </SelectItem>
                                            <SelectItem key="24-hours" className="text-white">
                                                24 Hours
                                            </SelectItem>
                                            <SelectItem key="7-days" className="text-white">
                                                7 Days
                                            </SelectItem>
                                        </Select>
                                        <p className="text-xs text-white/50">
                                            {selectedExpiry === 'never'
                                                ? 'The link will remain active until manually deleted'
                                                : `The link will automatically expire after ${selectedExpiry.replace('-', ' ')}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="text-white/70 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={createShareLinkWithExpiry}
                                    isLoading={isCreatingShare}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isCreatingShare ? 'Creating...' : 'Create Share Link'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    base: "bg-[#161b22] border border-white/10",
                    header: "border-b border-white/10",
                    body: "py-6",
                    footer: "border-t border-white/10"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Delete Share Link</h3>
                                        <p className="text-sm text-white/70">This action cannot be undone</p>
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <p className="text-white/90">
                                        Are you sure you want to delete this share link? This will permanently remove the link and make it inaccessible to anyone who has it.
                                    </p>

                                    {linkToDelete && (
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-mono text-sm text-white font-medium">
                                                        {linkToDelete.repoFullName}
                                                    </p>
                                                    <p className="text-xs text-white/50">
                                                        Created: {new Date(linkToDelete.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Chip
                                                    size="sm"
                                                    color={linkToDelete.expiresAt && new Date(linkToDelete.expiresAt) < new Date() ? "danger" : "success"}
                                                    variant="flat"
                                                >
                                                    {linkToDelete.expiresAt && new Date(linkToDelete.expiresAt) < new Date() ? "Expired" : "Active"}
                                                </Chip>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    className="text-white/70 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => linkToDelete && handleDeleteShareLink(linkToDelete.id)}
                                    isLoading={isDeleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Link'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
