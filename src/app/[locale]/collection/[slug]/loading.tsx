function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function ProductPageLoading() {
  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-10">
        <Bone className="h-4 w-36" />
      </div>

      <div className="px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <Bone className="aspect-square rounded-lg" />

        {/* Info */}
        <div className="space-y-6 pt-2">
          {/* Producer row */}
          <div className="flex items-center gap-4 mb-6">
            <Bone className="w-12 h-12 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Bone className="h-4 w-32" />
              <Bone className="h-3 w-24" />
            </div>
          </div>

          <Bone className="h-12 w-3/4" />
          <Bone className="h-7 w-20" />

          {/* Description */}
          <div className="space-y-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-4 w-4/6" />
          </div>

          {/* Details */}
          <div className="space-y-2 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Bone className="w-1.5 h-1.5 rounded-full shrink-0" />
                <Bone className="h-3 w-48" />
              </div>
            ))}
          </div>

          {/* Button */}
          <Bone className="h-14 w-48 rounded-full" />
        </div>
      </div>
    </div>
  )
}
