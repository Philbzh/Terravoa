function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function RegionPageLoading() {
  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-10">
        <Bone className="h-4 w-28" />
      </div>

      {/* Hero */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-20">
        <Bone className="h-[350px] rounded-xl mb-10" />
        <div className="space-y-2 max-w-3xl">
          <Bone className="h-5 w-full" />
          <Bone className="h-5 w-5/6" />
          <Bone className="h-5 w-4/6" />
        </div>
      </div>

      {/* Producers section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-24">
        <Bone className="h-9 w-56 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-xl p-8 space-y-4">
              <Bone className="w-16 h-16 rounded-full" />
              <Bone className="h-6 w-40" />
              <Bone className="h-4 w-52" />
              <div className="flex gap-2">
                <Bone className="h-5 w-16 rounded-full" />
                <Bone className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-24">
        <Bone className="h-9 w-52 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Bone className="aspect-square w-full rounded-xl" />
              <Bone className="h-3 w-3/4" />
              <Bone className="h-3 w-1/2" />
              <Bone className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Stories section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <Bone className="h-9 w-48 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-xl overflow-hidden">
              <Bone className="aspect-[16/9] rounded-none" />
              <div className="p-8 space-y-3">
                <Bone className="h-3 w-36" />
                <Bone className="h-6 w-3/4" />
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
