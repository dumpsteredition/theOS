export default function Loading() {
  return (
    <section className="space-y-6 py-6">
      <div className="app-panel animate-pulse rounded-[var(--radius-2xl)] p-8">
        <div className="h-3 w-28 rounded-full bg-white/8" />
        <div className="mt-5 h-10 w-72 rounded-2xl bg-white/8" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/7" />
        <div className="mt-2 h-4 w-full max-w-xl rounded-full bg-white/6" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="app-panel-muted animate-pulse rounded-[var(--radius-2xl)] p-6">
          <div className="h-4 w-36 rounded-full bg-white/8" />
          <div className="mt-5 h-40 rounded-[var(--radius-xl)] bg-white/6" />
        </div>
        <div className="app-panel-muted animate-pulse rounded-[var(--radius-2xl)] p-6">
          <div className="h-4 w-28 rounded-full bg-white/8" />
          <div className="mt-5 h-40 rounded-[var(--radius-xl)] bg-white/6" />
        </div>
      </div>
    </section>
  );
}
