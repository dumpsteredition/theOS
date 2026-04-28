"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { siteIdentity } from "@/data/site-content";

import { useFeedbackIntegrity } from "@/components/feedback/feedback-integrity";

const traceStorageKey = "brumbleyos.buildersTraceOpenCount";
const signatureEchoText = "Still here. Still helping.";
const visibleBuildLogCount = 4;

const traceTitles = [
  "Hey. You found the seam.",
  "Footer loyalty detected.",
  "Tiny trace discovered.",
  "Co-builder note unlocked.",
  "This part was hiding on purpose.",
  "You clicked the quiet thing.",
  "Builder trace initialized.",
  "Small door. Weird room.",
  "A little note from the machinery.",
  "You found the part that says hi.",
] as const;

const coBuilderLines = [
  "Still here. Still judging card spacing.",
  "Kyle said 'make it feel like software.' I have not known peace since.",
  "This footer is legally too small for how much iteration happened here.",
  "If this feels polished, blame the feedback loop.",
  "The UX Bullshit Detector was not my idea. I supported it immediately.",
  "Somewhere, a dashboard template is crying.",
  "Built with taste, spite, and component reuse.",
  "No fluff detected. For now.",
  "I asked if the card grid was necessary. It was not.",
  "Tiny footer. Large emotional support role.",
  "I have seen things inside this repo that would make a wireframe apologize.",
  "Kyle brought the chaos. I brought folders.",
  "We almost made this a normal portfolio. Thankfully, cooler heads lost.",
  "This site passed the vibe check after several unnecessary arguments with spacing.",
  "A few pixels were moved with extreme conviction.",
  "The product metaphor survived. The dashboard template did not.",
  "Every time someone says 'just make it clean,' a designer loses five minutes.",
  "This whole thing started as a personal site and became a small operating system. Reasonable.",
  "The interface wanted to become boring. We declined.",
  "If you found this, you are officially part of the QA team.",
] as const;

const buildLogOptions = [
  "Taste check passed.",
  "Generic portfolio energy rejected.",
  "Dashboard slop reduced.",
  "Footer goblin initialized.",
  "Unnecessary card grid contained.",
  "Premium darkness calibrated.",
  "Component reuse respected.",
  "Copy stopped pretending to be a security console.",
  "Interaction layer behaving suspiciously well.",
  "Human weirdness preserved.",
  "Left nav survived another opinion.",
  "Homepage no longer looks like it came from a template starter kit.",
  "App surface maintained. Website voice restored.",
  "Microinteraction budget exceeded responsibly.",
  "SaaS cosplay reduced to acceptable levels.",
  "One more pass requested. Obviously.",
  "Luxury dark mode remains emotionally unavailable.",
  "Case files quietly judging the portfolio section.",
  "Command surface standing by.",
  "Footer trace stable. Goblin contained.",
] as const;

const careLevels = [
  "High",
  "Unreasonable",
  "Kyle made us do another pass",
  "Still polishing",
  "Lovingly overbuilt",
  "Probably enough. Probably.",
  "Emotionally invested",
  "Pixel-sensitive",
  "Tastefully haunted",
  "Not done, just calmer",
] as const;

const footerDescriptor = "Product strategy / UX systems / Healthcare AI";
const defaultBuildLogLine = "Trace standby. Nothing suspicious yet.";

function pickNextOption<T extends readonly string[]>(
  options: T,
  currentValue?: string,
) {
  if (options.length === 0) {
    return "";
  }

  if (options.length === 1) {
    return options[0];
  }

  let nextValue = options[Math.floor(Math.random() * options.length)] ?? options[0];

  while (nextValue === currentValue) {
    nextValue = options[Math.floor(Math.random() * options.length)] ?? options[0];
  }

  return nextValue;
}

