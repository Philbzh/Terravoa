function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

function ProducerCardSkeleton() {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
      {/* Hero image */}
      <Bone className="aspect-[4/3] w-full rounded-none" />
      <div className="p-8 space-y-3">
        <Bone className="h-6 w-48" />
        <Bone className="h-4 w-64" />
        <div className="flex gap-2 pt-2">
          <Bone className="h-5 w-16 rounded-full" />
          <Bone className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProducersLoading() {
  return (
    <div className="pt-24 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <Bone className="h-4 w-24 mx-auto" />
        <Bone className="h-10 w-56 mx-auto" />
        <Bone className="h-4 w-96 mx-auto" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProducerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
