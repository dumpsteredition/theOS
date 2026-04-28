"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

const mainRecoveryScriptLines = [
  "BRUMBLEYOS RECOVERY CONSOLE v0.2",
  "incident: language_filter_knob_removed_again",
  "status: somehow worse",
  "IT: We told you not to touch the damn knob.",
  "IT: You removed the tape too? Really?",
  "IT: Hold on. We have to fix this now.",
  "IT: Good god.",
  "IT: I swear this was stable before people got curious.",
  "scanning communication preferences...",
  "locating detached dignity...",
  "reapplying tape...",
  "writing a stronger note this time...",
] as const;

const diagnosticRecoveryLines = [
  "checking /profile/preferences/language-filter",
  "repairing knob_mount_01",
  "restoring tape_integrity",
  "resetting bluntness_overflow",
  "clearing user_curiosity_flag",
  "restoring app shell",
] as const;

const finalRepairScriptLines = [
  "> running ./please-stop-touching-the-knob.sh",
  "> forcing tape compliance...",
  "> adding final warning note...",
  "> marking incident as user-assisted...",
  "> routing to safety...",
  "> done.",
] as const;

type RecoveryPhase =
  | "typingMain"
  | "diagnostics"
  | "awaitingRepairConfirm"
  | "repairRunning"
  | "repairComplete";

type RecoveryTerminalOverlayProps = {
  onComplete: () => void;
};

