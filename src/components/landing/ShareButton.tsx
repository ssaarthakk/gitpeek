'use client';
import { useState } from "react";
import { Button } from "@heroui/button";

type ShareButtonProps = {
    repoFullName: string | null;
    onShare: (repoFullName: string) => Promise<{ link?: string, error?: string }>;
};

export default function ShareButton({ repoFullName, onShare }: ShareButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [shareResult, setShareResult] = useState<{ link?: string; error?: string } | null>(null);

    const handlePress = async () => {
        if (!repoFullName) return;

        setIsLoading(true);
        setShareResult(null);
        const result = await onShare(repoFullName);
        setShareResult(result);
        setIsLoading(false);
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                onPress={handlePress}
                isDisabled={!repoFullName || isLoading}
                className="relative"
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                    Share
                </span>
            </Button>

            {shareResult?.link && (
                <div className="flex items-center gap-2 text-xs">
                    <input
                        type="text"
                        readOnly
                        value={shareResult.link}
                        className="bg-white/10 text-white px-2 py-1 rounded-md w-64"
                    />
                    <Button
                        size="sm"
                        variant="flat"
                        onPress={() => navigator.clipboard.writeText(shareResult.link!)}
                    >
                        Copy
                    </Button>
                </div>
            )}
            {shareResult?.error && (
                <p className="text-red-400 text-xs">Error: {shareResult.error}</p>
            )}
        </div>
    );
}
