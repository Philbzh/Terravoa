function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

function ApplicationSkeleton() {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="space-y-1.5">
          <Bone className="h-6 w-40" />
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-48" />
        </div>
        <div className="flex gap-2">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-8 w-20 rounded-full" />
          <Bone className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <Bone className="h-3 w-48 mb-2" />
      <div className="space-y-1.5 mb-2">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-3/4" />
      </div>
      <Bone className="h-3 w-56" />
    </div>
  )
}

export default function AdminApplicationsLoading() {
  return (
    <div>
      <Bone className="h-9 w-52 mb-2" />
      <Bone className="h-4 w-96 max-w-full mb-10" />
      <div className="space-y-8">
        <ApplicationSkeleton />
        <ApplicationSkeleton />
        <ApplicationSkeleton />
      </div>
    </div>
  )
}
