export function ProductListSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Loading products</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <span className="sr-only">Loading product</span>
      <div>
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-4 h-3 w-20 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-16 w-full animate-pulse rounded bg-slate-200" />
      </div>
      <div>
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 h-6 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
