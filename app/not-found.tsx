import Link from "next/link";
import { ScanSearch } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-10">
      <div className="app-panel rounded-[var(--radius-2xl)] p-8 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-white/72">
          <ScanSearch className="h-3.5 w-3.5 text-[color:var(--accent)]" />
          Route not found
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
          That view is not in this workspace.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--text-muted)]">
          The shell is real, but not every route deserves to exist. Head back to the dashboard, system logs, or profile and keep exploring from there.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-4 py-3 text-sm font-medium text-[color:var(--accent-strong)]"
          >
            Return to dashboard
          </Link>
          <Link
            href="/logs"
            className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white"
          >
            Open system logs
          </Link>
        </div>
      </div>
    </section>
  );
}
