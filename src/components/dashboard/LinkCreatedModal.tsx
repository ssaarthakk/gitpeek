'use client';
import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter } from '@heroui/react';
import { buttonClass, cx } from '@/components/kit';
import { ShareLink, hasPassword } from './types';
import { timeUntil } from './format';
import { modalClassNames } from './ui';

type LinkCreatedModalProps = {
    link: ShareLink | null;
    /** True when the link was already written to the clipboard on creation. */
    copiedOnCreate: boolean;
    onClose: () => void;
};

/** "Link is live" — shown after a link is created: the URL on an orange tile, then its rules. */
export default function LinkCreatedModal({ link, copiedOnCreate, onClose }: LinkCreatedModalProps) {
    const [copied, setCopied] = useState(copiedOnCreate);

    useEffect(() => {
        setCopied(copiedOnCreate);
    }, [link?.id, copiedOnCreate]);

    const url = link && typeof window !== 'undefined' ? `${window.location.origin}/view/${link.id}` : '';
    const displayUrl = url.replace(/^https?:\/\//, '');

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch (e) {
            console.error('Clipboard write failed', e);
        }
    };

    const restrictions = link
        ? [
              hasPassword(link) ? 'Password' : null,
              link.isOneTime ? 'One open' : null,
              link.allowCopying ? null : 'No copy',
              link.requireEmail ? 'Verified email' : null,
          ].filter(Boolean)
        : [];

    const summary = link
        ? [
              { k: 'Repository', v: link.repoFullName, tick: 'bg-ink' },
              { k: 'Branch', v: link.ref || 'main', tick: 'bg-ink-3' },
              { k: 'Expires', v: link.expiresAt ? timeUntil(link.expiresAt) : 'Never', tick: link.expiresAt ? 'bg-sun' : 'bg-up' },
              { k: 'Restrictions', v: restrictions.length ? restrictions.join(', ') : 'None', tick: 'bg-accent' },
          ]
        : [];

    return (
        <Modal
            isOpen={!!link}
            onOpenChange={(open) => !open && onClose()}
            size="lg"
            placement="center"
            classNames={{ ...modalClassNames, closeButton: cx(modalClassNames.closeButton, 'text-white/80 hover:bg-white/15 active:bg-white/15') }}
        >
            <ModalContent>
                {() => (
                    <>
                        <div className="m-2 rounded-[18px] bg-accent p-5 text-white sm:p-6">
                            <div className="text-[13px] text-white/80">Link is live</div>
                            <div className="mt-3 break-all text-lg font-semibold leading-snug sm:text-xl" title={url}>
                                {displayUrl}
                            </div>
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <button type="button" onClick={copy} className={buttonClass('primary', 'md')}>
                                    {copied ? 'Copied' : 'Copy link'}
                                </button>
                                {copied && <span className="text-[13px] text-white/80">It&apos;s on your clipboard.</span>}
                            </div>
                        </div>
                        <ModalBody>
                            <div className="grid grid-cols-2 gap-2">
                                {summary.map((s) => (
                                    <div key={s.k} className="min-w-0 rounded-2xl bg-surface-2 px-4 py-3">
                                        <div className="flex items-center gap-2 text-xs text-ink-3">
                                            <span className={cx('h-3 w-[3px] rounded-full', s.tick)} />
                                            {s.k}
                                        </div>
                                        <div className="mt-1.5 truncate text-sm font-medium text-ink" title={s.v}>
                                            {s.v}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[13px] leading-relaxed text-ink-3">
                                Anyone with this link can read the selected branch until it expires. You can revoke it from
                                Links at any time.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <button type="button" onClick={onClose} className={buttonClass('secondary', 'md', 'flex-1')}>
                                Done
                            </button>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonClass('primary', 'md', 'flex-1 hover:text-bg')}
                            >
                                Open preview
                            </a>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
