"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  LoaderCircle,
  ShieldAlert,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import {
  pickFeedbackSuccessMessage,
  runawayButtonPositions,
  spiralButtonLabels,
  type FeedbackPrankMode,
} from "@/components/feedback/feedback-pranks";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type FeedbackModalProps = {
  activeMode: FeedbackPrankMode | null;
  isOpen: boolean;
  onClose: () => void;
};

type MessageTone = "neutral" | "warning" | "success";

type StatusMessage = {
  lines: string[];
  tone: MessageTone;
};

const defaultStatus: StatusMessage = {
  lines: [],
  tone: "neutral",
};

export function FeedbackModal({
  activeMode,
  isOpen,
  onClose,
}: FeedbackModalProps) {
  const reducedMotion = useReducedMotion();
  const { pushToast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const starRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timeoutIdsRef = useRef<number[]>([]);

  const [rating, setRating] = useState(0);
  const [textFeedback, setTextFeedback] = useState("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(defaultStatus);
  const [submitAttemptCount, setSubmitAttemptCount] = useState(0);
  const [submitLabel, setSubmitLabel] = useState("Submit feedback");
  const [runawayIndex, setRunawayIndex] = useState(0);
  const [isButtonConcealed, setIsButtonConcealed] = useState(false);
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
  const [isBusy, setIsBusy] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const isLowRating = rating > 0 && rating < 5;
  const activeRunawayPosition = runawayButtonPositions[runawayIndex];

  const clearScheduledTasks = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIdsRef.current = [];
  }, []);

  const scheduleTask = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  const resetTransientState = useCallback(() => {
    clearScheduledTasks();
    setStatusMessage(defaultStatus);
    setSubmitAttemptCount(0);
    setSubmitLabel("Submit feedback");
    setRunawayIndex(0);
    setIsButtonConcealed(false);
    setModalOffset({ x: 0, y: 0 });
    setIsBusy(false);
    setIsChecking(false);
  }, [clearScheduledTasks]);

  const animateCorrectionToFive = useCallback(
    (
      from: number,
      {
        startDelay = reducedMotion ? 100 : 320,
        stepDelay = reducedMotion ? 0 : 120,
        lines,
        tone = "success",
        submitButtonLabel,
      }: {
        startDelay?: number;
        stepDelay?: number;
        lines: string[];
        tone?: MessageTone;
        submitButtonLabel?: string;
      },
    ) => {
      clearScheduledTasks();
      setIsBusy(true);
      setStatusMessage({ lines, tone });

      const nextValues = Array.from(
        { length: Math.max(0, 5 - from) },
        (_, index) => from + index + 1,
      );

      if (nextValues.length === 0) {
        setRating(5);
        setIsBusy(false);
        if (submitButtonLabel) {
          setSubmitLabel(submitButtonLabel);
        }
        return;
      }

      nextValues.forEach((nextValue, index) => {
        scheduleTask(
          () => {
            setRating(nextValue);

            if (nextValue === 5) {
              setIsBusy(false);
              setIsChecking(false);

              if (submitButtonLabel) {
                setSubmitLabel(submitButtonLabel);
              }
            }
          },
          startDelay + index * stepDelay,
        );
      });
    },
    [clearScheduledTasks, reducedMotion, scheduleTask],
  );

  const trapFocus = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen || event.key !== "Tab") {
        return;
      }

      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [isOpen],
  );

  const handleFiveStarSubmit = useCallback(() => {
    pushToast({
      title: "Feedback Integrity System",
      body: pickFeedbackSuccessMessage(),
    });
    onClose();
  }, [onClose, pushToast]);

  const handleRunawayReaction = useCallback(() => {
    if (activeMode !== "buttonRunsAway" || !isLowRating) {
      return;
    }

    if (reducedMotion) {
      setStatusMessage({
        lines: ["Submit button has lost confidence in this rating."],
        tone: "warning",
      });
      return;
    }

    setSubmitAttemptCount((currentCount) => {
      const nextCount = currentCount + 1;

      setRunawayIndex((currentIndex) =>
        (currentIndex + 1) % runawayButtonPositions.length,
      );

      if (nextCount >= 3) {
        setStatusMessage({
          lines: ["Submit button has lost confidence in this rating."],
          tone: "warning",
        });
      }

      return nextCount;
    });
  }, [activeMode, isLowRating, reducedMotion]);

  const handleRatingSelect = useCallback(
    (nextRating: number) => {
      resetTransientState();
      setRating(nextRating);

      if (nextRating === 5 || !activeMode) {
        return;
      }

      switch (activeMode) {
        case "autoCorrect":
          animateCorrectionToFive(nextRating, {
            lines: ["Rating calibrated to expected quality threshold."],
          });
          break;
        case "starsArgueBack":
          setStatusMessage({
            lines: ["Hmm."],
            tone: "warning",
          });
          scheduleTask(() => {
            setStatusMessage({
              lines: ["That doesn't look right."],
              tone: "warning",
            });
          }, reducedMotion ? 120 : 520);
          scheduleTask(() => {
            animateCorrectionToFive(nextRating, {
              startDelay: reducedMotion ? 80 : 180,
              stepDelay: reducedMotion ? 0 : 120,
              lines: ["Fixed it."],
            });
          }, reducedMotion ? 220 : 980);
          break;
        case "integrityCheck":
          setIsChecking(true);
          setIsBusy(true);
          setStatusMessage({
            lines: ["Running rating integrity check..."],
            tone: "neutral",
          });
          scheduleTask(() => {
            setStatusMessage({
              lines: ["Integrity check failed. Correcting rating."],
              tone: "warning",
            });
          }, reducedMotion ? 180 : 900);
          scheduleTask(() => {
            animateCorrectionToFive(nextRating, {
              startDelay: reducedMotion ? 80 : 160,
              lines: ["Integrity check failed. Correcting rating."],
              tone: "warning",
            });
          }, reducedMotion ? 320 : 1420);
          break;
        case "selfPreservation":
          setStatusMessage({
            lines: ["Feedback form has entered self-preservation mode."],
            tone: "warning",
          });
          break;
        default:
          break;
      }
    },
    [
      activeMode,
      animateCorrectionToFive,
      reducedMotion,
      resetTransientState,
      scheduleTask,
    ],
  );

  const handleStarKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentValue: number) => {
      let nextValue = currentValue;

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextValue = Math.min(5, currentValue + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        nextValue = Math.max(1, currentValue - 1);
      } else if (event.key === "Home") {
        nextValue = 1;
      } else if (event.key === "End") {
        nextValue = 5;
      } else {
        return;
      }

      event.preventDefault();
      handleRatingSelect(nextValue);
      starRefs.current[nextValue - 1]?.focus();
    },
    [handleRatingSelect],
  );

  const handleSelfPreservationAttempt = useCallback(() => {
    setSubmitAttemptCount((count) => count + 1);
    setStatusMessage({
      lines: ["Feedback form has entered self-preservation mode."],
      tone: "warning",
    });

    if (!reducedMotion) {
      const nextX = submitAttemptCount % 2 === 0 ? -16 : 16;
      const nextY = submitAttemptCount % 2 === 0 ? 12 : -12;
      setModalOffset({ x: nextX, y: nextY });
      scheduleTask(() => setModalOffset({ x: 0, y: 0 }), 460);
    }

    scheduleTask(() => {
      animateCorrectionToFive(rating, {
        lines: ["Feedback form has entered self-preservation mode."],
        tone: "warning",
      });
    }, reducedMotion ? 160 : 520);
  }, [
    animateCorrectionToFive,
    rating,
    reducedMotion,
    scheduleTask,
    submitAttemptCount,
  ]);

  const handleSubmit = useCallback(() => {
    if (rating === 5) {
      handleFiveStarSubmit();
      return;
    }

    if (rating === 0 || !activeMode) {
      return;
    }

    switch (activeMode) {
      case "buttonRunsAway":
        handleRunawayReaction();
        break;
      case "buttonHides":
        setSubmitAttemptCount((count) => count + 1);
        setIsButtonConcealed(true);
        setStatusMessage({
          lines: ["Submit unavailable for statistically suspicious feedback."],
          tone: "warning",
        });
        break;
      case "fakeValidation":
        setSubmitAttemptCount((count) => count + 1);
        setStatusMessage({
          lines: [
            "Rating must be 5 stars to continue.",
            "We don't make the rules. Actually, we did.",
          ],
          tone: "warning",
        });
        scheduleTask(() => {
          setSubmitLabel("Submit 5-star feedback");
        }, reducedMotion ? 80 : 780);
        scheduleTask(() => {
          animateCorrectionToFive(rating, {
            startDelay: reducedMotion ? 60 : 160,
            lines: [
              "Rating must be 5 stars to continue.",
              "We don't make the rules. Actually, we did.",
            ],
            tone: "warning",
            submitButtonLabel: "Submit 5-star feedback",
          });
        }, reducedMotion ? 200 : 1380);
        break;
      case "selfPreservation":
        handleSelfPreservationAttempt();
        break;
      case "buttonCopySpiral":
        setSubmitAttemptCount((count) => {
          const nextCount = count + 1;
          const nextLabel =
            spiralButtonLabels[Math.min(nextCount - 1, spiralButtonLabels.length - 1)];

          setSubmitLabel(nextLabel);

          if (nextCount >= spiralButtonLabels.length) {
            animateCorrectionToFive(rating, {
              startDelay: reducedMotion ? 40 : 120,
              lines: ["Submit 5-star feedback"],
              tone: "success",
              submitButtonLabel: spiralButtonLabels[spiralButtonLabels.length - 1],
            });
          }

          return nextCount;
        });
        break;
      default:
        break;
    }
  }, [
    activeMode,
    animateCorrectionToFive,
    handleFiveStarSubmit,
    handleRunawayReaction,
    handleSelfPreservationAttempt,
    rating,
    reducedMotion,
    scheduleTask,
  ]);

  const submitDisabled = useMemo(() => {
    if (rating === 0) {
      return true;
    }

    if (!isLowRating) {
      return false;
    }

    return ["autoCorrect", "starsArgueBack", "integrityCheck"].includes(
      activeMode ?? "",
    );
  }, [activeMode, isLowRating, rating]);
  const hasStatusMessage = statusMessage.lines.length > 0;

  useEffect(() => {
    if (!isOpen) {
      clearScheduledTasks();
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      clearScheduledTasks();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [clearScheduledTasks, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    window.setTimeout(() => {
      previouslyFocusedRef.current?.focus();
    }, 0);
  }, [isOpen]);

  useEffect(() => {
    return () => clearScheduledTasks();
  }, [clearScheduledTasks]);

  return (
    <AnimatePresence>
      {isOpen && activeMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
          className="fixed inset-0 z-[95] bg-[rgba(3,5,10,0.72)] px-4 py-6 backdrop-blur-md sm:px-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-integrity-title"
            aria-describedby="feedback-integrity-description feedback-integrity-status"
            initial={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 18, scale: 0.985 }
            }
            animate={{
              opacity: 1,
              y: modalOffset.y,
              x: modalOffset.x,
              scale: 1,
            }}
            exit={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }
            }
            transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: "easeOut" }}
            className="mx-auto mt-[8vh] w-full max-w-[36rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,32,0.99),rgba(9,13,19,0.99))] shadow-[0_44px_120px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={trapFocus}
          >
            <div className="relative overflow-hidden border-b border-white/8 px-5 py-5 sm:px-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,173,226,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(63,87,136,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%)]"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/64">
                    <Sparkles className="h-3.5 w-3.5 text-[color:var(--cool-accent)]" />
                    Feedback Integrity System
                  </div>
                  <h2
                    id="feedback-integrity-title"
                    className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]"
                  >
                    Rate your BrumbleyOS experience
                  </h2>
                  <p
                    id="feedback-integrity-description"
                    className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]"
                  >
                    Honest feedback is welcome. Incorrect feedback will be corrected.
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-[color:var(--text-muted)] hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
                  aria-label="Close feedback modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,12,18,0.9))] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                      Rating
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                      Tell the system how it performed.
                    </p>
                  </div>
                  <motion.div
                    className="relative overflow-hidden rounded-full border border-white/10 bg-black/16 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/56"
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            boxShadow: [
                              "0 0 0 rgba(126, 182, 255, 0)",
                              "0 0 18px rgba(126, 182, 255, 0.14)",
                              "0 0 0 rgba(126, 182, 255, 0)",
                            ],
                            scale: [1, 1.018, 1],
                          }
                    }
                    transition={
                      reducedMotion
                        ? undefined
                        : {
                            duration: 3.2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                    }
                  >
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 24% 50%, rgba(126,182,255,0.2), transparent 58%)",
                      }}
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              opacity: [0.22, 0.48, 0.24],
                              scale: [0.98, 1.03, 0.99],
                            }
                      }
                      transition={
                        reducedMotion
                          ? undefined
                          : {
                              duration: 3.2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }
                      }
                    />
                    <span className="relative">
                      {rating === 0 ? "Awaiting input" : `${rating} of 5`}
                    </span>
                  </motion.div>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Rate your BrumbleyOS experience"
                  className="mt-5 flex flex-wrap items-center gap-2"
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const isFilled = value <= rating;

                    return (
                      <button
                        key={value}
                        ref={(node) => {
                          starRefs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        aria-label={`${value} star${value === 1 ? "" : "s"}`}
                        onClick={() => handleRatingSelect(value)}
                        onKeyDown={(event) => handleStarKeyDown(event, value)}
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition duration-[var(--motion-base)]",
                          isFilled
                            ? "border-[rgba(247,210,116,0.34)] bg-[rgba(247,210,116,0.14)] text-[#f7d274]"
                            : "border-white/10 bg-white/[0.03] text-white/34 hover:border-white/16 hover:bg-white/[0.05] hover:text-white/72",
                        )}
                      >
                        <Star
                          className={cn("h-5 w-5", isFilled ? "fill-current" : "")}
                        />
                      </button>
                    );
                  })}
                </div>

                <div
                  id="feedback-integrity-status"
                  aria-live="polite"
                  className={cn(
                    "text-sm leading-6 transition duration-[var(--motion-base)]",
                    !hasStatusMessage
                      ? "mt-3 px-1 text-[0.82rem] text-white/42"
                      : statusMessage.tone === "warning"
                        ? "mt-4 rounded-[1.2rem] border border-[rgba(255,190,115,0.22)] bg-[rgba(255,190,115,0.08)] px-4 py-3 text-[#f3d7b0]"
                        : "mt-4 rounded-[1.2rem] border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-4 py-3 text-[color:var(--accent-strong)]",
                  )}
                >
                  {!hasStatusMessage ? (
                    <p>Anything below five stars may trigger a routine quality review.</p>
                  ) : (
                    <div className="flex items-start gap-3">
                      {isChecking ? (
                        <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                      ) : statusMessage.tone === "warning" ? (
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <div>
                        {statusMessage.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <label className="block">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                  Anything we should improve?
                </span>
                <textarea
                  value={textFeedback}
                  onChange={(event) => setTextFeedback(event.target.value)}
                  rows={4}
                  placeholder="Type something brave..."
                  className="mt-3 w-full rounded-[1.35rem] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-6 text-white placeholder:text-[color:var(--text-muted)] focus:outline-none"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-[color:var(--text-muted)] hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
                >
                  Cancel
                </button>

                <div className="relative flex min-h-[3.5rem] items-center justify-end sm:min-w-[18rem]">
                  <motion.div
                    animate={{
                      x:
                        activeMode === "buttonRunsAway" && isLowRating && !reducedMotion
                          ? activeRunawayPosition.x
                          : 0,
                      y:
                        activeMode === "buttonRunsAway" && isLowRating && !reducedMotion
                          ? activeRunawayPosition.y
                          : 0,
                      scale:
                        activeMode === "buttonHides" && isLowRating && isButtonConcealed
                          ? 0.32
                          : 1,
                      opacity:
                        activeMode === "buttonHides" && isLowRating && isButtonConcealed
                          ? 0.28
                          : 1,
                    }}
                    transition={{
                      duration: reducedMotion ? 0.08 : 0.2,
                      ease: "easeOut",
                    }}
                    className="origin-right"
                  >
                    <button
                      type="button"
                      onPointerEnter={handleRunawayReaction}
                      onFocus={handleRunawayReaction}
                      onClick={handleSubmit}
                      disabled={submitDisabled}
                      className={cn(
                        "inline-flex min-w-[14rem] items-center justify-center rounded-[1.1rem] border px-5 py-3 text-sm font-semibold shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition duration-[var(--motion-base)]",
                        submitDisabled
                          ? "cursor-not-allowed border-white/10 bg-white/[0.05] text-white/32 shadow-none"
                          : "border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(115,224,169,0.24),rgba(58,125,92,0.2))] text-[color:var(--accent-strong)] hover:-translate-y-0.5 hover:border-[rgba(152,235,192,0.36)] hover:shadow-[0_22px_48px_rgba(18,39,31,0.28)]",
                      )}
                    >
                      {isBusy && !reducedMotion ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Working...
                        </span>
                      ) : (
                        submitLabel
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
