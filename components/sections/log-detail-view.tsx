import Link from "next/link";
import { notFound } from "next/navigation";

import { getLogBySlug, systemLogs } from "@/data/site-content";

type LogDetailViewProps = {
  slug: string;
};

export function LogDetailView({ slug }: LogDetailViewProps) {
  const log = getLogBySlug(slug);

  if (!log) {
    notFound();
  }

  const currentIndex = systemLogs.findIndex((item) => item.slug === slug);
  const previousLog = currentIndex > 0 ? systemLogs[currentIndex - 1] : undefined;
  const nextLog =
    currentIndex >= 0 && currentIndex < systemLogs.length - 1
      ? systemLogs[currentIndex + 1]
      : undefined;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/logs"
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.06]"
        >
          Back to logs
        </Link>
        <span className="rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
          {log.category}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
          {log.status}
        </span>
      </div>

      <section className="app-panel rounded-[var(--radius-2xl)] p-6 sm:p-7">
        <div className="flex flex-wrap gap-2">
          {[log.dateLabel, log.readTime].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]"
            >
              {item}
            </span>
          ))}
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white">
          {log.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--text-muted)]">
          {log.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {log.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/78"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <article className="app-panel rounded-[var(--radius-2xl)] p-6">
          <div className="space-y-5 text-base leading-8 text-[color:var(--text-muted)]">
            {log.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <section className="app-panel-muted rounded-[var(--radius-2xl)] p-5">
            <p className="eyebrow">Log context</p>
            <div className="mt-5 grid gap-3">
              {[
                ["Category", log.category],
                ["Status", log.status],
                ["Read time", log.readTime],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="app-panel-muted rounded-[var(--radius-2xl)] p-5">
            <p className="eyebrow">Archive navigation</p>
            <div className="mt-5 grid gap-3">
              {previousLog ? (
                <Link
                  href={`/logs/${previousLog.slug}`}
                  className="rounded-2xl border border-white/8 bg-black/10 px-4 py-4 transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.04]"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                    Previous
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{previousLog.title}</p>
                </Link>
              ) : null}
              {nextLog ? (
                <Link
                  href={`/logs/${nextLog.slug}`}
                  className="rounded-2xl border border-white/8 bg-black/10 px-4 py-4 transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.04]"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                    Next
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{nextLog.title}</p>
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
