import { Fragment } from "react";
import ContentLoadingBar from "./ContentLoadingBar";
import { LeftSkeleton } from "./Skeletons";
import { formatBytes } from "./utils";
import { FileDirectoryFillIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "@primer/octicons-react";
import { IconButton, buttonClass, cx } from "@/components/kit";

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
    sharedBy?: string | null;
    /** Narrow screens: close the tree overlay. */
    onClose?: () => void;
    className?: string;
};

function initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
    sharedBy,
    onClose,
    className = '',
}: LeftPanelProps) {

    const leftSorted = Array.isArray(leftContent)
        ? [...leftContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    const repoName = repoFullName.split('/').pop() || repoFullName;
    const crumbs = [{ name: repoName, path: '' }].concat(
        breadcrumbSegments.map((seg, idx) => ({ name: seg, path: breadcrumbSegments.slice(0, idx + 1).join('/') }))
    );

    return (
        <aside
            className={cx(className, 'relative min-h-0 flex-col overflow-hidden rounded-[22px] border border-line bg-surface tile-sheen')}
            aria-label="Files"
        >
            <ContentLoadingBar isLoading={isLeftLoading} />

            <div className="flex items-start justify-between gap-2 px-5 pb-3 pt-4">
                <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-ink">Files</h2>
                    <nav aria-label="Folder path" className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5">
                        {crumbs.map((crumb, idx) => {
                            const isLast = idx === crumbs.length - 1;
                            return (
                                <Fragment key={crumb.path || '__root'}>
                                    {idx > 0 && <span className="text-xs text-ink-4">/</span>}
                                    {isLast ? (
                                        <span className="break-all text-xs text-ink-2" aria-current="location">{crumb.name}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openDirectoryInLeft(crumb.path)}
                                            className="break-all text-xs text-ink-3 transition-colors hover:text-ink"
                                        >
                                            {crumb.name}
                                        </button>
                                    )}
                                </Fragment>
                            );
                        })}
                    </nav>
                </div>
                {onClose && (
                    <IconButton label="Close file list" size="sm" onClick={onClose} className="md:hidden">
                        <XIcon size={14} />
                    </IconButton>
                )}
            </div>

            <div className="custom-scrollbar relative flex-1 overflow-y-auto px-2 pb-2">
                {leftError && !isLeftLoading && (
                    <div className="mx-1 flex flex-col items-center gap-3 rounded-2xl bg-danger-soft px-4 py-8 text-center">
                        <p className="text-[13px] text-danger">Couldn&apos;t load this folder.</p>
                        <button type="button" onClick={() => openDirectoryInLeft(path)} className={buttonClass('secondary', 'sm')}>
                            Retry
                        </button>
                    </div>
                )}

                {isLeftLoading && leftSorted.length === 0 && !leftError && (
                    <div className="px-3 py-1">
                        <LeftSkeleton />
                    </div>
                )}

                {!isLeftLoading && leftContent && leftSorted.length === 0 && !leftError && (
                    <div className="hatch mx-1 rounded-2xl px-4 py-8 text-center text-[13px] text-ink-3">This folder is empty.</div>
                )}

                <ul className="flex flex-col gap-0.5">
                    {path && (
                        <li>
                            <button
                                type="button"
                                onClick={goUpLeft}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-hover"
                                title="Up one folder"
                            >
                                <span className="flex shrink-0 text-ink-4"><ChevronLeftIcon size={14} /></span>
                                <span className="text-[13px] text-ink-3">Up one folder</span>
                            </button>
                        </li>
                    )}
                    {leftSorted.map((item: any) => {
                        const isDir = item.type === 'dir';
                        const isSelected = selectedPath === item.path;
                        return (
                            <li
                                key={item.sha}
                                className={cx(
                                    'group relative flex items-stretch rounded-xl transition-colors',
                                    isSelected ? 'bg-surface-2' : 'hover:bg-hover',
                                )}
                            >
                                {isSelected && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-accent" aria-hidden="true" />}
                                <button
                                    type="button"
                                    onClick={() => selectItem(item)}
                                    onDoubleClick={() => isDir && openDirectoryInLeft(item.path)}
                                    className="flex min-w-0 flex-1 select-none items-center justify-between gap-2.5 py-2 pl-3 pr-1 text-left"
                                    aria-current={isSelected ? 'true' : undefined}
                                >
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <span className={cx('flex shrink-0', isSelected ? 'text-accent' : isDir ? 'text-ink-3' : 'text-ink-4')}>
                                            {isDir ? <FileDirectoryFillIcon size={14} /> : <FileIcon size={14} />}
                                        </span>
                                        <span className={cx('truncate text-[13px]', isSelected ? 'font-medium text-ink' : 'text-ink-2')} title={item.name}>
                                            {item.name}
                                        </span>
                                    </span>
                                    {!isDir && typeof item.size === 'number' && (
                                        <span className="shrink-0 text-xs tabular-nums text-ink-4">{formatBytes(item.size)}</span>
                                    )}
                                </button>
                                {isDir ? (
                                    <button
                                        type="button"
                                        onClick={() => openDirectoryInLeft(item.path)}
                                        aria-label={`Open ${item.name} in the file list`}
                                        title="Open folder"
                                        className="my-1 mr-1 flex w-7 shrink-0 items-center justify-center rounded-full text-ink-4 transition-colors hover:bg-line-strong hover:text-ink"
                                    >
                                        <ChevronRightIcon size={14} />
                                    </button>
                                ) : (
                                    <span className="w-3 shrink-0" />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {sharedBy && (
                <div className="p-2 pt-0">
                    <div className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hover text-xs font-semibold text-ink-2">
                            {initials(sharedBy)}
                        </span>
                        <div className="min-w-0">
                            <div className="text-xs text-ink-3">Shared by</div>
                            <div className="truncate text-[13px] font-medium text-ink">{sharedBy}</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
