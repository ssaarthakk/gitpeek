'use client';

import useRepoContent from '@/hooks/useRepoContent';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

type RepoContentViewProps = {
  repoFullName: string;
};

export default function RepoContentView({ repoFullName }: RepoContentViewProps) {
    const [path, setPath] = useState('');
  const { content, isLoading, error } = useRepoContent(repoFullName, path);

  const handleItemClick = (item: { type: string; path: string }) => {
    if (item.type === 'dir') setPath(item.path);
  };

  const handleBackClick = () => {
    if (!path) return;
    const segments = path.split('/').filter(Boolean);
    segments.pop();
    setPath(segments.join('/'));
  };

  const breadcrumbs = useMemo(() => {
    const segments = path.split('/').filter(Boolean);
    const crumbs = [] as { label: string; full: string }[];
    segments.forEach((seg, idx) => {
      const full = segments.slice(0, idx + 1).join('/');
      crumbs.push({ label: seg, full });
    });
    return crumbs;
  }, [path]);

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

  if (error) {
    return (
      <div className="w-full max-w-xl mt-8 rounded-xl border border-red-500/30 bg-red-950/30 p-5 text-red-200">
        <p className="font-semibold mb-2">Error loading contents</p>
        <p className="text-sm opacity-80">{error}</p>
        {path && (
          <button onClick={handleBackClick} className="mt-4 text-xs underline hover:text-red-100">Go up a level</button>
        )}
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
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-inset ring-indigo-400/30 text-indigo-300">
            <span className="text-lg">📦</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-semibold tracking-wide text-white/90">Repository Contents</h3>
            <p className="text-xs font-medium text-white/50 truncate max-w-[18rem]" title={repoFullName}>{repoFullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-white/50">
          <button
            disabled={!path}
            onClick={handleBackClick}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            <span
              onClick={() => setPath('')}
              className={`cursor-pointer hover:text-white/90 transition-colors ${!path ? 'text-white' : ''}`}
            >root</span>
            {breadcrumbs.map((c, i) => (
              <span key={c.full} className="flex items-center gap-1">
                <span className="opacity-30">/</span>
                <span
                  onClick={() => setPath(c.full)}
                  className={`cursor-pointer hover:text-white/90 transition-colors ${i === breadcrumbs.length - 1 ? 'text-white' : ''}`}
                >{c.label}</span>
              </span>
            ))}
          </div>
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
                onClick={() => handleItemClick(item)}
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/70 shadow-inner shadow-black/30 backdrop-blur-sm hover:border-white/15 hover:bg-white/10 hover:text-white transition-colors cursor-pointer select-none"
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
                {isDir ? (
                  <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-amber-200 group-hover:bg-amber-400/25">DIR</span>
                ) : (
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-white/30 group-hover:text-white/50">FILE</span>
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