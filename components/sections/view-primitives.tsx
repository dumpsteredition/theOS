import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ViewHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function ViewHeader({
  eyebrow,
  title,
  description,
  actions,
}: ViewHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[color:var(--text-muted)] sm:text-lg">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="app-panel-muted rounded-[var(--radius-xl)] p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

type PanelListProps = {
  title: string;
  description?: string;
  items: string[];
  className?: string;
};

export function PanelList({
  title,
  description,
  items,
  className,
}: PanelListProps) {
  return (
    <section className={cn("app-panel-muted rounded-[var(--radius-xl)] p-5", className)}>
      <p className="eyebrow">{title}</p>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-muted)]">
          {description}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[color:var(--text-muted)]"
          >
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
