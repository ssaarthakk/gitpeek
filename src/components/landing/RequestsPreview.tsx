import { Chip, Tile } from '@/components/kit';

/**
 * Static picture of the dashboard's access-request list. Sample data only.
 * Mirrors the real behaviour in src/actions/approveRequest.ts: approving creates
 * a new 7-day link that the owner copies and sends.
 */
export default function RequestsPreview() {
  return (
    <Tile
      tone="glass"
      title="Access requests"
      actions={
        <Chip tone="sun" dot>
          1 waiting
        </Chip>
      }
      bodyClassName="flex flex-col gap-2"
    >
      <div className="rounded-2xl bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-ink">dana@example.com</span>
            <span className="truncate text-[12.5px] text-ink-3">acme/payments-api · 11 minutes ago</span>
            <p className="mt-1.5 text-[13.5px] text-ink-2">“Could I have one more day to finish the review?”</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <span className="inline-flex h-8 items-center rounded-full border border-line-strong px-3.5 text-[13px] font-semibold text-ink-2">
              Dismiss
            </span>
            <span className="inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-[13px] font-semibold text-bg">Approve</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-ink">k.morrow@example.com</span>
          <span className="truncate text-[12.5px] text-ink-3">acme/infra-terraform · 2 hours ago</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-up-soft px-3 py-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-up">Approved. Send them this link:</div>
            <div className="mt-0.5 break-all text-xs text-ink-2">/view/cm4k2x9p0000…</div>
          </div>
        </div>
      </div>

      <p className="px-1 pt-1 text-[12.5px] text-ink-3">Approving makes a new link that lasts 7 days. It doesn’t use a credit.</p>
    </Tile>
  );
}
