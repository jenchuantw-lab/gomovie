export default function MovieLoading() {
  return (
    <main className="max-w-lg mx-auto">
      {/* Header skeleton */}
      <div className="h-12 bg-surface-base flex items-center px-4 gap-3">
        <div className="w-9 h-9 rounded-full bg-surface-muted animate-pulse" />
        <div className="h-4 w-24 rounded bg-surface-muted animate-pulse" />
      </div>

      {/* Hero skeleton */}
      <div className="w-full h-[280px] bg-surface-muted animate-pulse" />

      {/* Score row skeleton */}
      <div className="px-4 py-3 border-b border-border-muted flex gap-4">
        <div className="h-3 w-16 rounded bg-surface-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-surface-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-surface-muted animate-pulse" />
      </div>

      {/* Synopsis skeleton */}
      <div className="px-4 py-4 border-b border-border-muted space-y-2">
        <div className="h-3 w-full rounded bg-surface-muted animate-pulse" />
        <div className="h-3 w-full rounded bg-surface-muted animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-surface-muted animate-pulse" />
      </div>

      {/* Showtimes skeleton */}
      <div className="px-4 pt-4 space-y-3">
        <div className="h-5 w-10 rounded bg-surface-muted animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-14 rounded-full bg-surface-muted animate-pulse" />
          ))}
        </div>
        <div className="h-24 rounded-xl bg-surface-muted animate-pulse" />
      </div>
    </main>
  );
}
