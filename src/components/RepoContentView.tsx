'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { useState, useEffect } from 'react';
import useFileContent from '@/hooks/useFileContent';
import LeftPanel from './RepoContentView/LeftPanel';
import RightPanel from './RepoContentView/RightPanel';

type RepoContentViewProps = {
    repoFullName: string;
    accessToken?: string;
};

export default function RepoContentView({ repoFullName, accessToken  }: RepoContentViewProps) {

    const [path, setPath] = useState('');
    // Right-side selected item path & type (file or dir) independent of left path changes
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'file' | 'dir' | null>(null);

    // Left directory listing (use provided token for incognito/public share views)
    const { content: leftContent, isLoading: isLeftLoading, error: leftError } = useRepoContent(
        repoFullName,
        path,
        accessToken
    );
    // If right panel is showing a directory, fetch its contents
    const { content: rightDirContent, isLoading: isRightDirLoading, error: rightDirError } = useRepoContent(
        selectedType === 'dir' ? repoFullName : null,
        selectedType === 'dir' && selectedPath ? selectedPath : '',
        accessToken
    );
    // If right panel is showing a file, fetch file content
    const { content: rightFileContent, raw: rightFileRaw, isLoading: isRightFileLoading } = useFileContent(
        repoFullName,
        selectedType === 'file' ? selectedPath : null,
        accessToken
    );

    const breadcrumbSegments = path.split('/').filter(Boolean);

    const selectItem = (item: any) => {
        setSelectedPath(item.path);
        setSelectedType(item.type === 'dir' ? 'dir' : 'file');
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
    }, [repoFullName]);

    // Auto-select README in root directory when available and nothing selected yet
    useEffect(() => {
        if (!selectedPath && path === '' && Array.isArray(leftContent)) {
            const readme = (leftContent as any[]).find(f => f.type === 'file' && /^readme(\.md|\.markdown|)$/i.test(f.name));
            if (readme) {
                setSelectedPath(readme.path);
                setSelectedType('file');
            }
        }
    }, [leftContent, path, selectedPath]);

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
            <LeftPanel
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
            />
            <RightPanel
                selectedPath={selectedPath}
                selectedType={selectedType}
                rightDirContent={rightDirContent as any[]}
                isRightDirLoading={isRightDirLoading}
                rightDirError={rightDirError}
                rightFileContent={rightFileContent}
                rightFileRaw={rightFileRaw}
                isRightFileLoading={isRightFileLoading}
                selectItem={selectItem}
                setSelectedPath={setSelectedPath}
                setSelectedType={setSelectedType}
            />
        </div>
    );
}