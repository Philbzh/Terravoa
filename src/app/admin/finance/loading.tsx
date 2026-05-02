function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminFinanceLoading() {
  return (
    <div>
      <Bone className="h-9 w-28 mb-2" />
      <Bone className="h-4 w-96 max-w-full mb-8" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 space-y-2"
          >
            <Bone className="h-2.5 w-28" />
            <Bone className="h-8 w-24" />
          </div>
        ))}
      </div>

      <Bone className="h-28 w-full rounded-xl" />
    </div>
  )
}
