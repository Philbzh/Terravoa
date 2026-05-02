function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function ProducerPageLoading() {
  return (
    <div className="pb-24">
      {/* Masthead */}
      <section className="pt-32 md:pt-40 pb-16 px-6 md:px-8 max-w-5xl mx-auto text-center space-y-6">
        <Bone className="h-3 w-24 mx-auto" />
        <Bone className="h-16 w-80 mx-auto" />
        <Bone className="h-5 w-96 max-w-full mx-auto" />
        <div className="flex justify-center gap-6">
          <Bone className="h-4 w-24" />
          <Bone className="h-4 w-20" />
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-14 space-y-3">
          <Bone className="h-3 w-28 mx-auto" />
          <Bone className="h-9 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Bone className="aspect-square rounded-lg" />
              <Bone className="h-3 w-32" />
              <Bone className="h-5 w-48" />
              <Bone className="h-4 w-20" />
            </div>
          ))}
        </div>
      </section>

      {/* Story section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-6">
          <Bone className="h-3 w-20" />
          <Bone className="h-12 w-3/4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bone key={i} className="h-4 w-full" />
            ))}
            <Bone className="h-4 w-2/3" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Bone className="aspect-[3/4] rounded-lg" />
        </div>
      </section>
    </div>
  )
}
