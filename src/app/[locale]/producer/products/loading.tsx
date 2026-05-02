function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function ProducerProductsLoading() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Bone className="h-9 w-28" />
          <Bone className="h-4 w-80 max-w-full" />
        </div>
        <Bone className="h-10 w-32 rounded-full shrink-0" />
      </div>

      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="bg-surface-container-low/50 px-4 py-3 grid grid-cols-4 gap-4">
          {['Product', 'Category', 'Price', 'Status'].map((h) => (
            <Bone key={h} className="h-2.5 w-16" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3 grid grid-cols-4 gap-4 items-center border-t border-outline-variant/10"
          >
            <Bone className="h-4 w-40" />
            <Bone className="h-3 w-24" />
            <Bone className="h-4 w-16" />
            <Bone className="h-5 w-20 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
