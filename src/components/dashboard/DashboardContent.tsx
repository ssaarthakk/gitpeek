'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@heroui/react';
import { useToast } from '@/hooks/useToast';
import useRepos from '@/hooks/useRepo';
import useLinkStats from '@/hooks/useLinkStats';
import axios from '@/lib/api';

import DashboardNavbar from './DashboardNavbar';
import PerformanceTile from './PerformanceTile';
import RepoStrip from './RepoStrip';
import OverviewBottomRow from './OverviewBottomRow';
import NewLinkPanel, { NewLinkOptions } from './NewLinkPanel';
import ShareLinksTable from './ShareLinksTable';
import PendingRequestsTable from './PendingRequestsTable';
import LinkCreatedModal from './LinkCreatedModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getPendingRequests } from '@/actions/getPendingRequests';
import { approveAccessRequest } from '@/actions/approveRequest';
import { DashTab, ExpiryOption, PendingRequest, ShareLink, linkBucket } from './types';
import { sheetClassNames } from './ui';
import useNow from './useNow';

type DashboardContentProps = {
    session: Session;
    isInstalled: boolean;
    isLoadingInstall: boolean;
    openInstallationWindow: () => void;
};

/** URL hash ↔ section. #new opens the New link sheet on top of the overview. */
function readHash(): { tab: DashTab; openNew: boolean } {
    const h = typeof window === 'undefined' ? '' : window.location.hash.replace('#', '');
    if (h === 'links' || h === 'requests') return { tab: h, openNew: false };
    return { tab: 'overview', openNew: h === 'new' };
}

