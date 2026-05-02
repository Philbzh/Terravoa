function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function AdminOrderDetailLoading() {
  return (
    <div>
      <Bone className="h-9 w-40 mb-2" />
      <Bone className="h-4 w-96 max-w-full mb-8" />

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Bone className="h-36 lg:col-span-2" />
        <Bone className="h-36" />
      </div>

      <Bone className="h-24 mb-8" />
      <Bone className="h-64 mb-8" />
      <Bone className="h-56" />
    </div>
  )
}
