import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { CodeSkeleton, RightDirSkeleton } from "./Skeletons";
import { renderFileContent } from "./FileRenderer";

type RightPanelProps = {
    selectedPath: string | null;
    selectedType: 'file' | 'dir' | null;
    rightDirContent: any[];
    isRightDirLoading: boolean;
    rightDirError: any;
    rightFileContent: string | null;
    rightFileRaw: string | null;
    isRightFileLoading: boolean;
    selectItem: (item: any) => void;
    setSelectedPath: (path: string) => void;
    setSelectedType: (type: 'file' | 'dir') => void;
};

export default function RightPanel({
    selectedPath,
    selectedType,
    rightDirContent,
    isRightDirLoading,
    rightDirError,
    rightFileContent,
    rightFileRaw,
    isRightFileLoading,
    selectItem,
    setSelectedPath,
    setSelectedType
}: RightPanelProps) {

    const rightDirSorted = Array.isArray(rightDirContent)
        ? [...rightDirContent].sort((a: any, b: any) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
        : [];

    return (
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
    )
}
