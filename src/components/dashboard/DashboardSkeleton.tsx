import { cx } from '@/components/kit';

/** A pulsing placeholder block on surface-2. */
export function Bone({ className }: { className?: string }) {
    return <div className={cx('animate-pulse bg-surface-2', className)} />;
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

/** First-load layout of the overview: performance tile, repo strip, three tiles. */
export function OverviewSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <TileBone>
                <div className="mb-5 flex items-center justify-between">
                    <Bone className="h-5 w-40 rounded-full" />
                    <Bone className="h-10 w-10 rounded-full" />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
                    <div className="flex flex-col gap-5">
                        <Bone className="mt-2 h-10 w-40 rounded-full" />
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((i) => (
                                <Bone key={i} className="h-[86px] rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <Bone className="h-[300px] rounded-[22px]" />
                </div>
            </TileBone>
            <TileBone className="py-3 sm:py-3">
                <div className="flex gap-3 overflow-hidden">
                    {[0, 1, 2, 3].map((i) => (
                        <Bone key={i} className="h-[68px] w-[240px] shrink-0 rounded-2xl" />
                    ))}
                </div>
            </TileBone>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((i) => (
                    <TileBone key={i} className={i === 0 ? 'md:col-span-2 xl:col-span-1' : undefined}>
                        <Bone className="mb-6 h-5 w-32 rounded-full" />
                        <Bone className="h-[160px] rounded-2xl" />
                    </TileBone>
                ))}
            </div>
        </div>
    );
}

/** Whole signed-in page while the session loads. */
export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-bg text-ink">
            <NavbarSkeleton />
            <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
                <OverviewSkeleton />
            </main>
        </div>
    );
}
