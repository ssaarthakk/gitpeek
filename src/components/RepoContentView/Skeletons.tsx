export function LeftSkeleton() {
    return (
        <ul className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <li key={i} className="h-8 w-full overflow-hidden rounded-md bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </li>
            ))}
        </ul>
    );
}

export function RightDirSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-7 w-full overflow-hidden rounded bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            ))}
        </div>
    );
}

export function CodeSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-3 w-full overflow-hidden rounded bg-white/5 relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>
            ))}
        </div>
    );
}
