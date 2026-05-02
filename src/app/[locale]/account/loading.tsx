function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AccountLoading() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        <Bone className="h-9 w-36 mb-1" />
        <Bone className="h-4 w-48 mb-10" />

        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-6 rounded-xl border border-outline-variant/20 bg-surface-container-low">
            <Bone className="w-6 h-6 rounded shrink-0" />
            <div className="space-y-1.5">
              <Bone className="h-5 w-24" />
              <Bone className="h-3 w-48" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/20">
          <Bone className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}
