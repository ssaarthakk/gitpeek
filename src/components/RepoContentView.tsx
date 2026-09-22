'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { useState, useEffect } from 'react';
import useFileContent from '@/hooks/useFileContent';
import LeftPanel from './RepoContentView/LeftPanel';
import RightPanel from './RepoContentView/RightPanel';
import ViewerHeader from './RepoContentView/ViewerHeader';

type RepoContentViewProps = {
    repoFullName: string;
    accessToken?: string;
    allowCopying: boolean;
    shareId?: string;
    branch?: string;
    /** ISO timestamp, or null when the link never expires. */
    expiresAt?: string | null;
    isOneTime?: boolean;
    sharedBy?: string | null;
};

export default function RepoContentView({ repoFullName, accessToken, allowCopying, shareId, branch, expiresAt, isOneTime, sharedBy }: RepoContentViewProps) {

    const noSelectStyle: React.CSSProperties = !allowCopying ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
    } : {};

    const [path, setPath] = useState('');
    // Right-side selected item path & type (file or dir) independent of left path changes
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'file' | 'dir' | null>(null);
    // Size (bytes) of the selected file, as reported by the directory listing it was picked from
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    // Narrow screens only: the file tree is an overlay toggled from the content toolbar
    const [isTreeOpen, setIsTreeOpen] = useState(false);

    // Left directory listing (use provided token for incognito/public share views)
    const { content: leftContent, isLoading: isLeftLoading, error: leftError } = useRepoContent(
        repoFullName,
        path,
        accessToken,
        branch
    );
    // If right panel is showing a directory, fetch its contents
    const { content: rightDirContent, isLoading: isRightDirLoading, error: rightDirError } = useRepoContent(
        selectedType === 'dir' ? repoFullName : null,
        selectedType === 'dir' && selectedPath ? selectedPath : '',
        accessToken,
        branch
    );
    // If right panel is showing a file, fetch file content
    const { content: rightFileContent, raw: rightFileRaw, isLoading: isRightFileLoading } = useFileContent(
        repoFullName,
        selectedType === 'file' ? selectedPath : null,
        accessToken,
        branch
    );

    const breadcrumbSegments = path.split('/').filter(Boolean);

    const selectItem = (item: any) => {
        setSelectedPath(item.path);
        setSelectedType(item.type === 'dir' ? 'dir' : 'file');
        setSelectedSize(typeof item.size === 'number' && item.type !== 'dir' ? item.size : null);
        setIsTreeOpen(false);
    };

    const openDirectoryInLeft = (targetPath: string) => {
        setPath(targetPath);
        // Do not alter right selection unless selection is outside new scope
    };

    const goUpLeft = () => {
        const parent = breadcrumbSegments.slice(0, -1).join('/');
        openDirectoryInLeft(parent);
    };

    // Reset selection if repository changes
    useEffect(() => {
        setPath('');
        setSelectedPath(null);
        setSelectedType(null);
        setSelectedSize(null);
    }, [repoFullName]);

    // Auto-select README in root directory when available and nothing selected yet
    useEffect(() => {
        if (!selectedPath && path === '' && Array.isArray(leftContent)) {
            const readme = (leftContent as any[]).find(f => f.type === 'file' && /^readme(\.md|\.markdown|)$/i.test(f.name));
            if (readme) {
                setSelectedPath(readme.path);
                setSelectedType('file');
                setSelectedSize(typeof readme.size === 'number' ? readme.size : null);
            }
        }
    }, [leftContent, path, selectedPath]);

    const handleDownload = async () => {
        if (!shareId) return;

        try {
            let targetBranch = branch;
            if (!targetBranch) {
                const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
                    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                });
                const repoData = await response.json();
                targetBranch = repoData.default_branch || 'main';
            }

            const downloadUrl = `/api/download/${shareId}/${targetBranch}`;
            window.location.href = downloadUrl;
        } catch (error) {
            console.error('Failed to download repository:', error);
        }
    };

    return (
        <div className="flex h-full w-full flex-col gap-3 bg-bg p-3" style={noSelectStyle}>
            <ViewerHeader
                repoFullName={repoFullName}
                branch={branch}
                expiresAt={expiresAt}
                isOneTime={isOneTime}
                onDownload={allowCopying && shareId ? handleDownload : undefined}
                onOpenTree={() => setIsTreeOpen(true)}
            />
            <div className="relative flex min-h-0 flex-1 md:grid md:grid-cols-[280px_minmax(0,1fr)] md:gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
                <LeftPanel
                    className={isTreeOpen ? 'absolute inset-0 z-20 flex md:static md:z-auto' : 'hidden md:flex'}
                    repoFullName={repoFullName}
                    path={path}
                    leftContent={leftContent as any[]}
                    isLeftLoading={isLeftLoading}
                    leftError={leftError}
                    selectedPath={selectedPath}
                    breadcrumbSegments={breadcrumbSegments}
                    goUpLeft={goUpLeft}
                    openDirectoryInLeft={openDirectoryInLeft}
                    selectItem={selectItem}
                    sharedBy={sharedBy}
                    onClose={() => setIsTreeOpen(false)}
                />
                <RightPanel
                    selectedPath={selectedPath}
                    selectedType={selectedType}
                    selectedSize={selectedSize}
                    rightDirContent={rightDirContent as any[]}
                    isRightDirLoading={isRightDirLoading}
                    rightDirError={rightDirError}
                    rightFileContent={rightFileContent}
                    rightFileRaw={rightFileRaw}
                    isRightFileLoading={isRightFileLoading}
                    selectItem={selectItem}
                    setSelectedPath={setSelectedPath}
                    setSelectedType={setSelectedType}
                    allowCopying={allowCopying}
                />
            </div>
        </div>
    );
}
