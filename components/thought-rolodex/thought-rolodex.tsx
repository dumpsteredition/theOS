"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ComponentType,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Quote,
  Shuffle,
  Sparkles,
} from "lucide-react";

import { thoughtCategories, thoughts, type ThoughtCategory } from "@/data/thoughts";
import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/toast";

import {
  getRolodexCardPose,
  getRolodexTransition,
  pickThoughtTransition,
  type ThoughtTransitionMode,
} from "./thought-transitions";

type ThoughtRolodexProps = {
  variant?: "module" | "page";
};

const copyResponses = [
  {
    title: "Thought copied.",
    body: "Use responsibly.",
  },
  {
    title: "Quote copied.",
    body: "Liability transferred.",
  },
  {
    title: "Fragment copied.",
    body: "Now do something useful with it.",
  },
] as const;

const getRandomResponse = () =>
  copyResponses[Math.floor(Math.random() * copyResponses.length)] ?? copyResponses[0];

const categoryFilters = ["All", ...thoughtCategories] as const;

const categoryAccents = {
  All: {
    dot: "bg-slate-300",
    tab: "border-white/12 bg-[linear-gradient(180deg,rgba(90,101,125,0.28),rgba(22,28,42,0.78))] text-white/82 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-white/20 bg-[linear-gradient(180deg,rgba(136,152,183,0.34),rgba(37,47,69,0.96))] text-white shadow-[0_22px_40px_rgba(0,0,0,0.3)]",
    chip: "border-white/12 bg-white/[0.06] text-white/84",
    cardGlow: "rgba(160,173,197,0.2)",
    railGlow: "rgba(160,173,197,0.18)",
  },
  "Healthcare AI": {
    dot: "bg-cyan-300",
    tab: "border-cyan-300/18 bg-[linear-gradient(180deg,rgba(72,108,132,0.3),rgba(18,30,39,0.82))] text-cyan-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-cyan-300/36 bg-[linear-gradient(180deg,rgba(86,154,184,0.42),rgba(23,45,57,0.98))] text-cyan-50 shadow-[0_24px_44px_rgba(42,137,172,0.18)]",
    chip: "border-cyan-300/24 bg-cyan-300/10 text-cyan-100",
    cardGlow: "rgba(90,196,231,0.18)",
    railGlow: "rgba(79,176,208,0.15)",
  },
  "UX Systems": {
    dot: "bg-emerald-300",
    tab: "border-emerald-300/18 bg-[linear-gradient(180deg,rgba(66,108,90,0.28),rgba(18,32,28,0.84))] text-emerald-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-emerald-300/34 bg-[linear-gradient(180deg,rgba(82,150,128,0.4),rgba(18,44,37,0.98))] text-emerald-50 shadow-[0_24px_44px_rgba(73,166,128,0.18)]",
    chip: "border-emerald-300/24 bg-emerald-300/10 text-emerald-100",
    cardGlow: "rgba(88,206,158,0.18)",
    railGlow: "rgba(88,206,158,0.14)",
  },
  "Product Philosophy": {
    dot: "bg-fuchsia-300",
    tab: "border-fuchsia-300/18 bg-[linear-gradient(180deg,rgba(112,76,124,0.28),rgba(35,24,39,0.84))] text-fuchsia-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-fuchsia-300/34 bg-[linear-gradient(180deg,rgba(160,109,178,0.42),rgba(53,31,60,0.98))] text-fuchsia-50 shadow-[0_24px_44px_rgba(173,98,189,0.18)]",
    chip: "border-fuchsia-300/24 bg-fuchsia-300/10 text-fuchsia-100",
    cardGlow: "rgba(205,120,232,0.18)",
    railGlow: "rgba(205,120,232,0.15)",
  },
  "Workflow Design": {
    dot: "bg-amber-300",
    tab: "border-amber-300/18 bg-[linear-gradient(180deg,rgba(122,93,63,0.28),rgba(42,29,20,0.84))] text-amber-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-amber-300/34 bg-[linear-gradient(180deg,rgba(179,126,70,0.42),rgba(61,37,22,0.98))] text-amber-50 shadow-[0_24px_44px_rgba(207,136,65,0.18)]",
    chip: "border-amber-300/24 bg-amber-300/10 text-amber-100",
    cardGlow: "rgba(241,173,98,0.2)",
    railGlow: "rgba(241,173,98,0.16)",
  },
  "User Research": {
    dot: "bg-rose-300",
    tab: "border-rose-300/18 bg-[linear-gradient(180deg,rgba(129,76,89,0.28),rgba(41,23,30,0.84))] text-rose-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-rose-300/34 bg-[linear-gradient(180deg,rgba(176,109,131,0.42),rgba(56,27,38,0.98))] text-rose-50 shadow-[0_24px_44px_rgba(224,112,142,0.18)]",
    chip: "border-rose-300/24 bg-rose-300/10 text-rose-100",
    cardGlow: "rgba(240,124,161,0.18)",
    railGlow: "rgba(240,124,161,0.15)",
  },
  "Product Strategy": {
    dot: "bg-blue-300",
    tab: "border-blue-300/18 bg-[linear-gradient(180deg,rgba(73,92,133,0.28),rgba(21,29,43,0.84))] text-blue-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-blue-300/34 bg-[linear-gradient(180deg,rgba(98,132,197,0.42),rgba(25,39,66,0.98))] text-blue-50 shadow-[0_24px_44px_rgba(88,132,233,0.18)]",
    chip: "border-blue-300/24 bg-blue-300/10 text-blue-100",
    cardGlow: "rgba(117,162,255,0.18)",
    railGlow: "rgba(117,162,255,0.15)",
  },
  "Design Philosophy": {
    dot: "bg-violet-300",
    tab: "border-violet-300/18 bg-[linear-gradient(180deg,rgba(92,80,128,0.28),rgba(28,24,42,0.84))] text-violet-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-violet-300/34 bg-[linear-gradient(180deg,rgba(128,112,178,0.42),rgba(36,30,60,0.98))] text-violet-50 shadow-[0_24px_44px_rgba(140,119,233,0.18)]",
    chip: "border-violet-300/24 bg-violet-300/10 text-violet-100",
    cardGlow: "rgba(161,146,255,0.18)",
    railGlow: "rgba(161,146,255,0.15)",
  },
  "No Fluff": {
    dot: "bg-orange-300",
    tab: "border-orange-300/18 bg-[linear-gradient(180deg,rgba(131,88,67,0.28),rgba(42,26,20,0.84))] text-orange-100/80 shadow-[0_16px_32px_rgba(0,0,0,0.24)]",
    tabActive:
      "border-orange-300/34 bg-[linear-gradient(180deg,rgba(190,126,93,0.42),rgba(62,34,22,0.98))] text-orange-50 shadow-[0_24px_44px_rgba(231,141,92,0.18)]",
    chip: "border-orange-300/24 bg-orange-300/10 text-orange-100",
    cardGlow: "rgba(245,160,104,0.18)",
    railGlow: "rgba(245,160,104,0.15)",
  },
} satisfies Record<
  "All" | ThoughtCategory,
  {
    dot: string;
    tab: string;
    tabActive: string;
    chip: string;
    cardGlow: string;
    railGlow: string;
  }
