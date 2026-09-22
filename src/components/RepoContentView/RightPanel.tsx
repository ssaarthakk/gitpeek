'use client';

import { Fragment, useEffect, useRef } from "react";
import ContentLoadingBar from "./ContentLoadingBar";
import { renderFileContent } from "./FileRenderer";
import { CodeSkeleton, RightDirSkeleton } from "./Skeletons";
import { fileKindLabel, formatBytes, isImage, isMarkdown } from "./utils";
import { FileDirectoryFillIcon, FileIcon } from "@primer/octicons-react";
import { Chip } from "@/components/kit";

type RightPanelProps = {
    selectedPath: string | null;
    selectedType: 'file' | 'dir' | null;
    selectedSize?: number | null;
    rightDirContent: any[];
    isRightDirLoading: boolean;
    rightDirError: any;
    rightFileContent: string | null;
    rightFileRaw: string | null;
    isRightFileLoading: boolean;
    selectItem: (item: any) => void;
    setSelectedPath: (path: string) => void;
    setSelectedType: (type: 'file' | 'dir') => void;
    allowCopying?: boolean;
};

export default function RightPanel({
    selectedPath,
    selectedType,
    selectedSize,
    rightDirContent,
    isRightDirLoading,
    rightDirError,
    rightFileContent,
    rightFileRaw,
    isRightFileLoading,
    selectItem,
    setSelectedPath,
    setSelectedType,
    allowCopying,
}: RightPanelProps) {

    const rightDirSorted = Array.isArray(rightDirContent)
        ? [...rightDirContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    const segments = selectedPath ? selectedPath.split('/').filter(Boolean) : [];

    const isFile = selectedType === 'file' && !!selectedPath;
    const isDir = selectedType === 'dir' && !!selectedPath;

    // Long paths scroll inside the breadcrumb pill; keep the current item in view.
    const crumbsRef = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = crumbsRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, [selectedPath]);

    let meta = '';
    if (isFile) {
        const parts = [];
        if (typeof selectedSize === 'number') parts.push(formatBytes(selectedSize));
        parts.push(fileKindLabel(selectedPath!));
        meta = parts.join(' · ');
    } else if (isDir) {
        meta = 'folder';
    }

    let footRight = '';
    if (isDir && rightDirContent && !isRightDirLoading) {
        footRight = `${rightDirSorted.length} item${rightDirSorted.length === 1 ? '' : 's'}`;
    } else if (isFile && rightFileContent && !isRightFileLoading) {
        if (isImage(selectedPath!) && rightFileRaw) footRight = 'image';
        else if (isMarkdown(selectedPath!)) footRight = 'rendered markdown';
        else {
            const lines = rightFileContent.split('\n').length;
            footRight = `${lines} line${lines === 1 ? '' : 's'}`;
        }
    }

    return (
        <section
            className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-line bg-surface"
            aria-label="File content"
        >
            <ContentLoadingBar isLoading={isRightDirLoading || isRightFileLoading} />

            {/* toolbar */}
            <div className="flex shrink-0 items-center gap-2 border-b border-line p-3">
                <nav
                    ref={crumbsRef}
                    aria-label="Selected path"
                    className="no-scrollbar flex h-10 min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full bg-surface-2 px-4"
                >
                    {segments.length === 0 && <span className="text-[13px] text-ink-4">No file selected</span>}
                    {segments.map((segment, idx) => {
                        const full = segments.slice(0, idx + 1).join('/');
                        const isLast = idx === segments.length - 1;
                        return (
                            <Fragment key={full}>
                                {idx > 0 && <span className="shrink-0 text-[13px] text-ink-4">/</span>}
                                {isLast ? (
                                    <span className="shrink-0 text-[13px] font-semibold text-ink" aria-current="page">{segment}</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPath(full);
                                            setSelectedType('dir');
                                        }}
                                        className="shrink-0 text-[13px] text-ink-3 transition-colors hover:text-ink"
                                    >
                                        {segment}
                                    </button>
                                )}
                            </Fragment>
                        );
                    })}
                </nav>
                {meta && (
                    <span className="hidden shrink-0 sm:flex">
                        <Chip className="tabular-nums">{meta}</Chip>
                    </span>
                )}
                {!allowCopying && (
                    <span className="hidden shrink-0 sm:flex" title="The owner turned off copying and downloads for this link.">
                        <Chip tone="sun">Copy disabled</Chip>
                    </span>
                )}
            </div>

            {/* body */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
                {!selectedPath && (
                    <div className="flex h-full items-center justify-center p-4">
                        <div className="hatch flex w-full max-w-md flex-col items-center gap-2 rounded-2xl px-6 py-12 text-center">
                            <div className="text-lg font-semibold text-ink-2">Nothing selected</div>
                            <div className="text-[13px] text-ink-3">
                                <span className="md:hidden">Open the file list to pick a file.</span>
                                <span className="hidden md:inline">Pick a file on the left.</span>
                            </div>
                        </div>
                    </div>
                )}

                {isDir && (
                    <div className="custom-scrollbar absolute inset-0 overflow-y-auto">
                        {rightDirError && !isRightDirLoading && (
                            <p className="m-3 rounded-xl bg-danger-soft px-4 py-3 text-[13px] text-danger">Couldn&apos;t load this folder.</p>
                        )}
                        {isRightDirLoading && !rightDirError && <RightDirSkeleton />}
                        {rightDirContent && !isRightDirLoading && rightDirSorted.length > 0 && (
                            <div className="p-2 text-[13px]">
                                <div
                                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-3 py-2 text-xs text-ink-4 sm:grid-cols-[minmax(0,1fr)_96px] md:grid-cols-[minmax(0,1fr)_96px_96px]"
                                >
                                    <span>Name</span>
                                    <span className="hidden md:block">Type</span>
                                    <span className="hidden text-right sm:block">Size</span>
                                </div>
                                {rightDirSorted.map((child: any) => {
                                    const childIsDir = child.type === 'dir';
                                    return (
                                        <button
                                            key={child.sha}
                                            type="button"
                                           
                                            onClick={() => selectItem(child)}
                                            className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-hover sm:grid-cols-[minmax(0,1fr)_96px] md:grid-cols-[minmax(0,1fr)_96px_96px]"
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span className={childIsDir ? 'flex shrink-0 text-ink-3' : 'flex shrink-0 text-ink-4'}>
                                                    {childIsDir ? <FileDirectoryFillIcon size={14} /> : <FileIcon size={14} />}
                                                </span>
                                                <span className="truncate text-ink-2 group-hover:text-ink" title={child.name}>{child.name}</span>
                                            </span>
                                            <span className="hidden text-xs text-ink-4 md:block">{childIsDir ? 'Folder' : 'File'}</span>
                                            <span className="hidden text-right text-xs tabular-nums text-ink-4 sm:block">
                                                {!childIsDir && typeof child.size === 'number' ? formatBytes(child.size) : ''}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {rightDirContent && !isRightDirLoading && !rightDirError && rightDirSorted.length === 0 && (
                            <div className="hatch m-3 rounded-2xl px-4 py-10 text-center text-[13px] text-ink-3">This folder is empty.</div>
                        )}
                    </div>
                )}

                {isFile && (
                    <div className="custom-scrollbar absolute inset-0 overflow-auto">
                        {isRightFileLoading && <CodeSkeleton />}
                        {rightFileContent && !isRightFileLoading && renderFileContent(selectedPath!, rightFileContent, rightFileRaw)}
                        {!isRightFileLoading && !rightFileContent && (
                            <div className="hatch m-3 rounded-2xl px-4 py-10 text-center text-[13px] text-ink-3">No preview available for this file.</div>
                        )}
                    </div>
                )}
            </div>

            {/* footer */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-5 py-2.5">
                <span className="min-w-0 text-xs leading-snug text-ink-4">
                    Read-only. Nothing you do here reaches the repository.
                </span>
                {footRight && <span className="shrink-0 text-xs tabular-nums text-ink-4">{footRight}</span>}
            </div>
        </section>
    );
}
