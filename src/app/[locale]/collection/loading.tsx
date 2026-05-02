import { PageContainer } from '@/components/ui/PageContainer'

function Bone({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-surface-container-high ${className ?? ''}`} />
  )
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Bone className="aspect-square w-full rounded-xl" />
      <Bone className="h-3 w-3/4" />
      <Bone className="h-3 w-1/2" />
      <Bone className="h-4 w-1/4" />
    </div>
  )
}

export default function CollectionLoading() {
  return (
    <PageContainer>
      {/* Header skeleton */}
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <Bone className="h-4 w-32 mx-auto" />
        <Bone className="h-10 w-64 mx-auto" />
        <Bone className="h-4 w-full max-w-lg mx-auto" />
      </div>

      {/* Search skeleton */}
      <Bone className="h-12 max-w-xl mx-auto rounded-full mb-10" />

      {/* Filter skeletons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <Bone key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Sort bar skeleton */}
      <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-4">
        <Bone className="h-3 w-20" />
        <Bone className="h-9 w-36 rounded-lg" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </PageContainer>
  )
}
