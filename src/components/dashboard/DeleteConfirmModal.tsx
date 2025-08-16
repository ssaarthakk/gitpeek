'use client';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip
} from '@heroui/react';

type ShareLink = {
    id: string;
    repoFullName: string;
    createdAt: string;
    expiresAt: string | null;
};

type DeleteConfirmModalProps = {
    isOpen: boolean;
    onOpenChange: () => void;
    linkToDelete: ShareLink | null;
    onConfirmDelete: (linkId: string) => void;
    isDeleting: boolean;
};

export default function DeleteConfirmModal({
    isOpen,
    onOpenChange,
    linkToDelete,
    onConfirmDelete,
    isDeleting
}: DeleteConfirmModalProps) {
    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
                base: "bg-[#161b22] border border-white/10",
                header: "border-b border-white/10",
                body: "py-6",
                footer: "border-t border-white/10"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Delete Share Link</h3>
                                    <p className="text-sm text-white/70">This action cannot be undone</p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <p className="text-white/90">
                                    Are you sure you want to delete this share link? This will permanently remove the link and make it inaccessible to anyone who has it.
                                </p>

                                {linkToDelete && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-mono text-sm text-white font-medium">
                                                    {linkToDelete.repoFullName}
                                                </p>
                                                <p className="text-xs text-white/50">
                                                    Created: {new Date(linkToDelete.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Chip
                                                size="sm"
                                                color={isExpired(linkToDelete.expiresAt) ? "danger" : "success"}
                                                variant="flat"
                                            >
                                                {isExpired(linkToDelete.expiresAt) ? "Expired" : "Active"}
                                            </Chip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={onClose}
                                className="text-white/70 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => linkToDelete && onConfirmDelete(linkToDelete.id)}
                                isLoading={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Link'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