export default function DashboardContent({
    session,
    isInstalled,
    isLoadingInstall,
    openInstallationWindow,
}: DashboardContentProps) {
    const { update: refreshSession } = useSession();
    const { repos, isLoading: reposLoading } = useRepos();
    const toast = useToast();
    const toastRef = useRef(toast);
    toastRef.current = toast;
    const now = useNow();
    const linkStats = useLinkStats('30d');
    const refreshStats = linkStats.refresh;

    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [shareLinksLoading, setShareLinksLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRepo, setSelectedRepo] = useState<string>('');
    const [linkToDelete, setLinkToDelete] = useState<ShareLink | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreatingShare, setIsCreatingShare] = useState(false);
    const [selectedExpiry, setSelectedExpiry] = useState<ExpiryOption>('never');
    const [createdLink, setCreatedLink] = useState<ShareLink | null>(null);
    const [copiedOnCreate, setCopiedOnCreate] = useState(false);

    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [approvedLinks, setApprovedLinks] = useState<Record<string, string>>({});
    const [dismissed, setDismissed] = useState<Record<string, true>>({});
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const [tab, setTabState] = useState<DashTab>('overview');
    const sheet = useDisclosure();
    const openSheet = sheet.onOpen;

    // Deep links: /dashboard#links, #requests, #new. Back/forward switch sections too.
    useEffect(() => {
        const sync = () => {
            const { tab: t, openNew } = readHash();
            setTabState(t);
            if (openNew) {
                openSheet();
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        };
        sync();
        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        return () => {
            window.removeEventListener('hashchange', sync);
            window.removeEventListener('popstate', sync);
        };
    }, [openSheet]);

    const setTab = useCallback((t: DashTab) => {
        setTabState(t);
        const url = t === 'overview' ? window.location.pathname + window.location.search : `#${t}`;
        if (readHash().tab !== t) history.pushState(null, '', url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Credits come from the session; refreshSession() after a create picks up the new balance.
    const credits = session.user?.credits || 0;

    const fetchPendingRequests = useCallback(async () => {
        if (session?.user?.id) {
            try {
                const reqs = await getPendingRequests(session.user.id);
                setPendingRequests(reqs as unknown as PendingRequest[]);
            } catch (error) {
                console.error('Failed to fetch pending requests', error);
            }
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchPendingRequests();
    }, [fetchPendingRequests]);

    // Delete confirmation modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const fetchShareLinks = useCallback(async () => {
        try {
            const response = await axios.get('/api/links');
            setShareLinks(response.data);
        } catch (error) {
            console.error('Failed to fetch share links:', error);
            toastRef.current.error('Failed to load share links');
        } finally {
            setShareLinksLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShareLinks();
    }, [fetchShareLinks]);

    const openNewLink = useCallback(
        (repoFullName?: string) => {
            if (repoFullName) setSelectedRepo(repoFullName);
            openSheet();
        },
        [openSheet],
    );

    const createShareLink = async (options: NewLinkOptions): Promise<boolean> => {
        if (!selectedRepo) {
            toast.error('Please select a repository');
            return false;
        }

        setIsCreatingShare(true);
        try {
            const expiresIn = selectedExpiry === 'never' ? undefined : selectedExpiry;
            const response = await axios.post('/api/share', {
                repoFullName: selectedRepo,
                expiresIn,
                password: options.password || undefined,
                isOneTime: options.isOneTime || false,
                allowCopying: options.allowCopying,
                requireEmail: options.requireEmail || false,
                ref: options.branch || 'main',
            });
            const newLink: ShareLink = { _count: { linkViews: 0 }, ...response.data };
            setShareLinks((prev) => [newLink, ...prev]);

            // Copy to clipboard, as before. A failure here must not look like a failed create.
            let copied = false;
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/view/${newLink.id}`);
                copied = true;
                toast.success('Link copied to clipboard');
            } catch {
                /* the modal still offers a Copy button */
            }

            sheet.onClose();
            setCopiedOnCreate(copied);
            setCreatedLink(newLink);
            setSelectedExpiry('never'); // Reset to default
            refreshSession(); // pick up the new credit balance
            refreshStats();
            return true;
        } catch (error: unknown) {
            let message = 'Failed to create share link';
            if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as { response?: { data?: { error?: string } } }).response;
                message = response?.data?.error || message;
            }
            toast.error(message);
            return false;
        } finally {
            setIsCreatingShare(false);
        }
    };

    const handleDeleteShareLink = async (linkId: string) => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/share/${linkId}`);
            setShareLinks((prev) => prev.filter((link) => link.id !== linkId));
            toast.success('Link revoked');
            onOpenChange(); // Close the modal
            setLinkToDelete(null);
            refreshStats();
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

    const handleApprove = async (requestId: string, originalLinkId: string) => {
        setApprovingId(requestId);
        const result = await approveAccessRequest(requestId, originalLinkId);
        if (result.success && result.newLinkId) {
            setApprovedLinks((prev) => ({
                ...prev,
                [requestId]: `${window.location.origin}/view/${result.newLinkId}`,
            }));
            fetchShareLinks(); // the new link belongs in the links table too
            refreshStats();
        } else {
            toast.error(result.error || 'Failed to approve request');
        }
        setApprovingId(null);
    };

    const visibleRequests = pendingRequests.filter((r) => !dismissed[r.id]);
    const waitingRequests = visibleRequests.filter((r) => !approvedLinks[r.id]);
    const waitingCount = waitingRequests.length;

    // Same grouping as the links filter and status chips (see linkBucket).
    const buckets = useMemo(() => {
        if (shareLinksLoading) return null;
        const b = { active: 0, expiring: 0, expired: 0, used: 0 };
        for (const l of shareLinks) b[linkBucket(l, now)]++;
        return b;
    }, [shareLinks, shareLinksLoading, now]);

    return (
        <div className="min-h-screen overflow-x-clip bg-bg text-ink">
            <DashboardNavbar
                session={session}
                active={tab}
                pendingCount={waitingCount}
                onNavigate={setTab}
                onNewLink={() => openNewLink()}
            />

            <main className="flex flex-col gap-4 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
                {tab === 'overview' && (
                    <>
                        <PerformanceTile
                            stats={linkStats.stats}
                            statsLoading={linkStats.isLoading}
                            statsError={linkStats.error}
                            range={linkStats.range}
                            setRange={linkStats.setRange}
                            onRefresh={() => {
                                refreshStats();
                                fetchShareLinks();
                                fetchPendingRequests();
                            }}
                            activeLinks={buckets ? buckets.active + buckets.expiring : null}
                            expiringSoon={buckets ? buckets.expiring : null}
                            pendingCount={waitingCount}
                            credits={credits}
                            onOpenRequests={() => setTab('requests')}
                            isInstalled={isInstalled}
                            isLoadingInstall={isLoadingInstall}
                            openInstallationWindow={openInstallationWindow}
                            reposLoading={reposLoading}
                            repoCount={repos.length}
                        />

                        <RepoStrip
                            repos={linkStats.stats?.byRepo ?? null}
                            loading={linkStats.isLoading}
                            onPick={(r) => openNewLink(r)}
                            onNewLink={() => openNewLink()}
                        />

                        <OverviewBottomRow
                            buckets={buckets}
                            credits={credits}
                            linksCreated={shareLinksLoading ? null : shareLinks.length}
                            requests={visibleRequests}
                            approvedLinks={approvedLinks}
                            approvingId={approvingId}
                            onApprove={handleApprove}
                            onOpenLinks={() => setTab('links')}
                            onOpenRequests={() => setTab('requests')}
                        />
                    </>
                )}

                {tab === 'links' && (
                    <ShareLinksTable
                        id="links-panel"
                        shareLinks={shareLinks}
                        shareLinksLoading={shareLinksLoading}
                        onDeleteConfirm={confirmDeleteShareLink}
                        onNewLink={() => openNewLink()}
                    />
                )}

                {tab === 'requests' && (
                    <PendingRequestsTable
                        id="requests-panel"
                        requests={visibleRequests}
                        approvedLinks={approvedLinks}
                        loadingId={approvingId}
                        onApprove={handleApprove}
                        onDismiss={(id) => setDismissed((prev) => ({ ...prev, [id]: true }))}
                    />
                )}
            </main>

            <Drawer
                isOpen={sheet.isOpen}
                onOpenChange={sheet.onOpenChange}
                placement="right"
                size="md"
                scrollBehavior="inside"
                classNames={sheetClassNames}
            >
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                <span className="text-xl font-semibold text-ink">New link</span>
                                <span className="text-[13px] font-normal text-ink-3">
                                    {credits} {credits === 1 ? 'credit' : 'credits'} left · one credit per link
                                </span>
                            </DrawerHeader>
                            <DrawerBody>
                                <NewLinkPanel
                                    credits={credits}
                                    repos={repos}
                                    reposLoading={reposLoading}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    selectedRepo={selectedRepo}
                                    setSelectedRepo={setSelectedRepo}
                                    selectedExpiry={selectedExpiry}
                                    setSelectedExpiry={setSelectedExpiry}
                                    onCreate={createShareLink}
                                    isCreating={isCreatingShare}
                                    isInstalled={isInstalled}
                                    isLoadingInstall={isLoadingInstall}
                                    openInstallationWindow={openInstallationWindow}
                                />
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <LinkCreatedModal link={createdLink} copiedOnCreate={copiedOnCreate} onClose={() => setCreatedLink(null)} />

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
