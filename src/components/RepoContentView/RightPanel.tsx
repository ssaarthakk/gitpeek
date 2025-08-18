import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import ContentLoadingBar from "./ContentLoadingBar";
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
        <div className="flex-1 flex flex-col rounded-xl bg-white/[0.04] backdrop-blur-md shadow-[0_4px_22px_-6px_rgba(0,0,0,0.55)] overflow-hidden ring-1 ring-white/5 min-h-[320px] relative">
            <ContentLoadingBar isLoading={isRightDirLoading || isRightFileLoading} />
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
                                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                                                <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                                                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/>
                                                            </svg>
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