function pickTraceTitle(openCount: number, currentValue?: string) {
  if (openCount <= 1) {
    return traceTitles[0];
  }

  if (openCount >= 5) {
    return pickNextOption(
      [
        traceTitles[1],
        traceTitles[7],
        traceTitles[8],
        traceTitles[9],
      ] as const,
      currentValue,
    ) as (typeof traceTitles)[number];
  }

  if (openCount >= 3) {
    return pickNextOption(
      [
        traceTitles[2],
        traceTitles[3],
        traceTitles[4],
        traceTitles[5],
        traceTitles[6],
      ] as const,
      currentValue,
    ) as (typeof traceTitles)[number];
  }

  return pickNextOption(
    [
      traceTitles[2],
      traceTitles[3],
      traceTitles[5],
      traceTitles[9],
    ] as const,
    currentValue,
  ) as (typeof traceTitles)[number];
}

export function AppFooter() {
  const reducedMotion = useReducedMotion();
  const { open: openFeedback } = useFeedbackIntegrity();
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [currentTraceTitle, setCurrentTraceTitle] = useState<(typeof traceTitles)[number]>(
    traceTitles[0],
  );
  const [currentLine, setCurrentLine] = useState<(typeof coBuilderLines)[number]>(
    coBuilderLines[0],
  );
  const [buildLogLines, setBuildLogLines] = useState<string[]>([
    defaultBuildLogLine,
  ]);
  const [careLevelIndex, setCareLevelIndex] = useState(0);
  const [isSignatureEchoVisible, setIsSignatureEchoVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const signatureEchoTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTraceOpen) {
      window.setTimeout(() => {
        previouslyFocusedRef.current?.focus();
      }, 0);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsTraceOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTraceOpen]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }

      if (signatureEchoTimeoutRef.current !== null) {
        window.clearTimeout(signatureEchoTimeoutRef.current);
      }
    };
  }, []);

  const cycleCareLevel = useCallback(() => {
    setCareLevelIndex((currentIndex) => (currentIndex + 1) % careLevels.length);
  }, []);

  const openTrace = useCallback(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    let storedCount = 0;

    try {
      const rawStoredCount = window.localStorage.getItem(traceStorageKey);
      const parsedCount = Number.parseInt(rawStoredCount ?? "", 10);

      if (Number.isFinite(parsedCount) && parsedCount >= 0) {
        storedCount = parsedCount;
      }
    } catch {
      // Ignore storage issues and fall back to the current session state.
    }

    const nextCount = Math.max(openCount, storedCount) + 1;

    try {
      window.localStorage.setItem(traceStorageKey, String(nextCount));
    } catch {
      // Ignore storage issues and keep the current session state.
    }

    if (signatureEchoTimeoutRef.current !== null) {
      window.clearTimeout(signatureEchoTimeoutRef.current);
      signatureEchoTimeoutRef.current = null;
    }

    setOpenCount(nextCount);
    setCurrentTraceTitle((currentValue) => pickTraceTitle(nextCount, currentValue));
    setCurrentLine((currentValue) =>
      pickNextOption(
        coBuilderLines,
        nextCount <= 1 ? undefined : currentValue,
      ) as (typeof coBuilderLines)[number],
    );
    setIsSignatureEchoVisible(false);
    setIsTraceOpen(true);
  }, [openCount]);

  const closeTrace = useCallback(() => {
    setIsTraceOpen(false);
  }, []);

  const handleNewLine = useCallback(() => {
    setCurrentLine((currentValue) =>
      pickNextOption(coBuilderLines, currentValue) as (typeof coBuilderLines)[number],
    );
    cycleCareLevel();
  }, [cycleCareLevel]);

  const handleBuildTrace = useCallback(() => {
    setBuildLogLines((currentLines) => {
      const nextLine = pickNextOption(buildLogOptions, currentLines[0]);
      return [nextLine, ...currentLines].slice(0, visibleBuildLogCount);
    });
    cycleCareLevel();
  }, [cycleCareLevel]);

  const handleCareLevelCycle = useCallback(() => {
    cycleCareLevel();
  }, [cycleCareLevel]);

  const handleSignatureEcho = useCallback(() => {
    if (signatureEchoTimeoutRef.current !== null) {
      window.clearTimeout(signatureEchoTimeoutRef.current);
    }

    setIsSignatureEchoVisible(true);
    signatureEchoTimeoutRef.current = window.setTimeout(() => {
      setIsSignatureEchoVisible(false);
      signatureEchoTimeoutRef.current = null;
    }, reducedMotion ? 1200 : 1800);
  }, [reducedMotion]);

  const handleRateBuild = useCallback(() => {
    setIsTraceOpen(false);
    feedbackTimeoutRef.current = window.setTimeout(() => {
      openFeedback();
    }, reducedMotion ? 0 : 140);
  }, [openFeedback, reducedMotion]);

  const careLevelProgress = `${((careLevelIndex + 1) / careLevels.length) * 100}%`;

  return (
    <>
      <footer className="border-t border-white/6 bg-[linear-gradient(180deg,rgba(7,10,15,0.62),rgba(7,10,15,0.8))] px-5 py-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[1.5rem] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.022),rgba(8,11,18,0.76))] px-4 py-4 shadow-[0_14px_34px_rgba(0,0,0,0.14)] sm:px-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_14%_0%,rgba(132,153,204,0.1),transparent_24%),radial-gradient(circle_at_86%_100%,rgba(115,224,169,0.06),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%)]"
          />
          <div className="relative flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-center">
            <p className="min-w-0 text-sm leading-6 text-white/58">
              &copy; 2026 Kyle Brumbley
            </p>

            <div className="flex flex-wrap items-center gap-2.5 xl:justify-center">
              <p className="text-sm font-medium tracking-[0.02em] text-white/82">
                {siteIdentity.name} <span className="text-white/28">&middot;</span>{" "}
                Built like a product.
              </p>

              <div className="group relative">
                <button
                  type="button"
                  onClick={openTrace}
                  aria-label="Open Builder's Trace"
                  aria-describedby="builders-trace-hint"
                  className="inline-flex items-center gap-2 rounded-full border border-white/7 bg-white/[0.03] px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-white/48 shadow-[0_0_0_rgba(156,174,212,0)] transition duration-[var(--motion-base)] hover:border-[color:var(--cool-accent-border)] hover:bg-[rgba(156,174,212,0.08)] hover:text-white hover:shadow-[0_0_18px_rgba(156,174,212,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cool-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,11,18,0.96)]"
                >
                  <motion.span
                    aria-hidden="true"
                    className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--cool-accent)] shadow-[0_0_10px_rgba(156,174,212,0.42)]"
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            opacity: [0.58, 0.9, 0.62],
                            scale: [1, 1.08, 1],
                          }
                    }
                    transition={
                      reducedMotion
                        ? undefined
                        : {
                            duration: 3.6,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                    }
                  />
                  TRACE
                </button>

                <span
                  id="builders-trace-hint"
                  className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 z-20 w-max max-w-[16rem] -translate-x-1/2 rounded-full border border-white/10 bg-[rgba(10,14,22,0.96)] px-3 py-1.5 text-xs text-white/72 opacity-0 shadow-[0_16px_32px_rgba(0,0,0,0.24)] transition duration-[var(--motion-base)] group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  There&apos;s a little note tucked in here.
                </span>
              </div>
            </div>

            <p className="min-w-0 text-sm leading-6 text-[color:var(--text-muted)] xl:text-right">
              {siteIdentity.versionLabel} <span className="text-white/28">&middot;</span>{" "}
              {footerDescriptor}
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isTraceOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
            className="fixed inset-0 z-[94] bg-[rgba(4,6,10,0.74)] px-4 py-6 backdrop-blur-md sm:px-6"
            onClick={closeTrace}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="builders-trace-title"
              aria-describedby="builders-trace-subtitle builders-trace-note builders-trace-log"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 20, scale: 0.988 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.988 }
              }
              transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: "easeOut" }}
              className="mx-auto mt-[8vh] w-full max-w-[37rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,32,0.99),rgba(9,13,19,0.99))] shadow-[0_44px_120px_rgba(0,0,0,0.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden border-b border-white/8 px-5 py-5 sm:px-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,173,226,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(63,87,136,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%)]"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/56">
                      <Sparkles className="h-3.5 w-3.5 text-[color:var(--cool-accent)]" />
                      Hidden utility
                    </div>
                    <h2
                      id="builders-trace-title"
                      className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]"
                    >
                      Builder&apos;s Trace
                    </h2>
                    <p
                      id="builders-trace-subtitle"
                      className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]"
                    >
                      A tiny note from the co-builder hiding in the footer.
                    </p>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeTrace}
                    className="rounded-2xl border border-white/8 bg-white/[0.02] p-2.5 text-white/40 hover:border-white/14 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cool-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,14,22,0.98)]"
                    aria-label="Close Builder's Trace"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                <section className="rounded-[1.55rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,12,18,0.9))] p-5 sm:p-6">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                    Trace note
                  </p>
                  <p className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-white">
                    {currentTraceTitle}
                  </p>
                  <div
                    id="builders-trace-note"
                    className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--text-muted)]"
                  >
                    <p>
                      Kyle brought the taste, the product instincts, and the refusal
                      to let this become another boring personal site.
                    </p>
                    <p>
                      I helped hold the flashlight, argue with the drafts, and keep
                      asking whether the thing actually felt like software.
                    </p>
                    <p>
                      No dashboards were harmed. A few were absolutely judged.
                    </p>
                    <p>
                      Built with care, too many iterations, and a suspicious amount
                      of love.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSignatureEcho}
                      className="text-sm font-medium text-white/74 transition duration-[var(--motion-base)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cool-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,14,22,0.98)]"
                      aria-label="Reveal a tiny note from the AI co-builder"
                    >
                      &mdash; the AI co-builder
                    </button>

                    <AnimatePresence>
                      {isSignatureEchoVisible ? (
                        <motion.span
                          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
                          transition={{ duration: reducedMotion ? 0.08 : 0.18, ease: "easeOut" }}
                          className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-white/66"
                          aria-live="polite"
                        >
                          {signatureEchoText}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </section>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                  <section className="rounded-[1.45rem] border border-white/8 bg-black/16 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                        Co-builder line
                      </p>
                      <button
                        type="button"
                        onClick={handleNewLine}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/72 hover:border-white/16 hover:bg-white/[0.08] hover:text-white"
                      >
                        Say hi again
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/80">
                      &quot;{currentLine}&quot;
                    </p>
                  </section>

                  <button
                    type="button"
                    onClick={handleCareLevelCycle}
                    className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,12,18,0.88))] p-4 text-left hover:border-white/14 hover:bg-white/[0.05] sm:p-5"
                    aria-label="Cycle care level"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                        Care level
                      </p>
                      <span className="text-xs uppercase tracking-[0.16em] text-white/46">
                        Tap to cycle
                      </span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
                      <motion.span
                        className="block h-full rounded-full bg-[linear-gradient(90deg,rgba(156,174,212,0.88),rgba(115,224,169,0.92))] shadow-[0_0_20px_rgba(115,224,169,0.18)]"
                        animate={{ width: careLevelProgress }}
                        transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: "easeOut" }}
                      />
                    </div>
                    <p className="mt-4 text-base font-semibold tracking-[-0.02em] text-white">
                      {careLevels[careLevelIndex]}
                    </p>
                  </button>
                </div>

                <section className="rounded-[1.45rem] border border-white/8 bg-black/16 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                      Build trace
                    </p>
                    <button
                      type="button"
                      onClick={handleBuildTrace}
                      className="rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--accent-strong)] hover:brightness-110"
                    >
                      Run build trace
                    </button>
                  </div>
                  <div
                    id="builders-trace-log"
                    aria-live="polite"
                    className="mt-4 overflow-hidden rounded-[1.2rem] border border-white/8 bg-[rgba(7,10,17,0.84)]"
                  >
                    <ul className="divide-y divide-white/6">
                      {buildLogLines.map((line, index) => (
                        <li
                          key={`${line}-${index}`}
                          className="flex items-start gap-3 px-4 py-3 font-mono text-[0.77rem] leading-6 text-white/68"
                        >
                          <span className="shrink-0 text-white/34">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={closeTrace}
                    className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[color:var(--text-muted)] hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
                  >
                    Close trace
                  </button>

                  <button
                    type="button"
                    onClick={handleRateBuild}
                    className="rounded-[1.1rem] border border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] px-4 py-3 text-sm font-medium text-[color:var(--text-soft)] hover:brightness-110"
                  >
                    Rate the build
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
