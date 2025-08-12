'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import useFileContent from '@/hooks/useFileContent';
import { Button } from '@heroui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Higher contrast GitHub-inspired dark theme
const githubDarkTheme = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: 'transparent',
        color: '#c9d1d9'
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        background: 'transparent',
        color: '#c9d1d9'
    },
    comment: { color: '#8b949e' },
    punctuation: { color: '#c9d1d9' },
    property: { color: '#d2a8ff' },
    tag: { color: '#7ee787' },
    boolean: { color: '#79c0ff' },
    number: { color: '#79c0ff' },
    selector: { color: '#ffa657' },
    'attr-name': { color: '#ffa657' },
    string: { color: '#a5d6ff' },
    char: { color: '#a5d6ff' },
    builtin: { color: '#ffa657' },
    function: { color: '#d2a8ff' },
    keyword: { color: '#ff7b72' }
};

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

    // Reset selection if repository changes
    useEffect(() => {
        setPath('');
        setSelectedPath(null);
        setSelectedType(null);
    }, [repoFullName]);

    const leftSorted = Array.isArray(leftContent)
        ? [...leftContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    const rightDirSorted = Array.isArray(rightDirContent)
        ? [...rightDirContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

        return (
                <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
                        {/* Left Panel */}
                        <div className="basis-full md:basis-1/3 flex flex-col rounded-xl bg-white/[0.03] backdrop-blur-md shadow-[0_4px_18px_-4px_rgba(0,0,0,0.55)] overflow-hidden ring-1 ring-white/5 min-h-[260px] md:min-h-0">
                                <div className="px-4 pt-4 pb-2 border-b border-white/5 flex items-center justify-between gap-2 bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-400/30 text-indigo-200 text-sm">
                                                        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z"/></svg>
                        </div>
                                                <h3 className="text-[14px] font-semibold tracking-wide text-white truncate" title={repoFullName}>{repoFullName}</h3>
                    </div>
                    {path && (
                        <Button size="sm" variant="flat" className="text-[10px]" onPress={goUpLeft}>Up</Button>
                    )}
                </div>
                                                {breadcrumbSegments.length > 0 && (
                                                    <div className="px-3 py-1 border-b border-white/5">
                                                        <Breadcrumbs size="sm" underline="hover" className="text-[11px] font-mono" itemClasses={{ separator: 'text-white/25' }}>
                                            {breadcrumbSegments.map((seg, idx) => {
                                                const full = breadcrumbSegments.slice(0, idx + 1).join('/');
                                                const isLast = idx === breadcrumbSegments.length - 1;
                                                return (
                                                    <BreadcrumbItem
                                                        key={full}
                                                        onClick={() => !isLast && openDirectoryInLeft(full)}
                                                        className={isLast ? 'text-sky-400' : ''}
                                                    >{seg}</BreadcrumbItem>
                                                );
                                            })}
                                        </Breadcrumbs>
                                    </div>
                                )}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                    {/* Overlay skeleton when switching directories for smoother feel */}
                    {isLeftLoading && (
                        <div className="absolute inset-0 bg-[#0b0f14]/60 backdrop-blur-sm flex items-start p-2 overflow-hidden">
                            <div className="flex-1"><LeftSkeleton /></div>
                        </div>
                    )}
                    {leftError && !isLeftLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-300 text-xs gap-2 bg-red-900/10">
                            <p>Error loading directory.</p>
                            <Button size="sm" onPress={() => openDirectoryInLeft(path)}>Retry</Button>
                        </div>
                    )}
                    {!isLeftLoading && leftContent && leftSorted.length === 0 && (
                        <p className="text-center text-xs text-white/40 mt-8">Empty directory.</p>
                    )}
                    <ul className="space-y-0.5">
                        {leftSorted.map((item: any, idx: number) => {
                            const isDir = item.type === 'dir';
                            const isSelected = selectedPath === item.path;
                            return (
                                <motion.li
                                    key={item.sha}
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.008, duration: 0.18 }}
                                    onClick={() => selectItem(item)}
                                    onDoubleClick={() => isDir && openDirectoryInLeft(item.path)}
                                    className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] font-medium cursor-pointer select-none transition-colors
                                        ${isSelected ? 'bg-indigo-500/30 text-white shadow-inner shadow-indigo-900/40' : 'hover:bg-white/10 text-white/70'}
                                    `}
                                >
                                                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${isDir ? 'text-amber-300' : 'text-sky-300'}`}>
                                                                            {isDir ? (
                                                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z"/></svg>
                                                                            ) : (
                                                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4 2.75C4 2.336 4.336 2 4.75 2h4.5c.199 0 .389.079.53.22l2 2a.75.75 0 0 1 .22.53v8.5A1.75 1.75 0 0 1 10.25 15h-5.5A1.75 1.75 0 0 1 3 13.25V2.75A.75.75 0 0 1 3.75 2h.5Zm1 .75v9.75c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V6h-1.25a.75.75 0 0 1-.75-.75V4H5Z"/></svg>
                                                                            )}
                                                                        </span>
                                    <span className="truncate font-mono tracking-tight" title={item.name}>{item.name}</span>
                                    {isDir ? (
                                        <span className="ml-auto rounded bg-amber-400/15 px-1.5 py-[1px] text-[8.5px] font-semibold uppercase tracking-wide text-amber-200">DIR</span>
                                    ) : (
                                        <span className="ml-auto text-[8.5px] uppercase tracking-wide text-white/40">FILE</span>
                                    )}
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>
                {/* Footer removed per request */}
            </div>

            {/* Right Panel */}
                        <div className="flex-1 flex flex-col rounded-xl bg-white/[0.04] backdrop-blur-md shadow-[0_4px_22px_-6px_rgba(0,0,0,0.55)] overflow-hidden ring-1 ring-white/5 min-h-[320px]">
                                <div className="px-5 pt-3 pb-2 border-b border-white/5 flex flex-wrap items-center gap-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 min-w-0 flex-1">
                                                <div className="flex items-center gap-2 min-w-0 mb-1 md:mb-0">
                                                    <h3 className="text-sm font-semibold tracking-wide text-white/90 whitespace-nowrap">
                            {!selectedPath && 'No Selection'}
                            {selectedType === 'file' && 'File Preview'}
                            {selectedType === 'dir' && 'Folder Contents'}
                                                    </h3>
                                                                                {(selectedType === 'dir' || (selectedType === 'file' && selectedPath)) && (
                                                                                    <div className="max-w-full overflow-hidden">
                                                                                        <Breadcrumbs size="sm" underline="hover" className="text-[12px] font-mono" itemClasses={{ separator: 'text-white/25' }}>
                                                                {selectedPath?.split('/').filter(Boolean).map((segment, idx, arr) => {
                                                                    const full = selectedPath.split('/').slice(0, idx + 1).join('/');
                                                                    const isLast = idx === arr.length - 1;
                                                                    return (
                                                                        <BreadcrumbItem
                                                                            key={full}
                                                                            onClick={() => {
                                                                                if (!isLast) {
                                                                                    setSelectedPath(full);
                                                                                    setSelectedType('dir');
                                                                                }
                                                                            }}
                                                                            className={isLast ? 'text-sky-400' : ''}
                                                                        >{segment}</BreadcrumbItem>
                                                                    );
                                                                })}
                                                            </Breadcrumbs>
                                                        </div>
                                                    )}
                                                </div>
                                                {selectedPath && (
                                                    <p className="text-[10px] font-medium text-white/45 font-mono truncate" title={selectedPath}>{selectedPath}</p>
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
                            {isRightDirLoading && (
                                <div className="absolute inset-0 bg-[#0b0f14]/70 backdrop-blur-sm p-4 z-10">
                                    <RightDirSkeleton />
                                </div>
                            )}
                            {rightDirError && !isRightDirLoading && (
                                <div className="text-red-300 text-xs mb-4">Error loading folder.</div>
                            )}
                            {rightDirContent && !isRightDirLoading && (
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
                                                                                                                <span className={`flex h-6 w-6 items-center justify-center rounded ${isDir ? 'text-amber-300' : 'text-sky-300'}`}>
                                                                                                                    {isDir ? (
                                                                                                                        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z"/></svg>
                                                                                                                    ) : (
                                                                                                                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M4 2.75C4 2.336 4.336 2 4.75 2h4.5c.199 0 .389.079.53.22l2 2a.75.75 0 0 1 .22.53v8.5A1.75 1.75 0 0 1 10.25 15h-5.5A1.75 1.75 0 0 1 3 13.25V2.75A.75.75 0 0 1 3.75 2h.5Zm1 .75v9.75c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V6h-1.25a.75.75 0 0 1-.75-.75V4H5Z"/></svg>
                                                                                                                    )}
                                                                                                                </span>
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
                                <div className="absolute inset-0 bg-[#0b0f14]/80 backdrop-blur-sm z-10 p-4">
                                    <CodeSkeleton />
                                </div>
                            )}
                            {rightFileContent && !isRightFileLoading && (
                                <SyntaxHighlighter
                                    language={detectLanguage(selectedPath)}
                                    style={githubDarkTheme as any}
                                    customStyle={{ margin: 0, background: 'transparent', fontSize: '12px', padding: '18px 24px' }}
                                    wrapLongLines
                                    showLineNumbers
                                    lineNumberStyle={{ color: '#6e7781', fontSize: '11px', paddingRight: '12px' }}
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

function CodeSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-3 w-full overflow-hidden rounded bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>
            ))}
        </div>
    );
}