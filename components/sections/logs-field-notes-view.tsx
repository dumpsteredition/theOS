"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Crosshair,
  Quote,
  Search,
  Shuffle,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import {
  systemLogCategories,
  systemLogEntries,
  type SystemLogCategory,
  type SystemLogEntry,
} from "@/data/system-logs";
import { cn } from "@/lib/utils";

import { ViewHeader } from "@/components/sections/view-primitives";

const ALL_TOPICS = "All Notes";

type TopicFilter = typeof ALL_TOPICS | SystemLogCategory;

const cleanSystemLogEntries = systemLogEntries;

function matchesQuery(entry: SystemLogEntry, query: string) {
  if (!query) {
    return true;
  }

  return [
    entry.title,
    entry.quote,
    entry.context,
    entry.category,
    entry.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function getCategoryCount(category: SystemLogCategory) {
  return cleanSystemLogEntries.filter((entry) => entry.category === category).length;
}

function getEntryAccent(entry: SystemLogEntry) {
  switch (entry.category) {
    case "Healthcare Reality":
      return "from-emerald-300/16 via-cyan-300/8 to-transparent";
    case "UX Notes":
      return "from-sky-300/16 via-indigo-300/8 to-transparent";
    case "User Reality":
      return "from-rose-300/14 via-amber-200/8 to-transparent";
    case "Design vs Art":
      return "from-violet-300/14 via-fuchsia-300/8 to-transparent";
    case "Opinion vs Truth":
      return "from-amber-300/16 via-orange-200/8 to-transparent";
    default:
      return "from-[color:var(--accent)]/16 via-white/6 to-transparent";
  }
}

export function LogsFieldNotesView() {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<TopicFilter>(ALL_TOPICS);
  const [selectedEntryId, setSelectedEntryId] = useState(
    cleanSystemLogEntries[0]?.id ?? "",
  );
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const topics = useMemo(
    () =>
      systemLogCategories
        .map((category) => ({
          category,
          count: getCategoryCount(category),
        }))
        .filter(({ count }) => count > 0),
    [],
  );

  const filteredEntries = useMemo(
    () =>
      cleanSystemLogEntries.filter((entry) => {
        const topicMatches =
          activeTopic === ALL_TOPICS || entry.category === activeTopic;

        return topicMatches && matchesQuery(entry, normalizedQuery);
      }),
    [activeTopic, normalizedQuery],
  );

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedEntryId) ??
    filteredEntries[0] ??
    cleanSystemLogEntries[0];

  const handleShuffle = () => {
    if (!filteredEntries.length) {
      return;
    }

    const currentIndex = filteredEntries.findIndex(
      (entry) => entry.id === selectedEntry?.id,
    );
    const nextIndex =
      filteredEntries.length === 1
        ? 0
        : (currentIndex + 1 + Math.floor(Math.random() * (filteredEntries.length - 1))) %
          filteredEntries.length;

    setSelectedEntryId(filteredEntries[nextIndex].id);
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  return (
    <section className="space-y-6">
      <ViewHeader
        eyebrow="System Logs Concept"
        title="Field Notes Wall"
        description="A cleaner read on the strongest product instincts: less machinery, more signal, and fewer things pretending to be a database."
        actions={
          <Link
            href="/logs"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/84 transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Current logs
          </Link>
        }
      />

      <section className="luxe-panel overflow-hidden rounded-[calc(var(--radius-2xl)+0.15rem)]">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.62fr)]">
          <div className="relative min-h-[420px] overflow-hidden border-b border-white/8 p-5 sm:p-7 xl:border-b-0 xl:border-r">
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.08),transparent_26%)]",
                `bg-gradient-to-br ${getEntryAccent(selectedEntry)}`,
              )}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent xl:inset-x-10"
            />

            <div className="relative flex h-full min-h-[360px] flex-col justify-between gap-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                  <Crosshair className="h-3.5 w-3.5" />
                  Active note
                </div>
                <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                  {filteredEntries.length || 0} visible
                </span>
              </div>

              <div className="max-w-4xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/42">
                  {selectedEntry.category}
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl">
                  {selectedEntry.title}
                </h2>
                <blockquote className="mt-7 max-w-4xl text-2xl font-semibold leading-9 tracking-[-0.04em] text-white/92 sm:text-[2.85rem] sm:leading-[1.06]">
                  &ldquo;{selectedEntry.quote}&rdquo;
                </blockquote>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--text-soft)]">
                  {selectedEntry.context}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-black/18 px-3 py-1.5 text-xs text-white/78"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-white/84 transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.08] hover:text-white"
                >
                  <Shuffle className="h-4 w-4 text-[color:var(--accent)]" />
                  Next note
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-5 bg-black/10 p-5 sm:p-7">
            <div className="space-y-3">
              <p className="eyebrow">Signal Controls</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search product truths..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/18 pl-11 pr-12 text-sm text-white outline-none placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--cool-accent-border)] focus:bg-white/[0.04]"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-[color:var(--text-muted)] hover:bg-white/[0.06] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveTopic(ALL_TOPICS)}
                aria-pressed={activeTopic === ALL_TOPICS}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-[var(--motion-base)]",
                  activeTopic === ALL_TOPICS
                    ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white"
                    : "border-white/8 bg-black/14 text-white/74 hover:border-white/14 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <span className="text-sm font-medium">{ALL_TOPICS}</span>
                <span className="font-mono text-[11px] text-[color:var(--text-muted)]">
                  {cleanSystemLogEntries.length}
                </span>
              </button>

              {topics.map(({ category, count }) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveTopic(category)}
                  aria-pressed={activeTopic === category}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-[var(--motion-base)]",
                    activeTopic === category
                      ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white"
                      : "border-white/8 bg-black/14 text-white/74 hover:border-white/14 hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="font-mono text-[11px] text-[color:var(--text-muted)]">
                    {count}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-[1.35rem] border border-white/8 bg-black/16 p-4">
              <div className="flex items-start gap-3">
                <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                  The alternate direction treats each log like a usable thought instead
                  of a file record.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {filteredEntries.map((entry, index) => {
          const isSelected = selectedEntry.id === entry.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelectedEntryId(entry.id)}
              className={cn(
                "group relative min-h-[220px] overflow-hidden rounded-[1.75rem] border p-5 text-left transition duration-[var(--motion-base)]",
                isSelected
                  ? "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)]"
                  : "border-white/8 bg-black/14 hover:border-white/14 hover:bg-white/[0.04]",
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-80 transition duration-[var(--motion-slow)] group-hover:opacity-100",
                  `bg-gradient-to-br ${getEntryAccent(entry)}`,
                )}
              />
              <div className="relative flex h-full flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-black/18 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                      {entry.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/34">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <Quote className="mt-5 h-5 w-5 text-[color:var(--accent)]" />
                  <p className="mt-4 text-xl font-semibold leading-7 tracking-[-0.035em] text-white/92">
                    {entry.quote}
                  </p>
                </div>

                <div>
                  <p className="line-clamp-2 text-sm leading-6 text-[color:var(--text-muted)]">
                    {entry.context}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/78">
                    Focus note
                    <ArrowRight className="h-4 w-4 text-[color:var(--accent)] transition duration-[var(--motion-base)] group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {!filteredEntries.length ? (
        <section className="rounded-[1.75rem] border border-dashed border-white/12 bg-black/12 px-5 py-10 text-center">
          <p className="text-xl font-semibold tracking-[-0.03em] text-white">
            No notes found.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--text-muted)]">
            The query is too narrow for this archive pass.
          </p>
        </section>
      ) : null}
    </section>
  );
}
