'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Button, Chip } from '@/components/kit';
import { ShareLink, linkState } from './types';
import { formatDate, timeUntil } from './format';
import { modalClassNames } from './ui';

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
    isDeleting,
}: DeleteConfirmModalProps) {
    const state = linkToDelete ? linkState(linkToDelete) : 'live';
    const ended = state === 'expired' || state === 'used';

    const status = !linkToDelete
        ? ''
        : state === 'used'
          ? 'Used, opened once'
          : state === 'expired'
            ? 'Expired'
            : linkToDelete.expiresAt
              ? `Expires ${timeUntil(linkToDelete.expiresAt)}`
              : 'No expiry';

    const statusTone = ended ? 'danger' : state === 'expiring' ? 'sun' : 'up';

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" classNames={modalClassNames}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-lg font-semibold text-ink">
                            {ended ? 'Delete this link?' : 'Revoke this link?'}
                        </ModalHeader>
                        <ModalBody>
                            {linkToDelete && (
                                <div className="rounded-2xl bg-surface-2 px-4 py-3.5">
                                    <div className="truncate text-sm font-medium text-ink">{linkToDelete.repoFullName}</div>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-3">
                                        <Chip tone={statusTone} dot>
                                            {status}
                                        </Chip>
                                        <span>Created {formatDate(linkToDelete.createdAt)}</span>
                                        <span className="truncate">/view/{linkToDelete.id}</span>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm leading-relaxed text-ink-2">
                                {ended
                                    ? 'The link is removed from your list. This can’t be undone.'
                                    : 'Anyone who has this link loses access straight away, including readers who have it open. This can’t be undone, and the credit isn’t refunded.'}
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => linkToDelete && onConfirmDelete(linkToDelete.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (ended ? 'Deleting…' : 'Revoking…') : ended ? 'Delete link' : 'Revoke link'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
