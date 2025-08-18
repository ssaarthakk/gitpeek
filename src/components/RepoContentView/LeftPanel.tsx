import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import ContentLoadingBar from "./ContentLoadingBar";

type LeftPanelProps = {
    repoFullName: string;
    path: string;
    leftContent: any[];
    isLeftLoading: boolean;
    leftError: any;
    selectedPath: string | null;
    breadcrumbSegments: string[];
    goUpLeft: () => void;
    openDirectoryInLeft: (path: string) => void;
    selectItem: (item: any) => void;
};

export default function LeftPanel({
    repoFullName,
    path,
    leftContent,
    isLeftLoading,
    leftError,
    selectedPath,
    breadcrumbSegments,
    goUpLeft,
    openDirectoryInLeft,
    selectItem
}: LeftPanelProps) {

    const leftSorted = Array.isArray(leftContent)
        ? [...leftContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    return (
        <div className="basis-full md:basis-1/3 flex flex-col rounded-xl bg-white/[0.03] backdrop-blur-md shadow-[0_4px_18px_-4px_rgba(0,0,0,0.55)] overflow-hidden ring-1 ring-white/5 min-h-[260px] md:min-h-0 relative">
            <ContentLoadingBar isLoading={isLeftLoading} />
            <div className="px-4 pt-4 pb-2 border-b border-white/5 flex items-center justify-between gap-2 bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-400/30 text-indigo-200 text-sm">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-label="GitHub Repository">
                                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/>
                            </svg>
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
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-label="GitHub Folder">
                                            <g>
                                                <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
                                                <path fill="currentColor" fillOpacity="0.1" d="M2.5 2.5h3.072a.75.75 0 0 1 .53.22l1.128 1.13h6.27a.75.75 0 0 1 .75.75v6.9a1.75 1.75 0 0 1-1.75 1.75h-10A1.75 1.75 0 0 1 .5 11.5v-7a.75.75 0 0 1 .75-.75Z"></path>
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-label="GitHub File">
                                            <g>
                                                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                                                <rect x="4" y="4" width="8" height="1.5" rx="0.25" fill="currentColor" fillOpacity="0.1" />
                                                <rect x="4" y="7" width="8" height="1.5" rx="0.25" fill="currentColor" fillOpacity="0.1" />
                                                <rect x="4" y="10" width="5" height="1.5" rx="0.25" fill="currentColor" fillOpacity="0.1" />
                                            </g>
                                        </svg>
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
    )
}
