"use client";

import { BookOpenText, ChevronRight, FileText, Folder, ScanSearch, Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

import {
  systemLogCategories,
  systemLogDiagnosticsStatusMessages,
  systemLogEntries,
  type SystemLogEntry,
  type SystemLogFilter,
  type SystemLogSignal,
} from "@/data/system-logs";
import { cn } from "@/lib/utils";

import { ViewHeader } from "@/components/sections/view-primitives";

const DEFAULT_STATUS_LINE = "Recovered from meeting debris.";

function matchesLogQuery(entry: SystemLogEntry, query: string) {
  if (!query) {
    return true;
  }

  const searchSource = [
    entry.fileName,
    entry.title,
    entry.quote,
    entry.category,
    entry.tags.join(" "),
    entry.context,
  ]
    .join(" ")
    .toLowerCase();

  return searchSource.includes(query);
}

function getSignalTone(signal: SystemLogSignal) {
  switch (signal) {
    case "Moderate":
      return "border-white/10 bg-white/[0.05] text-[color:var(--text-muted)]";
    case "Strong":
      return "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white/88";
    case "Severe":
      return "border-amber-300/20 bg-amber-400/10 text-amber-100";
    default:
      return "border-white/10 bg-white/[0.05] text-[color:var(--text-muted)]";
  }
}

export function LogsView() {
  const [activeFilter, setActiveFilter] = useState<SystemLogFilter>("All Logs");
  const [searchValue, setSearchValue] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(systemLogEntries[0]?.id ?? "");
  const [statusLine, setStatusLine] = useState(DEFAULT_STATUS_LINE);
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();

  const searchMatchedEntries = systemLogEntries.filter((entry) =>
    matchesLogQuery(entry, normalizedQuery),
  );

  const categoryCounts = systemLogCategories.reduce<Record<(typeof systemLogCategories)[number], number>>(
    (counts, category) => {
      counts[category] = searchMatchedEntries.filter((entry) => entry.category === category).length;
      return counts;
    },
    {} as Record<(typeof systemLogCategories)[number], number>,
  );

  const filteredEntries =
    activeFilter === "All Logs"
      ? searchMatchedEntries
      : searchMatchedEntries.filter((entry) => entry.category === activeFilter);

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedEntryId) ?? filteredEntries[0] ?? null;

  const handleDiagnostics = () => {
    if (!filteredEntries.length) {
      setStatusLine("Signal scan returned nothing useful.");
      return;
    }

    const randomEntry =
      filteredEntries[Math.floor(Math.random() * filteredEntries.length)];
    const randomStatus =
      systemLogDiagnosticsStatusMessages[
        Math.floor(Math.random() * systemLogDiagnosticsStatusMessages.length)
      ];

    setSelectedEntryId(randomEntry.id);
    setStatusLine(randomStatus);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setStatusLine("Search filter cleared.");
  };

  return (
    <section className="space-y-6">
      <ViewHeader
        eyebrow="Field Notes"
        title="System Logs"
        description="Field notes, product truths, UX fragments, and recovered thoughts from the parts of the work that usually get buried in meetings."
      />

      <section className="luxe-panel overflow-hidden rounded-[calc(var(--radius-2xl)+0.15rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(115,224,169,0.4)]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              archive://field-notes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
            <span className="rounded-full border border-white/8 bg-black/15 px-3 py-1 font-mono">
              Local index
            </span>
            <span className="rounded-full border border-white/8 bg-black/15 px-3 py-1 font-mono">
              {systemLogEntries.length.toString().padStart(2, "0")} entries
            </span>
          </div>
        </div>

        <div className="grid gap-3 border-b border-white/8 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="system-log-search" className="sr-only">
              Search logs, quotes, or product instincts
            </label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <input
                id="system-log-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search logs, quotes, or product instincts..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/18 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--cool-accent-border)] focus:bg-white/[0.04]"
              />
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/14 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                Visible
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {filteredEntries.length} of {systemLogEntries.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDiagnostics}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-5 text-sm font-medium text-[color:var(--accent-strong)] transition duration-[var(--motion-base)] hover:brightness-110"
          >
            <ScanSearch className="h-4 w-4" />
            Run diagnostics
          </button>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[250px_minmax(0,1.06fr)_minmax(340px,0.94fr)]">
          <aside className="min-w-0 rounded-[1.7rem] border border-white/8 bg-black/14 p-4">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-[color:var(--accent)]" />
              <div>
                <p className="eyebrow">Category Browser</p>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                  Archive folders and counts
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {[
                {
                  filter: "All Logs" as const,
                  count: searchMatchedEntries.length,
                },
                ...systemLogCategories.map((category) => ({
                  filter: category,
                  count: categoryCounts[category],
                })),
              ].map(({ filter, count }) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-[1.2rem] border px-3 py-3 text-left transition duration-[var(--motion-base)]",
                      isActive
                        ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white"
                        : "border-white/8 bg-black/12 text-[color:var(--text-muted)] hover:border-white/14 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border",
                          isActive
                            ? "border-[color:var(--cool-accent-border)] bg-white/[0.06] text-white"
                            : "border-white/8 bg-white/[0.03] text-[color:var(--text-muted)]",
                        )}
                      >
                        <Folder className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{filter}</p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                          Directory
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/8 bg-black/18 px-2.5 py-1 font-mono text-[11px] text-[color:var(--text-muted)]">
                      {count.toString().padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 rounded-[1.7rem] border border-white/8 bg-black/14 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[color:var(--accent)]" />
                <div>
                  <p className="eyebrow">Log Entry List</p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    Browseable records from the archive
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-white/8 bg-black/18 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                {activeFilter}
              </div>
            </div>

            {filteredEntries.length ? (
              <>
                <div className="mt-4 hidden grid-cols-[minmax(0,1.45fr)_minmax(108px,0.58fr)_90px_110px] gap-3 px-4 text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)] md:grid">
                  <span>Log record</span>
                  <span>Category</span>
                  <span>Signal</span>
                  <span>Status</span>
                </div>

                <div className="mt-3 space-y-2">
                  {filteredEntries.map((entry) => {
                    const isSelected = selectedEntry?.id === entry.id;

                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedEntryId(entry.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          "grid w-full gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition duration-[var(--motion-base)] md:grid-cols-[minmax(0,1.45fr)_minmax(108px,0.58fr)_90px_110px] md:items-center",
                          isSelected
                            ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                            : "border-white/8 bg-black/10 hover:border-white/14 hover:bg-white/[0.04]",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                              {entry.fileName}
                            </span>
                            {isSelected ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.08] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white">
                                Selected
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white sm:text-base">
                            {entry.title}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-muted)]">
                            <ChevronRight className="h-4 w-4 shrink-0" />
                            <span>{entry.lastTouched}</span>
                          </div>
                        </div>

                        <div className="text-sm text-white/86">{entry.category}</div>

                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                            getSignalTone(entry.signal),
                          )}
                        >
                          {entry.signal}
                        </span>

                        <div className="text-sm text-[color:var(--text-muted)]">{entry.status}</div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 px-5 py-10 text-center">
                <p className="text-xl font-semibold tracking-[-0.03em] text-white">No logs found.</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--text-muted)]">
                  The archive found nothing. Suspicious, but recoverable.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.08]"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          <aside className="min-w-0 rounded-[1.8rem] border border-white/8 bg-[color:var(--surface-canvas)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-3">
              <BookOpenText className="h-5 w-5 text-[color:var(--accent)]" />
              <div>
                <p className="eyebrow">Preview Viewer</p>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                  Selected log and recovered metadata
                </p>
              </div>
            </div>

            {selectedEntry ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-[1.55rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                    {selectedEntry.fileName}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {selectedEntry.title}
                  </h2>
                  <div className="mt-5 rounded-[1.35rem] border border-white/8 bg-black/18 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                      Recovered quote
                    </p>
                    <blockquote className="mt-3 text-lg leading-8 text-white/92">
                      {selectedEntry.quote}
                    </blockquote>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Category", selectedEntry.category],
                    ["Signal strength", selectedEntry.signal],
                    ["Status", selectedEntry.status],
                    ["Bluntness level", selectedEntry.bluntness],
                    ["Runtime impact", selectedEntry.runtimeImpact],
                    ["Corporate compatibility", selectedEntry.corporateCompatibility],
                    ["Last touched", selectedEntry.lastTouched],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[1.25rem] border border-white/8 bg-black/16 px-4 py-3"
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/88">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.45rem] border border-white/8 bg-black/16 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                    Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/78"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.45rem] border border-white/8 bg-black/16 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                    Context note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                    {selectedEntry.context}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.55rem] border border-dashed border-white/12 bg-black/12 px-5 py-10 text-center">
                <p className="text-xl font-semibold tracking-[-0.03em] text-white">No logs found.</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--text-muted)]">
                  The archive found nothing. Suspicious, but recoverable.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.08]"
                >
                  Clear search
                </button>
              </div>
            )}
          </aside>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/8 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Archive integrity: Stable
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Entries indexed: {systemLogEntries.length}
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Scope: {activeFilter}
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Visible: {filteredEntries.length}
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            {statusLine}
          </span>
        </div>
      </section>
    </section>
  );
}
