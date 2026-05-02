function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminSubscribersLoading() {
  return (
    <div>
      <Bone className="h-9 w-56 mb-2" />
      <Bone className="h-4 w-72 max-w-full mb-2" />
      <Bone className="h-6 w-24 mb-8" />

      <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
        {/* Table head */}
        <div className="bg-surface-container-low/50 px-4 py-3 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Bone key={i} className="h-2.5 w-full max-w-[80px]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 grid grid-cols-3 gap-4 items-center border-t border-outline-variant/10"
          >
            <Bone className="h-3.5 w-48 col-span-1" />
            <Bone className="h-3 w-32 col-span-1" />
            <Bone className="h-5 w-20 rounded-full ml-auto col-span-1" />
          </div>
        ))}
      </div>

      <Bone className="h-3 w-96 max-w-full mt-6" />
    </div>
  )
}
