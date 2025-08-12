'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import useFileContent from '@/hooks/useFileContent';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type RepoContentViewProps = {
    repoFullName: string;
};

export default function RepoContentView({ repoFullName }: RepoContentViewProps) {
    const [path, setPath] = useState('');
    const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

    // Directory listing hook
    const { content: directoryContent, isLoading: isDirLoading, error } = useRepoContent(repoFullName, path);
    // File content hook
    const { content: fileContent, isLoading: isFileLoading } = useFileContent(repoFullName, activeFilePath);

    const segments = path.split('/').filter(Boolean);

    const handleItemClick = (item: { type: string; path: string; }) => {
        if (item.type === 'dir') {
            setActiveFilePath(null);
            setPath(item.path);
        } else if (item.type === 'file') {
            setActiveFilePath(item.path);
        }
    };

    const handleBreadcrumbClick = (targetPath: string) => {
        setActiveFilePath(null); // leaving file view if any
        setPath(targetPath);
    };

    const goUpDirectory = () => {
        const parent = segments.slice(0, -1).join('/');
        setPath(parent);
    };

    const leaveFileView = () => setActiveFilePath(null);

    // Error state for directory content
    if (error) {
        const parent = segments.slice(0, -1).join('/');
        return (
            <div className="w-full max-w-5xl mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-5 text-red-200">
                <p className="font-semibold mb-1">Error loading contents</p>
                <p className="text-sm opacity-80 mb-3">{error}</p>
                <button
                    onClick={() => handleBreadcrumbClick(parent)}
                    disabled={!path}
                    className="inline-flex items-center gap-1 rounded-md border border-red-400/30 bg-red-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-200 hover:bg-red-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >Try Parent</button>
            </div>
        );
    }

    // Show file content view if a file is selected
    if (activeFilePath) {
        return (
            <div className="w-full max-w-5xl mt-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] px-6 py-5 shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-[220px]">
                        <button
                            onClick={leaveFileView}
                            className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center ring-1 ring-inset ring-sky-400/40 text-sky-300 hover:bg-sky-500/30 transition"
                            aria-label="Back to directory"
                        >⬅️</button>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-semibold tracking-wide text-white/90">Viewing File</h3>
                            <p className="text-[11px] font-medium text-white/50 truncate max-w-[260px]" title={activeFilePath}>{activeFilePath}</p>
                        </div>
                    </div>
                    <Breadcrumbs size="sm" underline="hover" className="text-[11px] font-mono" itemClasses={{ separator: 'text-white/30' }}>
                        <BreadcrumbItem key="root" onClick={() => handleBreadcrumbClick('')} className={!path ? 'text-white' : ''}>root</BreadcrumbItem>
                        {segments.map((seg, idx) => {
                            const full = segments.slice(0, idx + 1).join('/');
                            return (
                                <BreadcrumbItem
                                    key={full}
                                    onClick={() => handleBreadcrumbClick(full)}
                                >
                                    {seg}
                                </BreadcrumbItem>
                            );
                        })}
                        <BreadcrumbItem key={activeFilePath} className="text-white">{activeFilePath.split('/').pop()}</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className="relative max-h-[520px] overflow-auto rounded-lg border border-white/10 bg-black/40 custom-scrollbar">
                    {isFileLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 text-white/70 text-sm">Loading file...</div>
                    )}
                    {fileContent ? (
                        <SyntaxHighlighter
                            language={detectLanguage(activeFilePath)}
                            style={vscDarkPlus as any}
                            customStyle={{ margin: 0, background: 'transparent', fontSize: '12px', padding: '18px 20px' }}
                            wrapLongLines
                            showLineNumbers
                        >{fileContent}</SyntaxHighlighter>
                    ) : !isFileLoading ? (
                        <p className="p-4 text-sm text-white/50">No preview available.</p>
                    ) : null}
                </div>
            </div>
        );
    }

    // Directory listing view
    const isSkeleton = isDirLoading && !directoryContent; // initial load

    if (isSkeleton) {
        return (
            <div className="w-full max-w-xl mt-8 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-5 shadow-lg backdrop-blur-sm animate-in fade-in">
                <HeaderSkeleton />
                <ul className="mt-4 space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="h-9 w-full overflow-hidden rounded-md bg-white/5 relative">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (!directoryContent || !Array.isArray(directoryContent)) return null;

    const sorted = [...directoryContent].sort((a: any, b: any) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
    });

    return (
        <div className="w-full max-w-5xl mt-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] px-6 py-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-6 flex-wrap mb-3">
                <div className="flex items-center gap-3 min-w-[220px]">
                    <div className="h-11 w-11 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-inset ring-indigo-400/30 text-indigo-300">
                        <span className="text-lg">📦</span>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold tracking-wide text-white/90">Repository Contents</h3>
                        <p className="text-[11px] font-medium text-white/50 truncate max-w-[240px]" title={repoFullName}>{repoFullName}</p>
                    </div>
                </div>
                <Breadcrumbs size="sm" underline="hover" className="text-[11px] font-mono" itemClasses={{ separator: 'text-white/30' }}>
                    <BreadcrumbItem key="root" onClick={() => handleBreadcrumbClick('')} className={!path ? 'text-white' : ''}>root</BreadcrumbItem>
                    {segments.map((seg, idx) => {
                        const full = segments.slice(0, idx + 1).join('/');
                        const isLast = idx === segments.length - 1;
                        return (
                            <BreadcrumbItem
                                key={full}
                                onClick={() => !isLast && handleBreadcrumbClick(full)}
                                className={isLast ? 'text-white' : ''}
                            >
                                {seg}
                            </BreadcrumbItem>
                        );
                    })}
                </Breadcrumbs>
            </div>
            <div className="mt-2 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar relative">
                {isDirLoading && (
                    <div className="absolute top-2 right-3 text-[10px] uppercase tracking-wide text-white/40 animate-pulse">Refreshing...</div>
                )}
                <ul className="space-y-1">
                    {sorted.map((item: any, idx: number) => {
                        const isDir = item.type === 'dir';
                        return (
                            <motion.li
                                key={item.sha}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.015, duration: 0.25, ease: 'easeOut' }}
                                whileHover={{ scale: 1.012 }}
                                onClick={() => handleItemClick(item)}
                                className="group flex items-center gap-3 rounded-lg border border-transparent bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/70 shadow-inner shadow-black/30 backdrop-blur-sm hover:border-white/15 hover:bg-white/10 hover:text-white transition-colors cursor-pointer select-none"
                            >
                                <span
                                    className={
                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ' +
                                        (isDir
                                            ? 'bg-amber-500/15 text-amber-300 ring-amber-400/30 group-hover:bg-amber-500/25'
                                            : 'bg-sky-500/15 text-sky-300 ring-sky-400/30 group-hover:bg-sky-500/25')
                                    }
                                    aria-hidden
                                >
                                    {isDir ? '📁' : '📄'}
                                </span>
                                <span className="truncate font-mono tracking-tight" title={item.name}>{item.name}</span>
                                {isDir ? (
                                    <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-amber-200 group-hover:bg-amber-400/25">DIR</span>
                                ) : (
                                    <span className="ml-auto text-[10px] uppercase tracking-wide text-white/30 group-hover:text-white/50">FILE</span>
                                )}
                            </motion.li>
                        );
                    })}
                </ul>
                {sorted.length === 0 && (
                    <p className="mt-8 text-center text-sm text-white/40">This directory is empty.</p>
                )}
            </div>
            {path && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={goUpDirectory}
                        className="text-[11px] font-semibold uppercase tracking-wide text-white/60 hover:text-white transition"
                    >⬆️ Up</button>
                </div>
            )}
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