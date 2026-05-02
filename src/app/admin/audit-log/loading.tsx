function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminAuditLogLoading() {
  return (
    <div>
      <Bone className="h-9 w-40 mb-2" />
      <Bone className="h-4 w-full max-w-xl mb-8" />

      <div className="flex flex-wrap gap-3 mb-6">
        <Bone className="h-10 w-full max-w-md" />
        <Bone className="h-10 w-48" />
        <Bone className="h-10 w-28" />
      </div>

      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="bg-surface-container-low/50 px-4 py-3 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-2.5 w-full max-w-[72px]" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 grid grid-cols-6 gap-4 items-start border-t border-outline-variant/10"
          >
            <Bone className="h-3 w-28" />
            <Bone className="h-3 w-32 col-span-1" />
            <Bone className="h-3 w-24 col-span-1" />
            <Bone className="h-8 w-full col-span-1" />
            <Bone className="h-6 w-full col-span-1" />
            <Bone className="h-3 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
