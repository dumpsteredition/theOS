"use client";

import { ImageIcon, ScanSearch, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type BasePlaceholderProps = {
  eyebrow: string;
  title: string;
  note: string;
  className?: string;
  children?: React.ReactNode;
};

function PlaceholderFrame({
  eyebrow,
  title,
  note,
  className,
  children,
}: BasePlaceholderProps) {
  return (
    <div className={cn("placeholder-surface rounded-[var(--radius-xl)] p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">{title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]">
            {note}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AvatarPlaceholder({
  label = "Avatar placeholder: add headshot later",
  initials = "KB",
  className,
}: {
  label?: string;
  initials?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "placeholder-surface flex h-24 w-24 flex-col items-center justify-center rounded-[2rem] px-2 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg font-semibold text-white">
        {initials}
      </div>
      <div className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
        <UserRound className="h-3.5 w-3.5 text-[color:var(--accent)]" />
        Avatar
      </div>
      <p className="mt-1 text-[0.65rem] leading-4 text-white/52">{label}</p>
    </div>
  );
}

export function ScreenshotPlaceholder({
  label = "Screenshot placeholder",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[7rem] items-end rounded-[var(--radius-xl)] border border-dashed border-white/10 bg-white/[0.02] p-3",
        className,
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
        <ImageIcon className="h-3.5 w-3.5 text-[color:var(--accent)]" />
        {label}
      </div>
    </div>
  );
}

export function ProjectImagePlaceholder({
  title = "Preview Surface",
  note = "Image placeholder: add project screenshot later.",
  className,
}: {
  title?: string;
  note?: string;
  className?: string;
}) {
  return (
    <PlaceholderFrame
      eyebrow="Project preview"
      title={title}
      note={note}
      className={className}
    >
      <ScreenshotPlaceholder
        label="Basic screenshot slot"
        className="mt-6 min-h-[9rem] sm:min-h-[10rem]"
      />
    </PlaceholderFrame>
  );
}

export function ArtifactPlaceholder({
  title = "Case study visual",
  note = "Artifact slot: case study visual or screenshot.",
  className,
}: {
  title?: string;
  note?: string;
  className?: string;
}) {
  return (
    <PlaceholderFrame
      eyebrow="Artifacts"
      title={title}
      note={note}
      className={className}
    >
      <ScreenshotPlaceholder
        label="Artifact slot: case study visual"
        className="mt-6 min-h-[12rem] sm:min-h-[14rem]"
      />
    </PlaceholderFrame>
  );
}

export function AssetListPlaceholder({
  title = "Asset documentation",
  note = "Use this to keep track of what still needs to be dropped into the workspace.",
  items,
}: {
  title?: string;
  note?: string;
  items: string[];
}) {
  return (
    <PlaceholderFrame eyebrow="Assets needed" title={title} note={note}>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[color:var(--text-muted)]"
          >
            <ScanSearch className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </PlaceholderFrame>
  );
}
