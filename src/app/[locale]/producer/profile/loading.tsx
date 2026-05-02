function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function ProducerProfileLoading() {
  return (
    <div>
      <Bone className="h-9 w-36 mb-2" />
      <Bone className="h-4 w-96 max-w-full mb-8" />

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <Bone className="h-6 w-20 mb-4" />
          <div className="space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Bone className="h-2.5 w-24" />
                <Bone className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <Bone className="h-2.5 w-16 mb-4" />
          <div className="flex gap-4">
            <Bone className="w-32 h-32 rounded-lg" />
            <Bone className="w-48 h-32 rounded-lg" />
          </div>
        </div>

        <Bone className="h-16 w-full rounded-xl" />
      </div>
    </div>
  )
}