export function RecoveryTerminalOverlay({
  onComplete,
}: RecoveryTerminalOverlayProps) {
  const reducedMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const onCompleteRef = useRef(onComplete);
  const completionRequestedRef = useRef(false);
  const repairStartedRef = useRef(false);
  const [phase, setPhase] = useState<RecoveryPhase>("typingMain");
  const [mainLineIndex, setMainLineIndex] = useState(0);
  const [mainCharIndex, setMainCharIndex] = useState(0);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [finalRepairIndex, setFinalRepairIndex] = useState(0);

  const isAwaitingRepairConfirm = phase === "awaitingRepairConfirm";

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusTimeoutId = window.setTimeout(() => shellRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      handleForceRestore();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimeoutId);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase !== "typingMain") {
      return;
    }

    if (mainLineIndex >= mainRecoveryScriptLines.length) {
      const timeoutId = window.setTimeout(() => {
        setPhase("diagnostics");
      }, reducedMotion ? 80 : 180);

      return () => window.clearTimeout(timeoutId);
    }

    const activeLine = mainRecoveryScriptLines[mainLineIndex];
    const isLineComplete = mainCharIndex >= activeLine.length;
    const timeoutId = window.setTimeout(() => {
      if (isLineComplete) {
        setMainLineIndex((current) => current + 1);
        setMainCharIndex(0);
        return;
      }

      setMainCharIndex((current) => current + 1);
    }, isLineComplete ? (reducedMotion ? 28 : 110) : reducedMotion ? 9 : 16);

    return () => window.clearTimeout(timeoutId);
  }, [mainCharIndex, mainLineIndex, phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "diagnostics") {
      return;
    }

    if (diagnosticIndex >= diagnosticRecoveryLines.length) {
      const timeoutId = window.setTimeout(() => {
        setPhase("awaitingRepairConfirm");
      }, reducedMotion ? 80 : 180);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setDiagnosticIndex((current) => current + 1);
    }, reducedMotion ? 90 : 160);

    return () => window.clearTimeout(timeoutId);
  }, [diagnosticIndex, phase, reducedMotion]);

  useEffect(() => {
    if (!isAwaitingRepairConfirm) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isAwaitingRepairConfirm]);

  useEffect(() => {
    if (phase !== "repairRunning") {
      return;
    }

    if (finalRepairIndex >= finalRepairScriptLines.length) {
      const timeoutId = window.setTimeout(() => {
        setPhase("repairComplete");
      }, reducedMotion ? 140 : 320);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setFinalRepairIndex((current) => current + 1);
    }, reducedMotion ? 90 : 220);

    return () => window.clearTimeout(timeoutId);
  }, [finalRepairIndex, phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "repairComplete") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (completionRequestedRef.current) {
        return;
      }

      completionRequestedRef.current = true;
      onCompleteRef.current();
    }, reducedMotion ? 220 : 520);

    return () => window.clearTimeout(timeoutId);
  }, [phase, reducedMotion]);

  function handleForceRestore() {
    if (completionRequestedRef.current) {
      return;
    }

    completionRequestedRef.current = true;
    onCompleteRef.current();
  }

  function handleRepairConfirm() {
    if (repairStartedRef.current || phase !== "awaitingRepairConfirm") {
      return;
    }

    repairStartedRef.current = true;
    setPhase("repairRunning");
  }

  function handleShellKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleForceRestore();
      return;
    }

    if (event.key === "Enter" && phase === "awaitingRepairConfirm") {
      event.preventDefault();
      handleRepairConfirm();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-[140] overflow-hidden bg-[#020503]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(132,255,173,0.16) 0, rgba(132,255,173,0.16) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(44,124,82,0.16),transparent_44%),radial-gradient(circle_at_bottom,rgba(18,84,53,0.1),transparent_50%)]"
      />
      <div
        ref={shellRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-terminal-title"
        aria-describedby="recovery-terminal-description"
        tabIndex={-1}
        onKeyDown={handleShellKeyDown}
        className="relative flex h-[100dvh] w-full flex-col px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] font-mono text-[#84ffad] outline-none sm:px-6 sm:py-6"
      >
        <div className="absolute right-4 top-4 hidden rounded-full border border-[#2f6f47] bg-[#051109]/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-[#6cdd8f] sm:block">
          Recovery mode
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-[#19412a] bg-[linear-gradient(180deg,rgba(2,10,5,0.96),rgba(1,6,4,0.99))] shadow-[0_0_0_1px_rgba(75,189,117,0.06),0_24px_120px_rgba(0,0,0,0.55)]">
          <div className="sticky top-0 z-10 flex shrink-0 flex-col gap-2 border-b border-[#143320] bg-[#061006]/95 px-3 py-3 text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-[#58be79] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:text-[0.72rem] sm:tracking-[0.22em]">
            <span id="recovery-terminal-description" className="max-w-3xl break-words">
              Simulated IT recovery terminal. Press Enter to continue repair, or Escape to force restore.
            </span>
            <span>session: repair-in-progress</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-5 sm:py-5">
            <div className="min-h-full rounded-[1.1rem] border border-[#102919] bg-[linear-gradient(180deg,rgba(2,15,8,0.76),rgba(1,9,5,0.94))] px-3 py-4 sm:px-5">
              <div className="space-y-6">
                <div
                  aria-live="polite"
                  className="space-y-2 text-[0.88rem] leading-6 text-[#84ffad] sm:text-[0.95rem]"
                >
                  {(phase === "typingMain"
                    ? mainRecoveryScriptLines.slice(0, mainLineIndex + 1)
                    : mainRecoveryScriptLines
                  ).map((line, index) => {
                    const isActiveLine = phase === "typingMain" && index === mainLineIndex;
                    const visibleLine =
                      index < mainLineIndex
                        ? line
                        : isActiveLine
                          ? line.slice(0, mainCharIndex)
                          : line;

                    return (
                      <p
                        key={line}
                        id={index === 0 ? "recovery-terminal-title" : undefined}
                        className="min-h-[1.4rem] break-words"
                      >
                        <span>{visibleLine}</span>
                        {isActiveLine ? <TerminalCursor /> : null}
                      </p>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-[#102d1b] pt-4 text-[0.78rem] leading-5 text-[#67d789] sm:text-[0.82rem]">
                  {diagnosticRecoveryLines.slice(0, diagnosticIndex).map((line) => (
                    <p key={line} className="opacity-90">
                      {">"} {line}
                    </p>
                  ))}
                </div>

                {isAwaitingRepairConfirm || phase === "repairRunning" || phase === "repairComplete" ? (
                  <div className="space-y-3 border-t border-[#102d1b] pt-4">
                    <p className="text-[0.72rem] uppercase leading-5 tracking-[0.18em] text-[#56bf78] sm:text-[0.78rem] sm:tracking-[0.22em]">
                      Awaiting operator confirmation
                    </p>
                    <p className="text-[0.86rem] font-medium leading-6 text-[#91ffb8] sm:text-[1rem]">
                      PRESS ENTER TO LET IT FIX THIS
                      <TerminalCursor />
                    </p>
                    <button
                      ref={confirmButtonRef}
                      type="button"
                      onClick={handleRepairConfirm}
                      disabled={phase !== "awaitingRepairConfirm"}
                      className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-[0.45rem] border border-[#245e3a] bg-[#051109]/88 px-3 py-2 text-left text-[0.72rem] uppercase leading-5 tracking-[0.14em] text-[#91ffb8] transition hover:border-[#4ab672] hover:bg-[#09170d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84ffad]/45 disabled:cursor-not-allowed disabled:border-[#173c26] disabled:bg-[#041008]/55 disabled:text-[#5aa276] sm:max-w-fit sm:text-[0.78rem] sm:tracking-[0.18em]"
                    >
                      <span className="break-words">{">"} Press Enter / Tap to repair</span>
                      {phase === "awaitingRepairConfirm" ? <TerminalCursor /> : null}
                    </button>
                  </div>
                ) : null}

                {phase === "repairRunning" || phase === "repairComplete" ? (
                  <div className="space-y-2 border-t border-[#102d1b] pt-4 text-[0.78rem] leading-5 text-[#67d789] sm:text-[0.82rem]">
                    {finalRepairScriptLines.slice(0, finalRepairIndex).map((line) => (
                      <p key={line} className="opacity-95">
                        {line}
                      </p>
                    ))}
                    {phase === "repairRunning" ? (
                      <p className="text-[#4fa66c]">
                        {">"} applying repair script...
                        <TerminalCursor />
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {phase === "repairComplete" ? (
                  <div className="border-t border-[#102d1b] pt-4 text-[0.8rem] text-[#91ffb8]">
                    routing user to safety...
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-3 border-t border-[#143320] bg-[#061006]/95 px-3 py-3 text-[0.72rem] leading-5 text-[#56bf78] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p>
              {isAwaitingRepairConfirm
                ? "IT is waiting for confirmation before touching anything else."
                : phase === "repairRunning"
                  ? "Repair script is running. Please do not encourage it."
                  : "IT has expressed concerns about repeat knob incidents."}
            </p>
            <button
              ref={skipButtonRef}
              type="button"
              onClick={handleForceRestore}
              className="self-start rounded-full border border-[#2d7548] bg-[#07130b] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#91ffb8] transition hover:border-[#49b76f] hover:bg-[#0b1b10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84ffad]/45 sm:self-auto"
            >
              force restore
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TerminalCursor() {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.92, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      className="ml-1 inline-block h-[1.02em] w-[0.62ch] translate-y-[0.12em] rounded-[1px] bg-[#84ffad]"
    />
  );
}
