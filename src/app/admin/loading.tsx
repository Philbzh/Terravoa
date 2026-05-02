function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`}
    />
  )
}

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Bone className="h-8 w-40" />
        <Bone className="h-4 w-72" />
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 space-y-2"
          >
            <Bone className="h-3 w-28" />
            <Bone className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="bg-surface-container-low/50 px-4 py-3">
          <Bone className="h-3 w-32" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-t border-outline-variant/10 px-4 py-3 flex gap-8"
          >
            <Bone className="h-4 w-32" />
            <Bone className="h-4 w-24 hidden sm:block" />
            <Bone className="h-4 w-16 hidden md:block" />
            <Bone className="h-4 w-14 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
