import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { LeftSkeleton } from "./Skeletons";

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
    )
}
