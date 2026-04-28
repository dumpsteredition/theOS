"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type BrumbleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  variant?: "default" | "damaged" | "broken" | "repaired";
  id?: string;
  ariaDescribedBy?: string;
};

const variantClassNames: Record<NonNullable<BrumbleSwitchProps["variant"]>, string> = {
  default: "",
  damaged: "brumble-switch--damaged",
  broken: "brumble-switch--broken",
  repaired: "brumble-switch--repaired",
};

export function BrumbleSwitch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  style,
  variant = "default",
  id,
  ariaDescribedBy,
}: BrumbleSwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;

  const input = (
    <input
      id={inputId}
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      aria-describedby={describedBy}
      onChange={(event) => onCheckedChange(event.target.checked)}
      className={cn("brumble-switch", variantClassNames[variant], className)}
      style={style}
    />
  );

  if (!description) {
    return input;
  }

  return (
    <label htmlFor={inputId} className="brumble-switch-input">
      <span className="brumble-switch-input__copy">
        {label ? <span className="brumble-switch-input__label">{label}</span> : null}
        <span id={descriptionId} className="brumble-switch-input__description">
          {description}
        </span>
      </span>
      {input}
    </label>
  );
}

type BrokenBrumbleSwitchProps = {
  mode: "active" | "broken" | "repaired" | "tapeRemoved";
  damage: number;
  repairNudges: number;
  noteVariant?: "default" | "escalated";
  label: string;
  ariaDescribedBy?: string;
  onInteract: () => void;
  onTapeInteract?: () => void;
  className?: string;
};

type BrokenFlickerState = {
  opacity: number;
  scaleX: number;
  x: number;
  duration: number;
  ringOpacity: number;
  ringAlpha: number;
  trackAlpha: number;
  trackBlur: string;
};

const MAX_VISUAL_DAMAGE = 5;
const crackSegments = [
  "left-[0.56rem] top-[0.42rem] w-[0.72rem] rotate-[28deg]",
  "left-[0.18rem] top-[0.92rem] w-[0.94rem] -rotate-[18deg]",
  "right-[0.2rem] top-[0.58rem] w-[0.64rem] rotate-[64deg]",
  "left-[0.46rem] top-[1.2rem] w-[1.04rem] rotate-[8deg]",
  "right-[0.14rem] top-[1.14rem] w-[0.72rem] -rotate-[34deg]",
] as const;

function createBrokenFlickerState(): BrokenFlickerState {
  return {
    opacity: Math.random() * 0.92 + 0.04,
    scaleX: 0.94 + Math.random() * 0.16,
    x: (Math.random() - 0.5) * 0.7,
    duration: 0.035 + Math.random() * 0.12,
    ringOpacity: 0.12 + Math.random() * 0.88,
    ringAlpha: 0.12 + Math.random() * 0.88,
    trackAlpha: 0.22 + Math.random() * 0.72,
    trackBlur: `${(0.12 + Math.random() * 0.52).toFixed(3)}em`,
  };
}

function getBrokenFlickerDelay() {
  const roll = Math.random();

  if (roll < 0.5) {
    return 28 + Math.random() * 58;
  }

  if (roll < 0.82) {
    return 90 + Math.random() * 120;
  }

  return 220 + Math.random() * 180;
}

function createRepairedFlickerState(): BrokenFlickerState {
  return {
    opacity: Math.random() * 0.96 + 0.04,
    scaleX: 0.92 + Math.random() * 0.2,
    x: (Math.random() - 0.5) * 0.9,
    duration: 0.028 + Math.random() * 0.1,
    ringOpacity: 0.08 + Math.random() * 0.92,
    ringAlpha: 0.12 + Math.random() * 0.88,
    trackAlpha: 0.16 + Math.random() * 0.84,
    trackBlur: `${(0.16 + Math.random() * 0.62).toFixed(3)}em`,
  };
}

function getRepairedFlickerDelay() {
  const roll = Math.random();

  if (roll < 0.42) {
    return 22 + Math.random() * 46;
  }

  if (roll < 0.78) {
    return 70 + Math.random() * 96;
  }

  return 150 + Math.random() * 180;
}

