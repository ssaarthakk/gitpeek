import { cx } from '@/components/kit';

/** A pulsing placeholder block on surface-2. */
export function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return <div style={style} className={cx('animate-pulse bg-surface-2', className)} />;
}

function TileBone({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <div className={cx('rounded-[22px] border border-line bg-surface p-5 sm:p-6', className)}>{children}</div>;
}

/** Shell bar placeholder: logo pill, tabs, round buttons. */
export function NavbarSkeleton() {
    return (
        <div className="flex flex-wrap items-center gap-3 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <Bone className="order-1 h-12 w-36 rounded-full" />
            <Bone className="order-3 h-12 w-full lg:order-2 lg:w-[380px] rounded-full" />
            <div className="order-2 ml-auto flex gap-2 lg:order-3">
                <Bone className="h-10 w-10 rounded-full" />
                <Bone className="h-10 w-16 rounded-full" />
                <Bone className="h-10 w-28 rounded-full" />
            </div>
        </div>
    );
}

/** First-load layout of the New link form. */
function NewLinkSkeleton() {
    return (
        <TileBone className="mx-auto w-full max-w-2xl">
            <Bone className="mb-6 h-5 w-48 rounded-full" />
            <Bone className="mb-6 h-[260px] rounded-[18px]" />
            <div className="mb-6 flex gap-1.5">
                {[56, 80, 64].map((w) => (
                    <Bone key={w} className="h-8 rounded-full" style={{ width: w }} />
                ))}
            </div>
            <Bone className="h-12 rounded-full" />
        </TileBone>
    );
}

/** Whole signed-in page while the session loads. */
export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-bg text-ink">
            <NavbarSkeleton />
            <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
                <NewLinkSkeleton />
            </main>
        </div>
    );
}
