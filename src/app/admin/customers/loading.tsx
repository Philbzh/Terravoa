function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminCustomersLoading() {
  return (
    <div>
      <Bone className="h-9 w-36 mb-2" />
      <Bone className="h-4 w-80 max-w-full mb-8" />

      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        {/* Table head */}
        <div className="bg-surface-container-low/50 px-4 py-3 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-2.5 w-full max-w-[80px]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 grid grid-cols-6 gap-4 items-center border-t border-outline-variant/10"
          >
            <div className="space-y-1.5 col-span-1">
              <Bone className="h-3.5 w-28" />
              <Bone className="h-3 w-36" />
            </div>
            <Bone className="h-3 w-40 col-span-1" />
            <Bone className="h-3 w-8 ml-auto col-span-1" />
            <Bone className="h-3 w-16 ml-auto col-span-1" />
            <Bone className="h-3 w-24 col-span-1" />
            <Bone className="h-3 w-24 col-span-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
