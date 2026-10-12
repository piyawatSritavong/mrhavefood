export default function Loading() {
  return (
    <div className="min-h-dvh bg-surface" aria-busy="true" aria-live="polite">
      <span className="sr-only">กำลังโหลด…</span>
      <div className="mx-auto max-w-7xl animate-pulse space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-16 rounded-panel bg-skeleton" />
        <div className="h-24 rounded-card bg-skeleton" />
        <div className="h-64 rounded-card bg-skeleton sm:h-80" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}
