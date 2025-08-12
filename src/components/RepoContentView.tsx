'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import useFileContent from '@/hooks/useFileContent';
import { Button } from '@heroui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type RepoContentViewProps = {
    repoFullName: string;
};

export default function RepoContentView({ repoFullName }: RepoContentViewProps) {
    // Left-side navigation path (current directory list)
    const [path, setPath] = useState('');
    // Right-side selected item path & type (file or dir) independent of left path changes
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'file' | 'dir' | null>(null);

    // Left directory listing
    const { content: leftContent, isLoading: isLeftLoading, error: leftError } = useRepoContent(repoFullName, path);
    // If right panel is showing a directory, fetch its contents
    const { content: rightDirContent, isLoading: isRightDirLoading, error: rightDirError } = useRepoContent(
        selectedType === 'dir' ? repoFullName : null,
        selectedType === 'dir' && selectedPath ? selectedPath : ''
    );
    // If right panel is showing a file, fetch file content
    const { content: rightFileContent, isLoading: isRightFileLoading } = useFileContent(
        repoFullName,
        selectedType === 'file' ? selectedPath : null
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

    const clearSelection = () => {
        setSelectedPath(null);
        setSelectedType(null);
    };

    const leftSorted = Array.isArray(leftContent)
        ? [...leftContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    const rightDirSorted = Array.isArray(rightDirContent)
        ? [...rightDirContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    return (
        <div className="w-full max-w-6xl mx-auto mt-6 flex gap-4 h-[680px]">
            {/* Left Panel */}
            <div className="basis-1/3 flex flex-col rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-inset ring-indigo-400/30 text-indigo-300">📦</div>
                        <div>
                            <h3 className="text-xs font-semibold tracking-wide text-white/90">Files</h3>
                            <p className="text-[10px] font-medium text-white/40 truncate max-w-[140px]" title={repoFullName}>{repoFullName}</p>
                        </div>
                    </div>
                    {path && (
                        <Button size="sm" variant="flat" className="text-[10px]" onPress={goUpLeft}>Up</Button>
                    )}
                </div>
                <div className="px-4 py-2 border-b border-white/10">
                    <Breadcrumbs size="sm" underline="hover" className="text-[10px] font-mono" itemClasses={{ separator: 'text-white/30' }}>
                        <BreadcrumbItem key="root" onClick={() => openDirectoryInLeft('')} className={!path ? 'text-white' : ''}>root</BreadcrumbItem>
                        {breadcrumbSegments.map((seg, idx) => {
                            const full = breadcrumbSegments.slice(0, idx + 1).join('/');
                            const isLast = idx === breadcrumbSegments.length - 1;
                            return (
                                <BreadcrumbItem
                                    key={full}
                                    onClick={() => !isLast && openDirectoryInLeft(full)}
                                    className={isLast ? 'text-white' : ''}
                                >{seg}</BreadcrumbItem>
                            );
                        })}
                    </Breadcrumbs>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                    {leftError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-300 text-xs gap-2 bg-red-900/10">
                            <p>Error loading directory.</p>
                            <Button size="sm" onPress={() => openDirectoryInLeft(path)}>Retry</Button>
                        </div>
                    )}
                    {isLeftLoading && !leftContent && <LeftSkeleton />}
                    {!isLeftLoading && leftContent && leftSorted.length === 0 && (
                        <p className="text-center text-xs text-white/40 mt-8">Empty directory.</p>
                    )}
                    <ul className="space-y-1">
                        {leftSorted.map((item: any, idx: number) => {
                            const isDir = item.type === 'dir';
                            const isSelected = selectedPath === item.path;
                            return (
                                <motion.li
                                    key={item.sha}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.01, duration: 0.2 }}
                                    onClick={() => selectItem(item)}
                                    onDoubleClick={() => isDir && openDirectoryInLeft(item.path)}
                                    className={`group flex items-center gap-3 rounded-md border px-2 py-1.5 text-[13px] font-medium cursor-pointer select-none shadow-inner shadow-black/30 ring-1 ring-inset transition-colors
                                        ${isSelected ? 'bg-indigo-500/25 border-indigo-400/40 text-white' : 'bg-white/[0.03] border-transparent text-white/70 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ring-1 ring-inset
                                        ${isDir ? 'bg-amber-500/15 text-amber-300 ring-amber-400/30 group-hover:bg-amber-500/25' : 'bg-sky-500/15 text-sky-300 ring-sky-400/30 group-hover:bg-sky-500/25'}`}>{isDir ? '📁' : '📄'}</span>
                                    <span className="truncate font-mono tracking-tight" title={item.name}>{item.name}</span>
                                    {isDir ? (
                                        <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-[1px] text-[9px] font-semibold uppercase tracking-wide text-amber-200">DIR</span>
                                    ) : (
                                        <span className="ml-auto text-[9px] uppercase tracking-wide text-white/30">FILE</span>
                                    )}
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>
                <div className="p-2 border-t border-white/10 flex justify-between gap-2 text-[10px] text-white/40">
                    <span>{leftSorted.length} items</span>
                    {selectedPath && (
                        <button onClick={clearSelection} className="hover:text-white/70">Clear selection</button>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col min-w-[200px]">
                        <h3 className="text-xs font-semibold tracking-wide text-white/90">
                            {!selectedPath && 'No Selection'}
                            {selectedType === 'file' && 'File Preview'}
                            {selectedType === 'dir' && 'Folder Contents'}
                        </h3>
                        {selectedPath && (
                            <p className="text-[10px] font-medium text-white/45 font-mono truncate max-w-[420px]" title={selectedPath}>{selectedPath}</p>
                        )}
                    </div>
                    {selectedType === 'dir' && selectedPath && (
                        <div className="text-[10px] text-white/40">{rightDirSorted.length} items</div>
                    )}
                    {selectedType === 'file' && selectedPath && (
                        <div className="text-[10px] text-white/40">{rightFileContent ? rightFileContent.split('\n').length : 0} lines</div>
                    )}
                </div>
                <div className="flex-1 relative overflow-hidden">
                    {!selectedPath && (
                        <div className="h-full flex items-center justify-center text-sm text-white/40">Select a file or folder from the left.</div>
                    )}
                    {selectedType === 'dir' && selectedPath && (
                        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
                            {rightDirError && (
                                <div className="text-red-300 text-xs mb-4">Error loading folder.</div>
                            )}
                            {(isRightDirLoading && !rightDirContent) && <RightDirSkeleton />}
                            {rightDirContent && (
                                <table className="w-full text-[12px] font-mono">
                                    <thead className="sticky top-0 backdrop-blur bg-black/30">
                                        <tr className="text-white/50">
                                            <th className="text-left font-semibold py-2 px-2">Name</th>
                                            <th className="text-left font-semibold py-2 px-2 w-20">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rightDirSorted.map((child: any) => {
                                            const isDir = child.type === 'dir';
                                            return (
                                                <tr
                                                    key={child.sha}
                                                    onClick={() => selectItem(child)}
                                                    className="group cursor-pointer hover:bg-white/5"
                                                >
                                                    <td className="py-1.5 px-2 flex items-center gap-2">
                                                        <span className={`flex h-6 w-6 items-center justify-center rounded ring-1 ring-inset ${isDir ? 'bg-amber-500/15 text-amber-300 ring-amber-400/30 group-hover:bg-amber-500/25' : 'bg-sky-500/15 text-sky-300 ring-sky-400/30 group-hover:bg-sky-500/25'}`}>{isDir ? '📁' : '📄'}</span>
                                                        <span className="truncate" title={child.name}>{child.name}</span>
                                                    </td>
                                                    <td className="py-1.5 px-2 text-white/40 uppercase text-[10px]">{isDir ? 'DIR' : 'FILE'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            {rightDirContent && rightDirSorted.length === 0 && (
                                <p className="text-center text-xs text-white/40 mt-8">Empty folder.</p>
                            )}
                        </div>
                    )}
                    {selectedType === 'file' && selectedPath && (
                        <div className="absolute inset-0 overflow-auto custom-scrollbar">
                            {isRightFileLoading && (
                                <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm bg-black/50 z-10">Loading file...</div>
                            )}
                            {rightFileContent && (
                                <SyntaxHighlighter
                                    language={detectLanguage(selectedPath)}
                                    style={vscDarkPlus as any}
                                    customStyle={{ margin: 0, background: 'transparent', fontSize: '12px', padding: '18px 24px' }}
                                    wrapLongLines
                                    showLineNumbers
                                >{rightFileContent}</SyntaxHighlighter>
                            )}
                            {!isRightFileLoading && !rightFileContent && (
                                <p className="p-4 text-xs text-white/40">No preview available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Basic language detection for SyntaxHighlighter
function detectLanguage(filePath: string | null): string | undefined {
    if (!filePath) return undefined;
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'yml':
        case 'yaml':
            return 'yaml';
        case 'css':
            return 'css';
        case 'html':
            return 'html';
        case 'py':
            return 'python';
        case 'rs':
            return 'rust';
        case 'go':
            return 'go';
        case 'rb':
            return 'ruby';
        case 'java':
            return 'java';
        case 'sh':
        case 'bash':
            return 'bash';
        default:
            return undefined;
    }
}

function HeaderSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 animate-pulse" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-56 rounded bg-white/5 animate-pulse" />
            </div>
        </div>
    );
}

function LeftSkeleton() {
    return (
        <ul className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <li key={i} className="h-8 w-full overflow-hidden rounded-md bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </li>
            ))}
        </ul>
    );
}

function RightDirSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-7 w-full overflow-hidden rounded bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            ))}
        </div>
    );
}