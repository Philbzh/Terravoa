function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function RegionsLoading() {
  return (
    <div className="pt-24 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <Bone className="h-4 w-32 mx-auto" />
        <Bone className="h-10 w-64 mx-auto" />
        <Bone className="h-4 w-[480px] max-w-full mx-auto" />
      </div>

      {/* Grid — first card is full-width (md:col-span-2), rest are half */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Bone className="md:col-span-2 h-[400px] rounded-xl" />
        <Bone className="h-[300px] rounded-xl" />
        <Bone className="h-[300px] rounded-xl" />
        <Bone className="h-[300px] rounded-xl" />
        <Bone className="h-[300px] rounded-xl" />
      </div>
    </div>
  )
}
