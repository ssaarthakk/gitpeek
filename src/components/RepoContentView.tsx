'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';

type RepoContentViewProps = {
  repoFullName: string;
};

export default function RepoContentView({ repoFullName }: RepoContentViewProps) {
  const { content, isLoading } = useRepoContent(repoFullName);

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mt-8 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-5 shadow-lg backdrop-blur-sm animate-in fade-in">
        <HeaderSkeleton />
        <ul className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="h-9 w-full overflow-hidden rounded-md bg-white/5 relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!content || !Array.isArray(content)) return null;

  const sorted = [...content].sort((a: any, b: any) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });

  return (
    <div className="w-full max-w-xl mt-8 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-5 shadow-lg backdrop-blur-sm">
      <header className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-inset ring-indigo-400/30 text-indigo-300">
          <span className="text-lg">📦</span>
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold tracking-wide text-white/90">Repository Contents</h3>
          <p className="text-xs font-medium text-white/50 truncate max-w-[18rem]" title={repoFullName}>{repoFullName}</p>
        </div>
      </header>
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        <ul className="space-y-1">
          {sorted.map((item: any, idx: number) => {
            const isDir = item.type === 'dir';
            return (
              <motion.li
                key={item.sha}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.015, duration: 0.25, ease: 'easeOut' }}
                whileHover={{ scale: 1.012 }}
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/70 shadow-inner shadow-black/30 backdrop-blur-sm hover:border-white/15 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span
                  className={
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ' +
                    (isDir
                      ? 'bg-amber-500/15 text-amber-300 ring-amber-400/30 group-hover:bg-amber-500/25'
                      : 'bg-sky-500/15 text-sky-300 ring-sky-400/30 group-hover:bg-sky-500/25')
                  }
                  aria-hidden
                >
                  {isDir ? '📁' : '📄'}
                </span>
                <span className="truncate font-mono tracking-tight" title={item.name}>{item.name}</span>
                {isDir && (
                  <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-amber-200 group-hover:bg-amber-400/25">
                    DIR
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>
        {sorted.length === 0 && (
          <p className="mt-8 text-center text-sm text-white/40">This repository is empty.</p>
        )}
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-white/10 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-56 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}