>;

function getCategoryAccent(category: "All" | ThoughtCategory) {
  return categoryAccents[category];
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getVisibleThoughtSet(
  filteredThoughts: typeof thoughts,
  activeIndex: number,
) {
  if (filteredThoughts.length === 0 || activeIndex < 0) {
    return [];
  }

  const seen = new Set<string>();
  const orderedOffsets = [-2, -1, 0, 1, 2];

  return orderedOffsets.flatMap((offset) => {
    const thought = filteredThoughts[wrapIndex(activeIndex + offset, filteredThoughts.length)];

    if (!thought || seen.has(thought.id)) {
      return [];
    }

    seen.add(thought.id);
    return [{ thought, offset }];
  });
}

export function ThoughtRolodex({
  variant = "module",
}: ThoughtRolodexProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const { pushToast } = useToast();
  const shuffleTimersRef = useRef<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<"All" | ThoughtCategory>("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [activeThoughtId, setActiveThoughtId] = useState(thoughts[0]?.id ?? "");
  const [transitionMode, setTransitionMode] = useState<ThoughtTransitionMode>("softFade");
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckHovered, setDeckHovered] = useState(false);

  const filteredThoughts = useMemo(() => {
    return thoughts.filter((thought) => {
      if (activeCategory !== "All" && thought.category !== activeCategory) {
        return false;
      }

      if (featuredOnly && !thought.featured) {
        return false;
      }

      return true;
    });
  }, [activeCategory, featuredOnly]);

  const effectiveActiveThoughtId =
    filteredThoughts.find((thought) => thought.id === activeThoughtId)?.id ??
    filteredThoughts[0]?.id ??
    "";
  const activeThought =
    filteredThoughts.find((thought) => thought.id === effectiveActiveThoughtId) ?? null;
  const activeIndex = activeThought
    ? filteredThoughts.findIndex((thought) => thought.id === activeThought.id)
    : -1;
  const activeCountLabel =
    activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(filteredThoughts.length).padStart(2, "0")}` : "00 / 00";

  const visibleThoughts = useMemo(
    () => getVisibleThoughtSet(filteredThoughts, activeIndex),
    [activeIndex, filteredThoughts],
  );
  const cardTransition = getRolodexTransition(transitionMode, reducedMotion);

  const clearShuffleTimers = useCallback(() => {
    shuffleTimersRef.current.forEach((timer: number) => window.clearTimeout(timer));
    shuffleTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearShuffleTimers();
    };
  }, [clearShuffleTimers]);

  const applyTransitionMode = useCallback(
    (_nextDirection: 1 | -1, mode?: ThoughtTransitionMode) => {
      if (mode) {
        setTransitionMode(reducedMotion ? "softFade" : mode);
        return;
      }

      setTransitionMode((current) => pickThoughtTransition(current, reducedMotion));
    },
    [reducedMotion],
  );

  const setThoughtByIndex = useCallback(
    (index: number, nextDirection: 1 | -1) => {
      if (filteredThoughts.length === 0) {
        return;
      }

      const next = filteredThoughts[wrapIndex(index, filteredThoughts.length)];

      if (!next) {
        return;
      }

      applyTransitionMode(nextDirection, "step");
      setActiveThoughtId(next.id);
    },
    [applyTransitionMode, filteredThoughts],
  );

  const handlePrevious = useCallback(() => {
    if (activeIndex < 0) {
      return;
    }

    setThoughtByIndex(activeIndex - 1, -1);
  }, [activeIndex, setThoughtByIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < 0) {
      return;
    }

    setThoughtByIndex(activeIndex + 1, 1);
  }, [activeIndex, setThoughtByIndex]);

  const handleShuffle = useCallback(() => {
    if (filteredThoughts.length === 0 || isShuffling) {
      return;
    }

    clearShuffleTimers();

    if (filteredThoughts.length === 1) {
      applyTransitionMode(1, "step");
      setActiveThoughtId(filteredThoughts[0].id);
      return;
    }

    setIsShuffling(true);

    const available = filteredThoughts.filter((thought) => thought.id !== activeThought?.id);
    const sequenceLength = reducedMotion ? 1 : Math.min(6, available.length + 1);
    const pool = [...available];
    const sequence = Array.from({ length: sequenceLength }, (_, index) => {
      if (pool.length === 0) {
        return filteredThoughts[Math.floor(Math.random() * filteredThoughts.length)] ?? filteredThoughts[0];
      }

      const chosenIndex = Math.floor(Math.random() * pool.length);
      const [chosen] = pool.splice(chosenIndex, 1);
      return chosen ?? filteredThoughts[index % filteredThoughts.length];
    }).filter(Boolean);

    const finalThought = sequence[sequence.length - 1] ?? filteredThoughts[0];
    const cadence = reducedMotion ? [0] : [0, 90, 190, 310, 460, 660];

    sequence.forEach((thought, index) => {
      const delay = cadence[index] ?? cadence[cadence.length - 1] + index * 170;
      const timer = window.setTimeout(() => {
        const isLast = index === sequence.length - 1;
        applyTransitionMode(1, isLast ? "step" : "shuffle");
        setActiveThoughtId((thought ?? finalThought).id);

        if (isLast) {
          setIsShuffling(false);
        }
      }, delay);

      shuffleTimersRef.current.push(timer);
    });
  }, [
    activeThought?.id,
    applyTransitionMode,
    clearShuffleTimers,
    filteredThoughts,
    isShuffling,
    reducedMotion,
  ]);

  const handleCopy = useCallback(async () => {
    if (!activeThought) {
      return;
    }

    const payload = `"${activeThought.quote}"`;

    try {
      await navigator.clipboard.writeText(payload);
      const response = getRandomResponse();
      pushToast(response);
    } catch {
      pushToast({
        title: "Copy failed.",
        body: "Clipboard diplomacy broke down.",
      });
    }
  }, [activeThought, pushToast]);

  const clearFilters = () => {
    setActiveCategory("All");
    setFeaturedOnly(false);
  };

  const handleKeyboardShortcuts = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const typingTarget = target?.closest("input, textarea, select, [contenteditable='true']");

    if (typingTarget) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrevious();
      return;
    }

    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      handleShuffle();
    }
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(22,28,43,0.5),rgba(8,12,19,0.98))] shadow-[0_30px_84px_rgba(0,0,0,0.24)]",
        variant === "page" ? "px-5 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8" : "px-5 py-6 sm:px-6 sm:py-7",
      )}
      onKeyDown={handleKeyboardShortcuts}
      tabIndex={0}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(126,224,207,0.11),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(147,184,255,0.12),transparent_24%),radial-gradient(circle_at_70%_100%,rgba(155,140,255,0.08),transparent_24%)]"
      />

      <div className="relative space-y-6">
        {variant === "module" ? (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="eyebrow">Thought Rolodex</p>
              <h2 className="text-3xl font-semibold tracking-[-0.055em] text-white sm:text-[2.4rem]">
                A rotating archive of product takes, working principles, and ideas that keep showing up in the work.
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[color:var(--text-muted)]">
                Shuffle through the ideas, filter by theme, or copy one before it disappears back into the stack.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/logs/rolodex"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.07]"
              >
                Open full archive
                <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
              </Link>
            </div>
          </div>
        ) : null}

        <div className="space-y-5">
            <section
              className={cn(
                "artifact-screen rounded-[2rem]",
                variant === "page" ? "p-4 sm:p-6" : "p-4 sm:p-5",
              )}
            >
              <div
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,35,0.98),rgba(7,10,18,0.98))] px-4 py-6 sm:px-6"
                onMouseEnter={() => setDeckHovered(true)}
                onMouseLeave={() => setDeckHovered(false)}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_82%_10%,rgba(128,164,255,0.1),transparent_22%),repeating-linear-gradient(180deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_9px)] opacity-70"
                />

                <div className="relative z-10 space-y-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-2xl space-y-2">
                      <p className="eyebrow">Thought Rolodex</p>
                      <h3 className="text-[clamp(1.8rem,3vw,3.1rem)] font-semibold tracking-[-0.055em] text-white">
                        A rotating archive of product takes, working principles, and ideas that keep showing up in the work.
                      </h3>
                    </div>
                    <p className="max-w-sm text-sm leading-7 text-[color:var(--text-muted)]">
                      Jump by category tab, rotate through the stack, or let shuffle riffle through a few before it lands.
                    </p>
                  </div>

                  <div className="flex items-end gap-2 overflow-x-auto pb-2">
                    {categoryFilters.map((category) => {
                      const accent = getCategoryAccent(category);
                      const isActive = activeCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setActiveCategory(category)}
                          className={cn(
                            "group inline-flex shrink-0 items-center gap-2 rounded-t-[1rem] rounded-b-[0.7rem] border px-3 py-2.5 text-sm font-medium transition duration-[var(--motion-base)] hover:-translate-y-0.5",
                            isActive ? accent.tabActive : accent.tab,
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]", accent.dot)} />
                          <span>{category}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setFeaturedOnly((value) => !value)}
                      className={cn(
                        "ml-auto inline-flex shrink-0 items-center gap-2 rounded-t-[1rem] rounded-b-[0.7rem] border px-3 py-2.5 text-sm font-medium transition duration-[var(--motion-base)] hover:-translate-y-0.5",
                        featuredOnly
                          ? "border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(34,41,56,0.92))] text-white shadow-[0_20px_36px_rgba(0,0,0,0.28)]"
                          : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(18,24,35,0.9))] text-white/72 hover:text-white",
                      )}
                    >
                      <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
                      Most Kyle
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "relative mx-auto mt-6 px-2 pb-16 pt-10 [perspective:2200px] sm:px-6",
                    variant === "page" ? "max-w-[1120px]" : "max-w-[940px]",
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[10%] top-1/2 z-0 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[8%] top-1/2 z-10 h-16 w-6 -translate-y-1/2 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(196,208,229,0.24),rgba(58,66,84,0.9))] shadow-[0_16px_28px_rgba(0,0,0,0.28)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[8%] top-1/2 z-10 h-16 w-6 -translate-y-1/2 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(126,138,159,0.2),rgba(34,40,53,0.92))] shadow-[0_16px_28px_rgba(0,0,0,0.24)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(117,162,255,0.12),transparent_70%)] blur-3xl"
                  />

                  <div
                    className={cn(
                      "relative isolate mx-auto h-[380px] [transform-style:preserve-3d] sm:h-[420px]",
                      variant === "page" ? "max-w-[900px] sm:h-[460px]" : "max-w-[780px]",
                    )}
                  >
                    {activeThought ? (
                      visibleThoughts.map(({ thought, offset }) => {
                        const accent = getCategoryAccent(thought.category);
                        const pose = getRolodexCardPose(offset, reducedMotion);
                        const isActiveCard = offset === 0;
                        const nextDirection = offset >= 0 ? 1 : -1;

                        return (
                          <motion.article
                            key={thought.id}
                            animate={{
                              opacity: pose.opacity,
                              rotateX: pose.rotateX,
                              scale: pose.scale,
                              y: pose.y,
                            }}
                            initial={false}
                            transition={cardTransition}
                            className={cn(
                              "absolute inset-0 rounded-[2rem] border bg-[linear-gradient(180deg,rgba(31,37,50,0.96),rgba(10,13,21,0.98))] transition duration-[var(--motion-base)] [backface-visibility:hidden] [transform-style:preserve-3d]",
                              isActiveCard
                                ? "z-30 border-white/12"
                                : "cursor-pointer border-white/8",
                              isActiveCard && deckHovered && !reducedMotion
                                ? "-translate-y-1"
                                : "",
                            )}
                            style={{
                              zIndex: isActiveCard ? 40 : pose.zIndex,
                              transformOrigin: "center center",
                              boxShadow: isActiveCard
                                ? `0 44px 110px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.04), 0 0 84px ${accent.cardGlow}`
                                : `0 24px 56px rgba(0,0,0,0.24), 0 0 0 1px rgba(255,255,255,0.03), 0 0 42px ${accent.cardGlow}`,
                            }}
                            onClick={() => {
                              if (!isActiveCard) {
                                setThoughtByIndex(activeIndex + offset, nextDirection);
                              }
                            }}
                          >
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%),radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.06),transparent_18%),repeating-linear-gradient(180deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_1px,transparent_1px,transparent_10px)] opacity-80"
                            />
                            <div
                              aria-hidden="true"
                              className={cn(
                                "pointer-events-none absolute left-7 top-[-14px] flex items-center gap-2 rounded-t-[1rem] rounded-b-[0.7rem] border px-3 py-2 text-xs uppercase tracking-[0.16em] shadow-[0_18px_34px_rgba(0,0,0,0.24)]",
                                !isActiveCard && "opacity-90",
                              )}
                              style={{
                                background: `linear-gradient(180deg, ${accent.railGlow}, rgba(20,26,39,0.98))`,
                                borderColor: "rgba(255,255,255,0.1)",
                              }}
                            >
                              <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]", accent.dot)} />
                              {thought.category}
                            </div>

                            {isActiveCard ? (
                              <div className="relative flex h-full flex-col p-6 sm:p-7">
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {thought.featured ? (
                                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/78">
                                        <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                                        Most Kyle
                                      </span>
                                    ) : null}
                                    {thought.containsProfanity ? (
                                      <span className="rounded-full border border-white/10 bg-black/18 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/58">
                                        Unfiltered
                                      </span>
                                    ) : null}
                                  </div>

                                  <div className="rounded-full border border-white/10 bg-black/18 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/68">
                                    {activeCountLabel}
                                  </div>
                                </div>

                                <div className="mt-7 flex gap-4">
                                  <Quote className="mt-1 h-7 w-7 shrink-0 text-white/16" />
                                  <blockquote className="max-w-4xl text-[clamp(1.6rem,2.8vw,2.95rem)] font-semibold leading-[1.14] tracking-[-0.058em] text-white">
                                    {thought.quote}
                                  </blockquote>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                                  {thought.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className={cn(
                                        "rounded-full border px-3 py-1.5 text-sm",
                                        accent.chip,
                                      )}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                  {thought.context ? (
                                    <InfoCell
                                      label="Context"
                                      value={thought.context}
                                    />
                                  ) : null}
                                  {thought.mood ? (
                                    <InfoCell label="Mood" value={thought.mood} />
                                  ) : null}
                                </div>

                                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5">
                                  <div className="flex flex-wrap gap-2">
                                    <ControlButton
                                      onClick={handlePrevious}
                                      label="Previous"
                                      icon={ArrowLeft}
                                      disabled={isShuffling}
                                    />
                                    <ControlButton
                                      onClick={handleNext}
                                      label="Next"
                                      icon={ArrowRight}
                                      disabled={isShuffling}
                                    />
                                    <ControlButton
                                      onClick={handleCopy}
                                      label="Copy"
                                      icon={Copy}
                                      disabled={!activeThought}
                                    />
                                  </div>
                                  <p className="text-sm text-[color:var(--text-muted)]">
                                    Arrow keys rotate. <span className="font-mono text-white/78">S</span> shuffles.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="relative h-full overflow-hidden rounded-[2rem] p-6 sm:p-7">
                                <div className="flex items-center justify-between pt-5">
                                  <div className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/55">
                                    {String(wrapIndex(activeIndex + offset, filteredThoughts.length) + 1).padStart(2, "0")}
                                  </div>
                                </div>
                                <div className="mt-8 max-w-2xl">
                                  <p className="line-clamp-3 text-lg font-medium leading-8 text-white/40">
                                    {thought.quote}
                                  </p>
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {thought.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/34"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(10,13,21,0.92)_72%,rgba(10,13,21,0.98))]" />
                              </div>
                            )}
                          </motion.article>
                        );
                      })
                    ) : (
                      <div className="relative z-20 rounded-[1.95rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(18,23,34,0.98),rgba(9,13,21,0.98))] px-6 py-16 text-center">
                        <p className="text-xl font-semibold tracking-[-0.04em] text-white">
                          No thoughts found. Terrifying.
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                          Nothing matched. The Rolodex is judging the query.
                        </p>
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.07]"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-20 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,34,0.92),rgba(9,13,21,0.96))] px-4 py-3 shadow-[0_24px_54px_rgba(0,0,0,0.28)] backdrop-blur-md">
                  <p className="text-sm text-[color:var(--text-muted)]">
                    The deck stays physical on purpose: rotate through it, jump by tab, or let shuffle flip through a few before it settles.
                  </p>
                  <button
                    type="button"
                    onClick={handleShuffle}
                    disabled={isShuffling || filteredThoughts.length === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-strong)] transition duration-[var(--motion-base)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Shuffle className="h-4 w-4" />
                    {isShuffling ? "Shuffling..." : "Shuffle Thought"}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[1.85rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,12,19,0.92))] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Matching Thoughts</p>
                  <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                    Click any card to bring it to the top of the stack.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/16 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-white/62">
                  {activeCountLabel}
                </div>
              </div>

              <div
                className={cn(
                  "mt-5 grid gap-3 md:grid-cols-2",
                  variant === "page" ? "2xl:grid-cols-3" : "",
                )}
              >
                {filteredThoughts.map((thought) => (
                  <button
                    key={thought.id}
                    type="button"
                    onClick={() => {
                      applyTransitionMode(1);
                      setActiveThoughtId(thought.id);
                    }}
                    className={cn(
                      "rounded-[1.35rem] border px-4 py-4 text-left transition duration-[var(--motion-base)]",
                      activeThought?.id === thought.id
                        ? "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-white"
                        : "border-white/8 bg-black/14 text-white/86 hover:border-white/14 hover:bg-white/[0.04]",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/16 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/62">
                        {thought.category}
                      </span>
                      {thought.featured ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-white/62">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 line-clamp-3 text-base leading-7">
                      {thought.quote}
                    </p>
                  </button>
                ))}
              </div>
            </section>
        </div>
      </div>
    </section>
  );
}

function ControlButton({
  onClick,
  label,
  icon: Icon,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  icon: ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-4 w-4 text-[color:var(--accent)]" />
      {label}
    </button>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 bg-black/16 px-4 py-3">
      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{value}</p>
    </div>
  );
}
