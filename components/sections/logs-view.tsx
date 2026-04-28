"use client";

import {
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Quote,
  RotateCcw,
  ScanSearch,
  Search,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

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
const ANY_SIGNAL_FILTER = "Any Signal";
const ANY_STATUS_FILTER = "Any Status";

type SignalFilter = typeof ANY_SIGNAL_FILTER | SystemLogSignal;

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
  const [activeSignal, setActiveSignal] = useState<SignalFilter>(ANY_SIGNAL_FILTER);
  const [activeStatus, setActiveStatus] = useState(ANY_STATUS_FILTER);
  const [searchValue, setSearchValue] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(systemLogEntries[0]?.id ?? "");
  const [statusLine, setStatusLine] = useState(DEFAULT_STATUS_LINE);
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();

  const searchMatchedEntries = useMemo(
    () =>
      systemLogEntries.filter((entry) =>
        matchesLogQuery(entry, normalizedQuery),
      ),
    [normalizedQuery],
  );

  const categoryCounts = useMemo(
    () =>
      systemLogCategories.reduce<Record<(typeof systemLogCategories)[number], number>>(
        (counts, category) => {
          counts[category] = searchMatchedEntries.filter((entry) => entry.category === category).length;
          return counts;
        },
        {} as Record<(typeof systemLogCategories)[number], number>,
      ),
    [searchMatchedEntries],
  );

  const filterOptions = useMemo(
    () => [
      {
        filter: "All Logs" as const,
        count: searchMatchedEntries.length,
      },
      ...systemLogCategories.map((category) => ({
        filter: category,
        count: categoryCounts[category],
      })),
    ],
    [categoryCounts, searchMatchedEntries.length],
  );

  const statusOptions = useMemo(
    () => [ANY_STATUS_FILTER, ...Array.from(new Set(systemLogEntries.map((entry) => entry.status))).sort()],
    [],
  );

  const filteredEntries = useMemo(
    () =>
      searchMatchedEntries.filter((entry) => {
        const matchesCategory = activeFilter === "All Logs" || entry.category === activeFilter;
        const matchesSignal = activeSignal === ANY_SIGNAL_FILTER || entry.signal === activeSignal;
        const matchesStatus = activeStatus === ANY_STATUS_FILTER || entry.status === activeStatus;

        return matchesCategory && matchesSignal && matchesStatus;
      }),
    [activeFilter, activeSignal, activeStatus, searchMatchedEntries],
  );

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedEntryId) ?? filteredEntries[0] ?? null;
  const selectedEntryIndex = selectedEntry
    ? filteredEntries.findIndex((entry) => entry.id === selectedEntry.id)
    : -1;

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

  const handleResetFilters = () => {
    setSearchValue("");
    setActiveFilter("All Logs");
    setActiveSignal(ANY_SIGNAL_FILTER);
    setActiveStatus(ANY_STATUS_FILTER);
    setStatusLine("Archive view reset.");
  };

  const handleStepEntry = (direction: -1 | 1) => {
    if (!filteredEntries.length) {
      setStatusLine("Signal scan returned nothing useful.");
      return;
    }

    const currentIndex = selectedEntryIndex >= 0 ? selectedEntryIndex : 0;
    const nextIndex =
      (currentIndex + direction + filteredEntries.length) % filteredEntries.length;

    setSelectedEntryId(filteredEntries[nextIndex].id);
    setStatusLine(`Field note ${nextIndex + 1} of ${filteredEntries.length}.`);
  };

  const hasActiveFilters =
    Boolean(searchValue.trim()) ||
    activeFilter !== "All Logs" ||
    activeSignal !== ANY_SIGNAL_FILTER ||
    activeStatus !== ANY_STATUS_FILTER;

  return (
    <section className="space-y-6">
      <ViewHeader
        eyebrow="Field Notes"
        title="System Logs"
        description="Field notes, product truths, UX fragments, and recovered thoughts from the parts of the work that usually get buried in meetings."
      />

      <section className="luxe-panel overflow-hidden rounded-[calc(var(--radius-2xl)+0.15rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(115,224,169,0.4)]" />
            <p className="truncate font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              archive://field-notes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            <span className="rounded-full border border-white/8 bg-black/15 px-3 py-1 font-mono">
              Local index
            </span>
            <span className="rounded-full border border-white/8 bg-black/15 px-3 py-1 font-mono">
              {filteredEntries.length} / {systemLogEntries.length} visible
            </span>
          </div>
        </div>

        <div className="border-b border-white/8 px-4 py-4 sm:px-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <label htmlFor="system-log-search" className="sr-only">
              Search logs, quotes, or product instincts
            </label>
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <input
                id="system-log-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search logs, quotes, or product instincts..."
                className="h-13 w-full rounded-2xl border border-white/10 bg-black/18 pl-11 pr-12 text-sm text-white outline-none placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--cool-accent-border)] focus:bg-white/[0.04]"
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[color:var(--text-muted)] hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleDiagnostics}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-5 text-sm font-medium text-[color:var(--accent-strong)] transition duration-[var(--motion-base)] hover:brightness-110 sm:w-auto"
            >
              <ScanSearch className="h-4 w-4" />
              <span className="sm:hidden">Run scan</span>
              <span className="hidden sm:inline">Run diagnostics</span>
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => setActiveFilter("All Logs")}
                aria-pressed={activeFilter === "All Logs"}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-[1.15rem] border px-4 text-sm font-medium transition duration-[var(--motion-base)]",
                  activeFilter === "All Logs"
                    ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white"
                    : "border-white/8 bg-black/14 text-[color:var(--text-muted)] hover:border-white/14 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                All Logs
              </button>

              <label className="grid min-w-0 gap-1.5 rounded-[1.15rem] border border-white/8 bg-black/14 px-3 py-2 sm:min-w-[210px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  Category
                </span>
                <span className="relative block">
                  <select
                    value={activeFilter}
                    onChange={(event) => setActiveFilter(event.target.value as SystemLogFilter)}
                    className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-white outline-none"
                  >
                    {filterOptions.map(({ filter, count }) => (
                      <option key={filter} value={filter}>
                        {filter} ({count})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                </span>
              </label>

              <label className="grid min-w-0 gap-1.5 rounded-[1.15rem] border border-white/8 bg-black/14 px-3 py-2 sm:min-w-[170px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  Signal
                </span>
                <span className="relative block">
                  <select
                    value={activeSignal}
                    onChange={(event) => setActiveSignal(event.target.value as SignalFilter)}
                    className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-white outline-none"
                  >
                    {[ANY_SIGNAL_FILTER, "Moderate", "Strong", "Severe"].map((signal) => (
                      <option key={signal} value={signal}>
                        {signal}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                </span>
              </label>

              <label className="grid min-w-0 gap-1.5 rounded-[1.15rem] border border-white/8 bg-black/14 px-3 py-2 sm:min-w-[180px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  Status
                </span>
                <span className="relative block">
                  <select
                    value={activeStatus}
                    onChange={(event) => setActiveStatus(event.target.value)}
                    className="w-full appearance-none bg-transparent pr-7 text-sm font-medium text-white outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/8 bg-black/12 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                Scope: {activeFilter}
              </span>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white/82 hover:border-white/14 hover:bg-white/[0.07]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(360px,0.72fr)]">
          <div className="min-w-0 rounded-[1.7rem] border border-white/8 bg-black/14 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[color:var(--accent)]" />
                <div>
                  <p className="eyebrow">Log Entries</p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    Structured records from the archive
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-white/8 bg-black/18 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                {filteredEntries.length} visible
              </div>
            </div>

            {filteredEntries.length ? (
              <>
                <div className="mt-4 hidden grid-cols-[minmax(0,1.55fr)_minmax(112px,0.52fr)_92px_104px] gap-4 px-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] md:grid">
                  <span>Record</span>
                  <span>Category</span>
                  <span>Signal</span>
                  <span>Status</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {filteredEntries.map((entry) => {
                    const isSelected = selectedEntry?.id === entry.id;

                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedEntryId(entry.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          "grid w-full gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition duration-[var(--motion-base)] md:grid-cols-[minmax(0,1.55fr)_minmax(112px,0.52fr)_92px_104px] md:items-center",
                          isSelected
                            ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                            : "border-white/8 bg-black/10 hover:border-white/14 hover:bg-white/[0.04]",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                isSelected ? "bg-[color:var(--accent)]" : "bg-white/20",
                              )}
                            />
                            <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                              {entry.fileName}
                            </span>
                          </div>
                          <p className="mt-2 text-base font-semibold text-white">
                            {entry.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--text-muted)] md:hidden">
                            {entry.quote}
                          </p>
                          <p className="mt-2 hidden text-sm text-[color:var(--text-muted)] md:block">
                            {entry.lastTouched}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
                            <span className="rounded-full border border-white/8 bg-black/16 px-2.5 py-1 text-xs text-white/78">
                              {entry.category}
                            </span>
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]",
                                getSignalTone(entry.signal),
                              )}
                            >
                              {entry.signal}
                            </span>
                            <span className="rounded-full border border-white/8 bg-black/16 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                              {entry.status}
                            </span>
                          </div>
                        </div>

                        <div className="hidden text-sm leading-5 text-white/84 md:block">{entry.category}</div>

                        <span
                          className={cn(
                            "hidden w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] md:inline-flex",
                            getSignalTone(entry.signal),
                          )}
                        >
                          {entry.signal}
                        </span>

                        <div className="hidden text-sm text-[color:var(--text-muted)] md:block">{entry.status}</div>
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
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.08]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset filters
                </button>
              </div>
            )}
          </div>

          <aside className="min-w-0 overflow-hidden rounded-[1.8rem] border border-white/8 bg-[color:var(--surface-canvas)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] xl:sticky xl:top-6 xl:self-start">
            <div className="border-b border-white/8 bg-white/[0.025] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
                  <BookOpenText className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow">Selected Entry</p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    Recovered thought, context, and archive metadata
                  </p>
                </div>
              </div>
            </div>

            {selectedEntry ? (
              <div className="space-y-5 p-5">
                <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(115,224,169,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.065),rgba(255,255,255,0.018))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <Quote className="absolute right-5 top-5 h-12 w-12 text-white/[0.07]" />
                  <p className="break-all font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)] sm:break-normal">
                    {selectedEntry.fileName}
                  </p>
                  <h2 className="mt-3 max-w-[26rem] text-lg font-medium leading-7 tracking-[-0.02em] text-white/88">
                    {selectedEntry.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/8 bg-black/16 px-3 py-1.5 text-sm text-white/82">
                      {selectedEntry.category}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em]",
                        getSignalTone(selectedEntry.signal),
                      )}
                    >
                      {selectedEntry.signal}
                    </span>
                    <span className="rounded-full border border-white/8 bg-black/16 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                      {selectedEntry.status}
                    </span>
                  </div>

                  <div className="mt-6 border-l border-[color:var(--accent-border)] pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">
                      Recovered quote
                    </p>
                    <blockquote className="mt-3 text-2xl font-semibold leading-9 tracking-[-0.035em] text-white sm:text-3xl sm:leading-10 xl:text-[1.7rem] xl:leading-10">
                      &quot;{selectedEntry.quote}&quot;
                    </blockquote>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {selectedEntryIndex + 1} of {filteredEntries.length} in current view
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-white/8 bg-black/14 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                    Why it matters
                  </p>
                  <blockquote className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                    {selectedEntry.context}
                  </blockquote>
                </div>

                <dl className="grid gap-x-4 gap-y-3 rounded-[1.35rem] border border-white/8 bg-black/12 p-4 sm:grid-cols-2">
                  {[
                    ["Impact", selectedEntry.runtimeImpact],
                    ["Compatibility", selectedEntry.corporateCompatibility],
                    ["Bluntness", selectedEntry.bluntness],
                    ["Touched", selectedEntry.lastTouched],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-white/88">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/78"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3 xl:hidden">
                  <button
                    type="button"
                    onClick={() => handleStepEntry(-1)}
                    aria-label="Previous field note"
                    className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/18 text-white/78 transition duration-[var(--motion-base)] active:scale-[0.97] active:bg-white/[0.06]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="min-w-0 rounded-2xl border border-white/8 bg-black/14 px-3 py-2 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {selectedEntryIndex + 1} / {filteredEntries.length}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-white/86">
                      {selectedEntry.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStepEntry(1)}
                    aria-label="Next field note"
                    className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/18 text-white/78 transition duration-[var(--motion-base)] active:scale-[0.97] active:bg-white/[0.06]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
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
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.08]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset filters
                </button>
              </div>
            )}
          </aside>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/8 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Archive integrity: Stable
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            Entries indexed: {systemLogEntries.length}
          </span>
          <span className="rounded-full border border-white/8 bg-black/14 px-3 py-1">
            {statusLine}
          </span>
        </div>
      </section>
    </section>
  );
}
