"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type SettingSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
  broken?: boolean;
  label: string;
  tooltip?: string;
  ariaDescribedBy?: string;
};

export function SettingSwitch({
  checked,
  disabled = false,
  onClick,
  broken = false,
  label,
  tooltip,
  ariaDescribedBy,
}: SettingSwitchProps) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      aria-disabled={disabled}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      onClick={onClick}
      title={tooltip}
      className={cn(
        "group relative inline-flex h-8 w-14 items-center rounded-full border px-1",
        checked
          ? "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
          : "border-white/12 bg-white/[0.06] text-white/70",
        disabled ? "cursor-default" : "cursor-pointer",
        broken ? "shadow-[0_0_24px_rgba(115,224,169,0.14)]" : "",
      )}
    >
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full",
          checked
            ? "bg-[radial-gradient(circle_at_center,rgba(115,224,169,0.18),transparent_70%)]"
            : "bg-transparent",
        )}
        animate={
          !checked || reducedMotion || !broken
            ? undefined
            : {
                opacity: [0.55, 0.95, 0.65, 0.88, 0.6],
              }
        }
        transition={{
          duration: 1.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.span
        aria-hidden="true"
        className={cn(
          "relative z-10 h-6 w-6 rounded-full shadow-[0_0_16px_rgba(115,224,169,0.32)]",
          checked ? "bg-[color:var(--accent)]" : "bg-white/70",
        )}
        animate={{
          x: checked ? 20 : 0,
          rotate: broken && checked ? 7 : 0,
          y: broken && checked ? 1.5 : 0,
        }}
        transition={{
          duration: reducedMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </button>
  );
}
