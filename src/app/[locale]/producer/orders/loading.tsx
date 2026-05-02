function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

function OrderGroupSkeleton() {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-surface-container-low/70 border-b border-outline-variant/15 px-6 py-5 space-y-2">
        <Bone className="h-3 w-36" />
        <Bone className="h-4 w-52" />
        <Bone className="h-3 w-28" />
      </div>
      {/* Items */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="px-6 py-6 border-t border-outline-variant/10 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <Bone className="h-4 w-40" />
              <Bone className="h-3 w-16" />
            </div>
            <Bone className="h-5 w-16" />
          </div>
          <Bone className="h-9 w-full max-w-sm rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export default function ProducerOrdersLoading() {
  return (
    <div>
      <Bone className="h-10 w-32 mb-2" />
      <Bone className="h-4 w-96 max-w-full mb-8" />
      <div className="space-y-8 md:space-y-10">
        <OrderGroupSkeleton />
        <OrderGroupSkeleton />
      </div>
    </div>
  )
}
