'use client';
import { useState, useEffect, useCallback } from 'react';
import { Session } from 'next-auth';
import { Spacer, useDisclosure } from '@heroui/react';
import { useToast } from '@/hooks/useToast';
import useRepos from '@/hooks/useRepo';
import axios from '@/lib/api';

// Import modular components
import UserInfoCard from './UserInfoCard';
import CreditsCard from './CreditsCard';
import RepositoryStatsCard from './RepositoryStatsCard';
import RepositorySelector from './RepositorySelector';
import ShareLinksTable from './ShareLinksTable';
import CreateShareModal from './CreateShareModal';
import DeleteConfirmModal from './DeleteConfirmModal';

type DashboardContentProps = {
    session: Session;
    isInstalled: boolean;
    isLoadingInstall: boolean;
    openInstallationWindow: () => void;
};

type ShareLink = {
    id: string;
    repoFullName: string;
    createdAt: string;
    expiresAt: string | null;
};

export default function DashboardContent({ 
    session, 
    isInstalled, 
    isLoadingInstall, 
    openInstallationWindow 
}: DashboardContentProps) {
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
    
    // Modal controls
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isShareModalOpen,
        onOpen: onShareModalOpen,
        onOpenChange: onShareModalOpenChange
    } = useDisclosure();

    const fetchShareLinks = useCallback(async () => {
        try {
            const response = await axios.get('/api/links');
            setShareLinks(response.data);
        } catch (error) {
            console.error('Failed to fetch share links:', error);
            toast.error('Failed to load share links');
        } finally {
            setShareLinksLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchShareLinks();
    }, [fetchShareLinks]);

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

        } catch (error: unknown) {
            let message = 'Failed to create share link';
            if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as { response?: { data?: { error?: string } } }).response;
                message = response?.data?.error || message;
            }
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
            console.error('Failed to delete share link:', error);
            toast.error('Failed to delete share link');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDeleteShareLink = (link: ShareLink) => {
        setLinkToDelete(link);
        onOpen();
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
                <UserInfoCard session={session} />
                <CreditsCard session={session} />
                <RepositoryStatsCard 
                    reposLoading={reposLoading} 
                    totalRepos={repos.length} 
                />
            </div>

            <Spacer y={4} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RepositorySelector
                    session={session}
                    repos={repos}
                    reposLoading={reposLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedRepo={selectedRepo}
                    setSelectedRepo={setSelectedRepo}
                    onCreateShareLink={handleCreateShareLink}
                    isInstalled={isInstalled}
                    isLoadingInstall={isLoadingInstall}
                    openInstallationWindow={openInstallationWindow}
                />

                <ShareLinksTable
                    shareLinks={shareLinks}
                    shareLinksLoading={shareLinksLoading}
                    onDeleteConfirm={confirmDeleteShareLink}
                />
            </div>

            {/* Modals */}
            <CreateShareModal
                isOpen={isShareModalOpen}
                onOpenChange={onShareModalOpenChange}
                selectedRepo={selectedRepo}
                selectedExpiry={selectedExpiry}
                setSelectedExpiry={setSelectedExpiry}
                onCreateShareLink={createShareLinkWithExpiry}
                isCreating={isCreatingShare}
            />

            <DeleteConfirmModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                linkToDelete={linkToDelete}
                onConfirmDelete={handleDeleteShareLink}
                isDeleting={isDeleting}
            />
        </div>
    );
}
