function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminProducersLoading() {
  return (
    <div>
      <Bone className="h-9 w-32 mb-2" />
      <Bone className="h-4 w-80 max-w-full mb-8" />

      <div className="flex gap-6 mb-6">
        <Bone className="h-4 w-20" />
        <Bone className="h-4 w-20" />
        <Bone className="h-4 w-20" />
      </div>

      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="bg-surface-container-low/50 px-4 py-3 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-2.5 w-full max-w-[80px]" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3 grid grid-cols-6 gap-4 items-center border-t border-outline-variant/10"
          >
            <div className="col-span-1 space-y-1.5">
              <Bone className="h-4 w-32" />
              <Bone className="h-2.5 w-28" />
            </div>
            <Bone className="h-3 w-24 col-span-1" />
            <Bone className="h-3 w-20 col-span-1" />
            <Bone className="h-3 w-16 col-span-1" />
            <Bone className="h-5 w-20 rounded-full col-span-1" />
            <div className="col-span-1 flex justify-end gap-3">
              <Bone className="h-3 w-16" />
              <Bone className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
