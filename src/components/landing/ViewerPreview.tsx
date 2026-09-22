'use client';

import { useState } from 'react';

type FileEntry = { meta: string; code: string };

// Sample repository shown in the landing-page preview. Illustrative only.
const files: Record<string, FileEntry> = {
  'README.md': {
    meta: '2.4 KB',
    code: `# payments-api

Internal payment orchestration for Acme.
Handles authorization, capture and refunds
across Stripe and Adyen.

## Running locally

    pnpm install
    pnpm dev

Requires DATABASE_URL and STRIPE_SECRET_KEY.`,
  },
  'src/index.ts': {
    meta: '1.1 KB',
    code: `import { Router } from "./router";
import { authorize } from "./auth";
import { capture, refund } from "./ledger";

export const routes = new Router()
  .post("/v1/charges", authorize, capture)
  .post("/v1/refunds", authorize, refund)
  .get("/v1/charges/:id", authorize, lookup);

export default routes.handler();`,
  },
  'src/auth.ts': {
    meta: '3.7 KB',
    code: `import { createHmac, timingSafeEqual } from "node:crypto";

const WINDOW_MS = 5 * 60 * 1000;

export async function authorize(req: Request) {
  const sig = req.headers.get("x-acme-signature");
  const ts  = req.headers.get("x-acme-timestamp");
  if (!sig || !ts) throw new Unauthorized("missing signature");

  const age = Date.now() - Number(ts);
  if (age > WINDOW_MS) throw new Unauthorized("stale request");

  const body     = await req.text();
  const expected = createHmac("sha256", SECRET)
    .update(\`\${ts}.\${body}\`)
    .digest();

  if (!timingSafeEqual(Buffer.from(sig, "hex"), expected)) {
    throw new Unauthorized("bad signature");
  }

  return JSON.parse(body);
}`,
  },
  'package.json': {
    meta: '842 B',
    code: `{
  "name": "payments-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "test": "node --test"
  },
  "dependencies": {
    "stripe": "^18.4.0",
    "zod": "^3.23.8"
  }
}`,
  },
};

const tree = ['src/', 'src/index.ts', 'src/auth.ts', 'src/webhooks.ts', 'package.json', 'README.md'];

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.75 1h4.09c.46 0 .89.22 1.16.59L8 3h6.25c.97 0 1.75.78 1.75 1.75v7.5c0 .97-.78 1.75-1.75 1.75H1.75C.78 14 0 13.22 0 12.25V2.75C0 1.78.78 1 1.75 1z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M9.5 1.5H4a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.5l-4-4z" />
      <path d="M9.5 1.5v4h4" />
    </svg>
  );
}

/** A static, lightly interactive picture of the viewer a reader sees. Clicking a file swaps the code. */
export default function ViewerPreview() {
  const [current, setCurrent] = useState('src/auth.ts');
  const file = files[current];
  const selectable = tree.filter((p) => p in files);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg text-ink">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-semibold">acme/payments-api</span>
          <span className="shrink-0 rounded-full border border-line-strong px-2 py-px text-xs text-ink-2">main</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-2 sm:inline">Read-only</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Expires in 23h 14m
          </span>
        </div>
      </div>

      {/* Phones: files as a scrollable pill row instead of a tree column. */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2.5 sm:hidden">
        {selectable.map((path) => {
          const active = path === current;
          return (
            <button
              key={path}
              type="button"
              onClick={() => setCurrent(path)}
              aria-current={active ? 'true' : undefined}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${active ? 'bg-ink text-bg' : 'bg-surface-2 text-ink-2'}`}
            >
              {path.split('/').pop()}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="hidden border-r border-line p-2 sm:block">
          {tree.map((path) => {
            const isDir = path.endsWith('/');
            const canOpen = !isDir && path in files;
            const active = path === current;
            const nested = !isDir && path.includes('/');
            const name = isDir ? path.slice(0, -1) : path.split('/').pop();
            return (
              <button
                key={path}
                type="button"
                disabled={!canOpen}
                onClick={() => canOpen && setCurrent(path)}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full items-center gap-2 rounded-xl py-[6px] pr-3 text-left ${nested ? 'pl-7' : 'pl-3'} ${
                  active ? 'bg-surface-2' : canOpen ? 'hover:bg-surface' : 'cursor-default'
                }`}
              >
                <span className={`flex ${isDir ? 'text-ink-3' : active ? 'text-accent' : 'text-ink-4'}`}>
                  {isDir ? <FolderIcon /> : <FileIcon />}
                </span>
                <span className={`truncate text-[12.5px] ${active ? 'font-semibold text-ink' : canOpen ? 'text-ink-2' : 'text-ink-4'}`}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1">
            <span className="truncate text-xs text-ink-3">{current}</span>
            <span className="shrink-0 text-xs tabular-nums text-ink-4">{file.meta}</span>
          </div>
          <pre className="custom-scrollbar m-0 h-[280px] overflow-auto px-4 pt-2 pb-4 font-mono text-[12px] leading-[1.75] text-ink-2 sm:h-[340px]">
            {file.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
