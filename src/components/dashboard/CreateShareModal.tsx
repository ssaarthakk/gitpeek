'use client';
import { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
    Switch,
    Input
} from '@heroui/react';

type CreateShareModalProps = {
    isOpen: boolean;
    onOpenChange: () => void;
    selectedRepo: string;
    selectedExpiry: string;
    setSelectedExpiry: (expiry: string) => void;
    onCreateShareLink: (password?: string, isOneTime?: boolean) => void;
    isCreating: boolean;
};

export default function CreateShareModal({
    isOpen,
    onOpenChange,
    selectedRepo,
    selectedExpiry,
    setSelectedExpiry,
    onCreateShareLink,
    isCreating
}: CreateShareModalProps) {
    const [passwordProtected, setPasswordProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [isOneTime, setIsOneTime] = useState(false);

    const [wasCreating, setWasCreating] = useState(false);
    if (isCreating && !wasCreating) setWasCreating(true);
    if (!isCreating && wasCreating) {
        setPasswordProtected(false);
        setPassword('');
        setIsOneTime(false);
        setWasCreating(false);
    }

    const handleCreate = () => {
        if (passwordProtected && password) {
            onCreateShareLink(password, isOneTime);
        } else {
            onCreateShareLink(undefined, isOneTime);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => {
                onOpenChange();
                if (!open) {
                    setPasswordProtected(false);
                    setPassword('');
                    setIsOneTime(false);
                }
            }}
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
                                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Create Share Link</h3>
                                    <p className="text-sm text-white/70">Generate a secure link to share your repository</p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <p className="text-white/90">
                                    Create a shareable link for the selected repository. Choose when the link should expire.
                                </p>

                                {selectedRepo && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-mono text-sm text-white font-medium">
                                                    {selectedRepo}
                                                </p>
                                                <p className="text-xs text-white/50">
                                                    Selected repository
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Link Expiration
                                    </label>
                                    <Select
                                        selectedKeys={selectedExpiry ? [selectedExpiry] : []}
                                        selectionMode="single"
                                        onSelectionChange={(keys) => {
                                            try {
                                                const keysArray = Array.from(keys);
                                                if (keysArray.length > 0) {
                                                    const selected = keysArray[0] as string;
                                                    setSelectedExpiry(selected);
                                                }
                                            } catch (error) {
                                                console.error('Selection change error:', error);
                                            }
                                        }}
                                        classNames={{
                                            trigger: "bg-white/10 border-white/20 text-white",
                                            value: "text-white",
                                            popoverContent: "bg-[#161b22] border border-white/10"
                                        }}
                                    >
                                        <SelectItem key="never" className="text-white">
                                            Never (Permanent)
                                        </SelectItem>
                                        <SelectItem key="1-hour" className="text-white">
                                            1 Hour
                                        </SelectItem>
                                        <SelectItem key="24-hours" className="text-white">
                                            24 Hours
                                        </SelectItem>
                                        <SelectItem key="7-days" className="text-white">
                                            7 Days
                                        </SelectItem>
                                    </Select>
                                    <p className="text-xs text-white/50">
                                        {selectedExpiry === 'never'
                                            ? 'The link will remain active until manually deleted'
                                            : `The link will automatically expire after ${selectedExpiry.includes('-') ? selectedExpiry.replace('-', ' ') : selectedExpiry}`
                                        }
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-white">
                                            Password Protection
                                        </label>
                                        <Switch
                                            isSelected={passwordProtected}
                                            onValueChange={setPasswordProtected}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-indigo-600"
                                            }}
                                        />
                                    </div>
                                    {passwordProtected && (
                                        <Input
                                            type="password"
                                            label="Password"
                                            placeholder="Enter a password to protect this link"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            classNames={{
                                                inputWrapper: "bg-white/10 border-white/20",
                                                input: "text-white",
                                                label: "text-white/70"
                                            }}
                                        />
                                    )}
                                    <p className="text-xs text-white/50">
                                        {passwordProtected
                                            ? 'Viewers will need to enter the password to access the repository'
                                            : 'Anyone with the link can view the repository'
                                        }
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-white">
                                                One-Time Link
                                            </label>
                                            <p className="text-xs text-white/50 mt-1">
                                                Link will be automatically deleted after first view
                                            </p>
                                        </div>
                                        <Switch
                                            isSelected={isOneTime}
                                            onValueChange={setIsOneTime}
                                            classNames={{
                                                wrapper: "group-data-[selected=true]:bg-indigo-600"
                                            }}
                                        />
                                    </div>
                                </div>
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
                                color="primary"
                                onPress={handleCreate}
                                isLoading={isCreating}
                                className="bg-indigo-600 hover:bg-indigo-700"
                                isDisabled={passwordProtected && !password}
                            >
                                {isCreating ? 'Creating...' : 'Create Share Link'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
