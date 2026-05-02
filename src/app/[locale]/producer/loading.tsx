function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`}
    />
  )
}

export default function ProducerLoading() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Bone className="h-8 w-48" />
        <Bone className="h-4 w-80" />
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 space-y-2"
          >
            <Bone className="h-3 w-24" />
            <Bone className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Content block */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-3">
        <Bone className="h-5 w-40" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-4/6" />
      </div>
    </div>
  )
}
