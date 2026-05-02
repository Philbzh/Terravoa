function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

function StoryRowSkeleton({ flip }: { flip?: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <Bone className={`aspect-[16/10] rounded-xl ${flip ? 'lg:order-2' : ''}`} />
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Bone className="h-px w-10" />
          <Bone className="h-3 w-20" />
        </div>
        <Bone className="h-8 w-3/4" />
        <Bone className="h-5 w-56" />
        <div className="space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-5/6" />
          <Bone className="h-4 w-4/6" />
        </div>
        <Bone className="h-3 w-36" />
      </div>
    </div>
  )
}

export default function StoriesLoading() {
  return (
    <div className="pt-24 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <Bone className="h-4 w-20 mx-auto" />
        <Bone className="h-10 w-40 mx-auto" />
        <Bone className="h-4 w-[520px] max-w-full mx-auto" />
      </div>

      {/* Story rows */}
      <div className="space-y-16">
        <StoryRowSkeleton />
        <StoryRowSkeleton flip />
        <StoryRowSkeleton />
      </div>
    </div>
  )
}
