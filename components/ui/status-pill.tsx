import { cn } from "@/lib/utils";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
};

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.69rem] font-medium uppercase tracking-[0.24em]",
        tone === "accent"
          ? "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
          : "border-[color:var(--border-subtle)] bg-white/5 text-[color:var(--text-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