export function BrokenBrumbleSwitch({
  mode,
  damage,
  repairNudges,
  noteVariant = "default",
  label,
  ariaDescribedBy,
  onInteract,
  onTapeInteract,
  className,
}: BrokenBrumbleSwitchProps) {
  const reducedMotion = useReducedMotion();
  const isBroken = mode === "broken";
  const isTapeRemoved = mode === "tapeRemoved";
  const isRepaired = mode === "repaired" || isTapeRemoved;
  const isSecuredRepair = mode === "repaired";
  const [brokenFlicker, setBrokenFlicker] = useState<BrokenFlickerState>({
    opacity: 0.26,
    scaleX: 1,
    x: 0,
    duration: 0.08,
    ringOpacity: 0.34,
    ringAlpha: 0.34,
    trackAlpha: 0.34,
    trackBlur: "0.22em",
  });
  const [repairedFlicker, setRepairedFlicker] = useState<BrokenFlickerState>({
    opacity: 0.52,
    scaleX: 1,
    x: 0,
    duration: 0.08,
    ringOpacity: 0.78,
    ringAlpha: 0.82,
    trackAlpha: 0.68,
    trackBlur: "0.42em",
  });
  const visualDamage = isBroken
    ? MAX_VISUAL_DAMAGE
    : isTapeRemoved
      ? 4
      : isRepaired
        ? 3
        : Math.min(damage, MAX_VISUAL_DAMAGE);

  useEffect(() => {
    if (!isBroken || reducedMotion) {
      return;
    }

    let timeoutId = 0;
    let cancelled = false;

    const runFlicker = () => {
      if (cancelled) {
        return;
      }

      setBrokenFlicker(createBrokenFlickerState());
      timeoutId = window.setTimeout(runFlicker, getBrokenFlickerDelay());
    };

    runFlicker();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isBroken, reducedMotion]);

  useEffect(() => {
    if (!isRepaired || reducedMotion) {
      return;
    }

    let timeoutId = 0;
    let cancelled = false;

    const runFlicker = () => {
      if (cancelled) {
        return;
      }

      setRepairedFlicker(createRepairedFlickerState());
      timeoutId = window.setTimeout(runFlicker, getRepairedFlickerDelay());
    };

    runFlicker();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isRepaired, reducedMotion]);

  const switchBody = (
    <div className="relative inline-flex">
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-[0.32rem] left-[0.5rem] right-[0.28rem] rounded-full blur-[8px]",
          isRepaired
            ? "bg-[radial-gradient(circle_at_76%_50%,rgba(111,244,255,0.72),transparent_42%),radial-gradient(circle_at_24%_50%,rgba(111,244,255,0.24),transparent_34%)]"
            : "bg-[radial-gradient(circle_at_76%_50%,rgba(111,244,255,0.44),transparent_48%),radial-gradient(circle_at_24%_50%,rgba(111,244,255,0.14),transparent_36%)]",
        )}
        animate={
          reducedMotion
            ? { opacity: isBroken ? 0.26 : 0.48 }
            : isRepaired
              ? {
                  opacity: repairedFlicker.opacity,
                  scaleX: repairedFlicker.scaleX,
                  x: repairedFlicker.x,
                }
              : isBroken
                ? {
                    opacity: brokenFlicker.opacity,
                    scaleX: brokenFlicker.scaleX,
                    x: brokenFlicker.x,
                  }
                : {
                    opacity: [0.32, 0.62, 0.4, 0.74, 0.44, 0.68, 0.36],
                  }
        }
        transition={{
          duration:
            reducedMotion
              ? 0.08
              : isRepaired
                ? repairedFlicker.duration
                : isBroken
                  ? brokenFlicker.duration
                  : 1.95,
          repeat: reducedMotion || isBroken || isRepaired ? 0 : Number.POSITIVE_INFINITY,
          ease: isBroken || isRepaired ? "linear" : "easeInOut",
          times: isRepaired
            ? undefined
            : isBroken
              ? undefined
              : [0, 0.14, 0.28, 0.46, 0.68, 0.84, 1],
        }}
      />

      <BrumbleSwitch
        checked
        label={label}
        ariaDescribedBy={ariaDescribedBy}
        onCheckedChange={() => onInteract()}
        variant={isBroken ? "broken" : isRepaired ? "repaired" : damage > 0 ? "damaged" : "default"}
        className={cn(
          "brumble-switch-language-filter",
          isBroken ? "brumble-switch-language-filter--broken" : "",
          isRepaired ? "brumble-switch-language-filter--repaired" : "",
          isTapeRemoved ? "brumble-switch-language-filter--tape-removed" : "",
          !isBroken && visualDamage > 0 ? `brumble-switch--damage-${visualDamage}` : "",
        )}
        style={
          isBroken
            ? ({
                "--brumble-switch-broken-ring-opacity": brokenFlicker.ringOpacity,
                "--brumble-switch-broken-ring-alpha": brokenFlicker.ringAlpha,
              } as CSSProperties)
            : isRepaired
              ? ({
                  "--brumble-switch-repaired-ring-opacity": repairedFlicker.ringOpacity,
                  "--brumble-switch-repaired-ring-alpha": repairedFlicker.ringAlpha,
                  "--brumble-switch-repaired-track-alpha": repairedFlicker.trackAlpha,
                  "--brumble-switch-repaired-track-blur": repairedFlicker.trackBlur,
                } as CSSProperties)
            : undefined
        }
      />
      {isBroken ? (
        <span
          aria-hidden="true"
          className="brumble-switch-language-filter__broken-cover"
        />
      ) : null}
      {!isBroken ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[0.22rem] top-1/2 h-[1.8rem] w-[1.8rem] -translate-y-1/2"
        >
          {crackSegments.slice(0, visualDamage).map((segmentClassName, index) => (
            <span
              key={segmentClassName}
              className={cn(
                "absolute h-[1.5px] rounded-full bg-[rgba(11,16,24,0.8)] shadow-[0_0_0.5px_rgba(255,255,255,0.08)]",
                segmentClassName,
              )}
              style={{ opacity: 0.66 + index * 0.06 }}
            />
          ))}
          {visualDamage >= 3 ? (
            <span className="absolute right-[0.08rem] top-[0.38rem] h-[0.38rem] w-[0.32rem] rounded-full bg-[rgba(8,12,19,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
          ) : null}
          {visualDamage >= 5 ? (
            <span className="absolute right-[0.32rem] top-[1.16rem] h-[0.22rem] w-[0.22rem] rounded-full bg-[rgba(8,12,19,0.68)]" />
          ) : null}
        </div>
      ) : null}
      {isBroken ? (
        <motion.span
          aria-hidden="true"
          initial={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0.92, x: 0, y: 0, rotate: 0, scale: 1 }
          }
          animate={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, x: 11, y: 13, rotate: 18, scale: 0.84 }
          }
          transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute right-[0.22rem] top-1/2 h-[1.8rem] w-[1.8rem] -translate-y-1/2 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(203,213,231,0.94),rgba(144,156,180,0.72))] shadow-[0_12px_28px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.42)]"
        />
      ) : null}
      {isBroken ? (
        <span aria-hidden="true" className="brumble-switch-language-filter__shaft" />
      ) : null}
      <AnimatePresence initial={false}>
        {isSecuredRepair && onTapeInteract ? (
          <motion.button
            key="language-filter-tape"
            type="button"
            aria-label="Remove the tape from the language filter knob"
            onClick={onTapeInteract}
            className="brumble-switch-language-filter__tape brumble-switch-language-filter__tape--bridge brumble-switch-language-filter__tape-button"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0.96, x: 0, y: 0, rotate: 7, scale: 1 }}
            animate={{ opacity: 0.94, x: 0, y: 0, rotate: 7, scale: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: 14, y: -10, rotate: 21, scale: 0.86 }
            }
            whileHover={reducedMotion ? undefined : { rotate: 5.5, y: -1, scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { rotate: 9, y: 1, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: "easeOut" }}
          >
            <span className="sr-only">Remove tape from language filter knob</span>
          </motion.button>
        ) : null}
      </AnimatePresence>
      {isTapeRemoved ? (
        <>
          <span
            aria-hidden="true"
            className="brumble-switch-language-filter__tape-residue brumble-switch-language-filter__tape-residue--upper"
          />
          <span
            aria-hidden="true"
            className="brumble-switch-language-filter__tape-residue brumble-switch-language-filter__tape-residue--lower"
          />
        </>
      ) : null}
    </div>
  );

  if (isRepaired) {
    return (
      <div
        className={cn(
          "flex items-center justify-end gap-3 sm:gap-4",
          className,
        )}
      >
        <motion.div
          key={`repair-note-${repairNudges}`}
          animate={
            (repairNudges > 0 || isTapeRemoved) && !reducedMotion
              ? { rotate: [-1.9, -3.2, -0.9, -2.1, -1.9], y: [0, -1, 0.8, 0] }
              : { rotate: isTapeRemoved ? -3 : -1.9, y: 0 }
          }
          transition={{ duration: reducedMotion ? 0.08 : 0.28, ease: "easeOut" }}
          className="brumble-switch-language-filter__note"
        >
          <span
            aria-hidden="true"
            className="brumble-switch-language-filter__note-tape brumble-switch-language-filter__note-tape--left"
          />
          <span
            aria-hidden="true"
            className="brumble-switch-language-filter__note-tape brumble-switch-language-filter__note-tape--right"
          />
          {noteVariant === "escalated" ? (
            <>
              <p className="brumble-switch-language-filter__note-title brumble-switch-language-filter__note-title--escalated">
                <span className="block">DO NOT TOUCH THE</span>
                <span className="block">KNOB AGAIN.</span>
              </p>
              <p className="brumble-switch-language-filter__note-title brumble-switch-language-filter__note-title--escalated brumble-switch-language-filter__note-title--followup">
                WE MEAN IT THIS TIME.
              </p>
            </>
          ) : (
            <p className="brumble-switch-language-filter__note-title">
              Do not touch the knob
            </p>
          )}
          <p className="brumble-switch-language-filter__note-signoff">- IT Team</p>
        </motion.div>

        <motion.div
          key={`repair-switch-${repairNudges}`}
          animate={
            (repairNudges > 0 || isTapeRemoved) && !reducedMotion
              ? { rotate: [0, 1.3, -1.7, 0.9, 0], y: [0, -1, 0.6, 0] }
              : { rotate: isTapeRemoved ? -0.6 : 0, y: 0 }
          }
          transition={{ duration: reducedMotion ? 0.08 : 0.28, ease: "easeOut" }}
        >
          {switchBody}
        </motion.div>
      </div>
    );
  }

  return <div className={cn("flex flex-col items-end gap-2", className)}>{switchBody}</div>;
}
