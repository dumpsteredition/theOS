import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectCaseStudy } from "@/data/site-content";

import { ProjectImagePlaceholder } from "@/components/ui/placeholders";

type WorkProjectCardProps = {
  project: ProjectCaseStudy;
  featured?: boolean;
};

export function WorkProjectCard({
  project,
  featured = false,
}: WorkProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block rounded-[var(--radius-2xl)]"
    >
      <article className="app-panel interactive-panel relative h-full overflow-hidden rounded-[var(--radius-2xl)] p-5">
        <ProjectImagePlaceholder
          title="Preview surface"
          note="Basic placeholder for now. Swap in a real project screenshot later if it earns the space."
        />

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">
            {project.status}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            {project.type}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            {project.difficulty}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <h3
            className={`font-semibold tracking-[-0.04em] text-white ${
              featured ? "text-3xl" : "text-xl"
            }`}
          >
            {project.title}
          </h3>
          <p className="text-sm leading-6 text-[color:var(--text-muted)]">
            {project.shortDescription}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              Role
            </p>
            <p className="mt-2 text-sm font-medium text-white">{project.role}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              Favorite Weird Detail
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-[color:var(--text-muted)]">
              {project.favoriteWeirdDetail}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-[color:var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/86">
          Open case file
          <ArrowUpRight className="h-4 w-4 text-[color:var(--accent)] transition duration-[var(--motion-base)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </article>
    </Link>
  );
}
