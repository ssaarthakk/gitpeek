import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import ContentLoadingBar from "./ContentLoadingBar";
import { renderFileContent } from "./FileRenderer";
import { FileDirectoryFillIcon, FileIcon } from "@primer/octicons-react";

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
        <div className="flex-1 flex flex-col rounded-md bg-[#0d1117] border border-[#30363d] overflow-hidden min-h-[320px] relative">
            <ContentLoadingBar isLoading={isRightDirLoading || isRightFileLoading} />
            <div className="px-5 py-3 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0 mb-1 md:mb-0">
                        <h3 className="text-sm font-semibold tracking-wide text-[#c9d1d9] whitespace-nowrap">
                            {!selectedPath && 'No Selection'}
                            {selectedType === 'file' && 'File Preview'}
                            {selectedType === 'dir' && 'Folder Contents'}
                        </h3>
                        {(selectedType === 'dir' || (selectedType === 'file' && selectedPath)) && (
                            <div className="max-w-full overflow-hidden">
                                <Breadcrumbs size="sm" className="text-[13px]" itemClasses={{ item: 'text-[#2f81f7] hover:underline cursor-pointer', separator: 'text-[#8b949e]' }}>
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
                                                className={isLast ? 'text-[#c9d1d9] pointer-events-none font-semibold' : ''}
                                            >{segment}</BreadcrumbItem>
                                        );
                                    })}
                                </Breadcrumbs>
                            </div>
                        )}
                    </div>
                </div>
                {selectedType === 'dir' && selectedPath && (
                    <div className="text-[12px] text-[#8b949e]">{rightDirSorted.length} items</div>
                )}
                {selectedType === 'file' && selectedPath && (
                    <div className="text-[12px] text-[#8b949e]">{rightFileContent ? rightFileContent.split('\n').length : 0} lines</div>
                )}
            </div>
            <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
                {!selectedPath && (
                    <div className="h-full flex items-center justify-center text-sm text-[#8b949e]">Select a file or folder from the left.</div>
                )}
                {selectedType === 'dir' && selectedPath && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        {rightDirError && !isRightDirLoading && (
                            <div className="text-[#f85149] text-xs mb-4 p-4">Error loading folder.</div>
                        )}
                        {rightDirContent && !isRightDirLoading && (
                            <table className="w-full text-[14px]">
                                <thead className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10">
                                    <tr className="text-[#8b949e]">
                                        <th className="text-left font-semibold py-2 px-4">Name</th>
                                        <th className="text-left font-semibold py-2 px-4 w-24 hidden md:table-cell">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rightDirSorted.map((child: any) => {
                                        const isDir = child.type === 'dir';
                                        return (
                                            <tr
                                                key={child.sha}
                                                onClick={() => selectItem(child)}
                                                className="group cursor-pointer hover:bg-[#161b22] border-b border-[#21262d] last:border-b-0"
                                            >
                                                <td className="py-2.5 px-4 flex items-center gap-3">
                                                    <span className={`flex items-center justify-center shrink-0 ${isDir ? 'text-[#54aeff]' : 'text-[#8b949e]'}`}>
                                                        {isDir ? <FileDirectoryFillIcon size={16} /> : <FileIcon size={16} />}
                                                    </span>
                                                    <span className="truncate text-[#c9d1d9] hover:text-[#2f81f7] hover:underline" title={child.name}>{child.name}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-[#8b949e] text-[12px] hidden md:table-cell">{isDir ? 'Folder' : 'File'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                        {rightDirContent && rightDirSorted.length === 0 && (
                            <p className="text-center text-[13px] text-[#8b949e] mt-4">This folder is empty.</p>
                        )}
                    </div>
                )}
                {selectedType === 'file' && selectedPath && (
                    <div className="absolute inset-0 overflow-auto custom-scrollbar">
                        {rightFileContent && !isRightFileLoading && renderFileContent(selectedPath, rightFileContent, rightFileRaw)}
                        {!isRightFileLoading && !rightFileContent && (
                            <p className="p-4 text-[13px] text-[#8b949e]">No preview available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
