function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

function OrderSkeleton() {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-surface-container-low/70 border-b border-outline-variant/15 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <Bone className="h-3 w-36" />
          <Bone className="h-3 w-28" />
        </div>
        <div className="flex items-center gap-3">
          <Bone className="h-6 w-24 rounded-full" />
          <Bone className="h-5 w-16" />
        </div>
      </div>
      {/* Items */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="px-5 py-4 flex items-start gap-4 border-b border-outline-variant/10 last:border-none">
          <Bone className="w-14 h-14 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-4 w-48" />
            <Bone className="h-3 w-32" />
            <div className="flex justify-between mt-1">
              <Bone className="h-3 w-12" />
              <Bone className="h-3 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AccountOrdersLoading() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        <Bone className="h-4 w-24 mb-8" />
        <Bone className="h-9 w-32 mb-1" />
        <Bone className="h-4 w-56 mb-10" />
        <div className="space-y-6">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      </div>
    </div>
  )
}
