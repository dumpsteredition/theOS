"use client";

import { MessageSquareText, Star } from "lucide-react";

import { useFeedbackIntegrity } from "@/components/feedback/feedback-integrity";
import { cn } from "@/lib/utils";

type FeedbackTriggerProps = {
  className?: string;
  compact?: boolean;
  iconOnly?: boolean;
  label?: string;
  ariaLabel?: string;
};

export function FeedbackTrigger({
  className,
  compact = false,
  iconOnly = false,
  label = "Give Feedback",
  ariaLabel,
}: FeedbackTriggerProps) {
  const { open } = useFeedbackIntegrity();

  if (compact) {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={ariaLabel ?? label}
        title={iconOnly ? label : undefined}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-[color:var(--text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.06] hover:text-white",
          className,
        )}
      >
        <Star className="h-4 w-4 text-[color:var(--cool-accent)]" />
        {iconOnly ? <span className="sr-only">{label}</span> : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "group w-full rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(9,13,20,0.94))] p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.05]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/34">
            Utility
          </p>
          <p className="mt-2 text-sm font-semibold text-white">{label}</p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
            A completely normal rating form. It won&apos;t bite.
          </p>
        </div>
        <div className="rounded-[0.95rem] border border-white/10 bg-white/[0.05] p-2.5 text-[color:var(--cool-accent)] transition duration-[var(--motion-base)] group-hover:text-white">
          <MessageSquareText className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}
