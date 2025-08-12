'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import useFileContent from '@/hooks/useFileContent';
import { Button } from '@heroui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
// @ts-ignore - optional peer for tables/task lists
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    const { content: rightFileContent, raw: rightFileRaw, isLoading: isRightFileLoading } = useFileContent(
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
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z" /></svg>
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
                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z" /></svg>
                                        ) : (
                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M3.75 1A1.75 1.75 0 0 0 2 2.75v10.5C2 14.216 2.784 15 3.75 15h8.5A1.75 1.75 0 0 0 14 13.25V6.06c0-.464-.184-.909-.513-1.237L9.177 1.512A1.75 1.75 0 0 0 7.94 1H3.75ZM8.5 2.56c.09.05.173.11.246.183l4.06 4.06a.75.75 0 0 1 .183.246H9.75A1.75 1.75 0 0 1 8 5.25V2.56h.5Z" /></svg>
                                        )}
                                    </span>
                                    <span className="truncate font-mono tracking-tight" title={item.name}>{item.name}</span>
                                    <span className="ml-auto text-[8.5px] uppercase tracking-wide text-white/40">{isDir ? 'DIR' : 'FILE'}</span>
                                </motion.li>
                            );
                        })}
                    </ul>
                </div>
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
                                    <Breadcrumbs size="sm" underline="hover" className="text-[13px] font-mono" itemClasses={{ separator: 'text-white/25' }}>
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
                                                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.5 3.25A.75.75 0 0 1 2.25 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z" /></svg>
                                                            ) : (
                                                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M3.75 1A1.75 1.75 0 0 0 2 2.75v10.5C2 14.216 2.784 15 3.75 15h8.5A1.75 1.75 0 0 0 14 13.25V6.06c0-.464-.184-.909-.513-1.237L9.177 1.512A1.75 1.75 0 0 0 7.94 1H3.75ZM8.5 2.56c.09.05.173.11.246.183l4.06 4.06a.75.75 0 0 1 .183.246H9.75A1.75 1.75 0 0 1 8 5.25V2.56h.5Z" /></svg>
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
                            {rightFileContent && !isRightFileLoading && renderFileContent(selectedPath, rightFileContent, rightFileRaw)}
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

function detectLanguage(filePath: string | null): string | undefined {
    if (!filePath) return undefined;
    const name = filePath.split('/').pop() || '';
    const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
    if (/^dockerfile$/i.test(name)) return 'docker';
    switch (ext) {
        case 'ts':
        case 'tsx': return 'typescript';
        case 'js':
        case 'jsx': return 'javascript';
        case 'c': return 'c';
        case 'h': return 'c';
        case 'cpp':
        case 'cc':
        case 'hpp': return 'cpp';
        case 'cs': return 'csharp';
        case 'java': return 'java';
        case 'kt':
        case 'kts': return 'kotlin';
        case 'swift': return 'swift';
        case 'py': return 'python';
        case 'rs': return 'rust';
        case 'go': return 'go';
        case 'rb': return 'ruby';
        case 'php': return 'php';
        case 'scala': return 'scala';
        case 'sql': return 'sql';
        case 'sh':
        case 'bash': return 'bash';
        case 'md':
        case 'markdown': return 'markdown';
        case 'json': return 'json';
        case 'yml':
        case 'yaml': return 'yaml';
        case 'css': return 'css';
        case 'scss': return 'scss';
        case 'less': return 'less';
        case 'html':
        case 'htm': return 'html';
        case 'xml': return 'xml';
        case 'ini':
        case 'env': return 'properties';
        case 'toml': return 'toml';
        case 'prisma': return 'prisma';
        case 'graphql':
        case 'gql': return 'graphql';
        case 'vue': return 'vue';
        case 'svelte': return 'svelte';
        default: return undefined;
    }
}

function isImage(filePath: string) {
    return /(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg|\.ico)$/i.test(filePath);
}

function isMarkdown(filePath: string) {
    return /(README|readme)\.(md|markdown)$/.test(filePath) || /\.(md|markdown)$/.test(filePath);
}

function renderFileContent(filePath: string, content: string, rawBase64: string | null) {
    // Image preview
    if (isImage(filePath) && rawBase64) {
        const ext = filePath.split('.').pop()!.toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const dataUri = `data:${mime};base64,${rawBase64}`;
        return (
            <div className="p-6 flex flex-col items-start gap-4">
                <img src={dataUri} alt={filePath} className="max-w-full h-auto rounded-lg ring-1 ring-white/10 bg-white/5" />
                <a href={dataUri} download target="_blank" rel="noreferrer" className="text-[11px] text-sky-400 hover:underline">Open raw image in new tab</a>
            </div>
        );
    }
    // Markdown rendering
    if (isMarkdown(filePath)) {
        return (
            <div className="markdown-body max-w-none p-6 pb-16 !bg-transparent">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }: { node: any; inline?: boolean; className?: string; children: any }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const lang = match ? match[1] : undefined;
                            if (inline) {
                                return <code className="px-1 py-[2px] rounded-md bg-[#161b22] border border-[#30363d] text-[12px]" {...props}>{children}</code>;
                            }
                            return (
                                <SyntaxHighlighter
                                    style={githubDarkTheme as any}
                                    language={lang}
                                    PreTag="div"
                                    customStyle={{ margin: '0 0 16px', background: '#161b22', padding: '16px 18px', fontSize: '13px', borderRadius: '6px', border: '1px solid #30363d' }}
                                    showLineNumbers
                                    lineNumberStyle={{ color: '#6e7681', fontSize: '11px', paddingRight: '12px' }}
                                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                            );
                        },
                        a({children, href, ...rest}: any){
                            return <a href={href} className="text-sky-400 hover:underline" {...rest}>{children}</a>;
                        },
                        img({src, alt}: any){
                            return <img src={src} alt={alt} className="max-w-full h-auto rounded-md border border-[#30363d] bg-[#0d1117]" />;
                        }
                    }}
                >{content}</ReactMarkdown>
            </div>
        );
    }
    // Code / text fallback
    const language = detectLanguage(filePath);
    return (
        <SyntaxHighlighter
            language={language}
            style={githubDarkTheme as any}
            customStyle={{ margin: 0, background: 'transparent', fontSize: '12px', padding: '18px 24px' }}
            wrapLongLines
            showLineNumbers
            lineNumberStyle={{ color: '#6e7781', fontSize: '11px', paddingRight: '12px' }}
        >{content}</SyntaxHighlighter>
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