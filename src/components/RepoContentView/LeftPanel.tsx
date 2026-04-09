import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import ContentLoadingBar from "./ContentLoadingBar";
import { RepoIcon, FileDirectoryFillIcon, FileIcon, DownloadIcon } from "@primer/octicons-react";

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
    allowCopying?: boolean;
    shareId?: string;
    onDownload?: () => void;
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
    selectItem,
    allowCopying,
    shareId,
    onDownload
}: LeftPanelProps) {

    const leftSorted = Array.isArray(leftContent)
        ? [...leftContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    return (
        <div className="basis-full md:basis-1/4 flex flex-col rounded-md bg-[#0d1117] border border-[#30363d] overflow-hidden min-h-[260px] md:min-h-0 relative">
            <ContentLoadingBar isLoading={isLeftLoading} />
            <div className="px-3 py-2 flex items-center justify-between gap-2 bg-[#161b22] border-b border-[#30363d]">
                <div className="flex items-center gap-2 min-w-0 text-[#c9d1d9]">
                    <RepoIcon size={16} className="text-[#8b949e] shrink-0" />
                    <h3 className="text-[14px] font-semibold text-white truncate hover:underline cursor-pointer" title={repoFullName}>{repoFullName}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {allowCopying && shareId && onDownload && (
                        <button
                            onClick={onDownload}
                            className="p-1 rounded-md text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d] transition-colors cursor-pointer"
                            title="Download ZIP"
                        >
                            <DownloadIcon size={16} />
                        </button>
                    )}
                    {path && (
                        <button onClick={goUpLeft} className="px-2 py-[2px] rounded-md text-[12px] font-medium bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] transition-colors">Up</button>
                    )}
                </div>
            </div>
            {breadcrumbSegments.length > 0 && (
                <div className="px-3 py-2 bg-[#0d1117] border-b border-[#30363d]">
                    <Breadcrumbs size="sm" className="text-[13px]" itemClasses={{ item: 'text-[#2f81f7] hover:underline cursor-pointer', separator: 'text-[#8b949e]' }}>
                        {breadcrumbSegments.map((seg, idx) => {
                            const full = breadcrumbSegments.slice(0, idx + 1).join('/');
                            const isLast = idx === breadcrumbSegments.length - 1;
                            return (
                                <BreadcrumbItem
                                    key={full}
                                    onClick={() => !isLast && openDirectoryInLeft(full)}
                                    className={isLast ? 'text-[#c9d1d9] pointer-events-none font-semibold' : ''}
                                >{seg}</BreadcrumbItem>
                            );
                        })}
                    </Breadcrumbs>
                </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0d1117]">
                {leftError && !isLeftLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#f85149] text-xs gap-2">
                        <p>Error loading directory.</p>
                        <button onClick={() => openDirectoryInLeft(path)} className="px-3 py-1 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]">Retry</button>
                    </div>
                )}
                {!isLeftLoading && leftContent && leftSorted.length === 0 && (
                    <p className="text-center text-[13px] text-[#8b949e] mt-4">This directory is empty.</p>
                )}
                <ul className="flex flex-col">
                    {leftSorted.map((item: any, idx: number) => {
                        const isDir = item.type === 'dir';
                        const isSelected = selectedPath === item.path;
                        return (
                            <motion.li
                                key={item.sha}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1 }}
                                onClick={() => selectItem(item)}
                                onDoubleClick={() => isDir && openDirectoryInLeft(item.path)}
                                className={`group flex items-center gap-2.5 px-4 py-2 text-[14px] cursor-pointer select-none transition-colors border-b border-[#30363d] last:border-b-0
                                        ${isSelected ? 'bg-[#1f2428]' : 'hover:bg-[#161b22]'}
                                    `}
                            >
                                <span className={`flex items-center justify-center shrink-0 ${isDir ? 'text-[#54aeff]' : 'text-[#8b949e]'}`}>
                                    {isDir ? <FileDirectoryFillIcon size={16} /> : <FileIcon size={16} />}
                                </span>
                                <span className={`truncate ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`} title={item.name}>{item.name}</span>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}
