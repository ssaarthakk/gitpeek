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
  Skeleton
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

    try {
      const response = await axios.post('/api/share', { repoFullName: selectedRepo });
      const newLink = response.data;
      setShareLinks(prev => [newLink, ...prev]);
      toast.success('Share link created successfully!');
      
      // Copy to clipboard
      const fullLink = `${window.location.origin}/view/${newLink.id}`;
      await navigator.clipboard.writeText(fullLink);
      toast.success('Link copied to clipboard!');
      
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create share link';
      toast.error(message);
    }
  };

  const handleDeleteShareLink = async (linkId: string) => {
    try {
      await axios.delete(`/api/share/${linkId}`);
      setShareLinks(prev => prev.filter(link => link.id !== linkId));
      toast.success('Share link deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete share link');
    }
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
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
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
          <CardBody className="pt-0">
            <div className="flex items-center justify-between">
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
          <CardBody className="pt-0">
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
                      className="text-white/90 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                          <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{repo.name}</p>
                          <p className="text-sm text-white/50 truncate">{repo.description || 'No description'}</p>
                        </div>
                        {repo.private && (
                          <Chip size="sm" variant="flat" color="warning">
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
                              onPress={() => handleDeleteShareLink(link.id)}
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
    </div>
  );
}
