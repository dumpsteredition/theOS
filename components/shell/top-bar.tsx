"use client";

import { Command, Search } from "lucide-react";

type TopBarProps = {
  breadcrumb: string;
  onOpenCommandPalette: () => void;
};

export function TopBar({ breadcrumb, onOpenCommandPalette }: TopBarProps) {
  return (
    <header className="hidden border-b border-[color:var(--border-subtle)] bg-[rgba(7,10,15,0.82)] px-5 py-2.5 pt-4 backdrop-blur-xl sm:px-6 sm:pt-5 lg:block lg:px-8 lg:py-2 lg:pt-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium tracking-[0.04em] text-white/74">
            Workspace / {breadcrumb}
          </p>
        </div>

        <div className="flex w-full justify-end xl:w-auto">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[color:var(--text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-[var(--motion-base)] hover:border-white/15 hover:bg-white/[0.06] hover:text-white sm:w-[34rem]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Search className="h-4 w-4" />
              <span className="truncate">Search workspace</span>
            </span>
            <span className="hidden shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 font-mono text-xs text-white/80 min-[360px]:inline-flex">
              <Command className="h-3 w-3 sm:hidden" />
              <span className="hidden sm:inline">Cmd K / Ctrl K</span>
              <span className="sm:hidden">Ctrl K</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
