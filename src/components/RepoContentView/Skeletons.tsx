const TREE_WIDTHS = ['62%', '48%', '71%', '55%', '40%', '66%', '52%', '58%', '45%', '68%'];
const CODE_WIDTHS = ['38%', '64%', '52%', '0%', '71%', '46%', '83%', '58%', '30%', '0%', '66%', '74%', '41%', '55%', '62%', '0%', '48%', '69%', '35%', '57%'];

export function LeftSkeleton() {
    return (
        <ul className="flex animate-pulse flex-col gap-3.5 py-2" aria-hidden="true">
            {TREE_WIDTHS.map((w, i) => (
                <li key={i} className="flex items-center gap-2.5">
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-surface-2" />
                    <span className="h-3 rounded-full bg-surface-2" style={{ width: w }} />
                </li>
            ))}
        </ul>
    );
}

export function RightDirSkeleton() {
    return (
        <div className="flex animate-pulse flex-col p-2" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3">
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-surface-2" />
                    <span className="h-3 rounded-full bg-surface-2" style={{ width: TREE_WIDTHS[i % TREE_WIDTHS.length] }} />
                </div>
            ))}
        </div>
    );
}

export function CodeSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-[9px] px-5 py-4" aria-hidden="true">
            {CODE_WIDTHS.map((w, i) => (
                <div key={i} className="flex items-center gap-5">
                    <span className="h-3 w-5 shrink-0 rounded-full bg-surface-2" />
                    <span className="h-3 rounded-full bg-surface-2" style={{ width: w }} />
                </div>
            ))}
        </div>
    );
}
