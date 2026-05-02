function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function StoryPageLoading() {
  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-3xl mx-auto mb-10">
        <Bone className="h-4 w-24" />
      </div>

      {/* Hero image */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto mb-16">
        <Bone className="aspect-[21/9] rounded-xl" />
      </div>

      {/* Article */}
      <div className="px-6 md:px-16 max-w-3xl mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <Bone className="h-px w-10" />
          <Bone className="h-3 w-20" />
        </div>

        {/* Title & subtitle */}
        <Bone className="h-12 w-4/5 mb-4" />
        <Bone className="h-7 w-2/3 mb-8" />

        {/* Author row */}
        <div className="flex items-center gap-3 pb-10 mb-10 border-b border-outline-variant/15">
          <Bone className="h-3 w-28" />
          <Bone className="h-3 w-3 rounded-full" />
          <Bone className="h-3 w-32" />
        </div>

        {/* Body paragraphs */}
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-5 w-full" />
              <Bone className="h-5 w-full" />
              <Bone className="h-5 w-5/6" />
              {i % 2 === 1 && <Bone className="h-5 w-4/6" />}
            </div>
          ))}
        </div>

        {/* Producer link */}
        <div className="mt-16 pt-10 border-t border-outline-variant/15 space-y-3">
          <Bone className="h-3 w-32" />
          <Bone className="h-8 w-48" />
          <Bone className="h-4 w-56" />
        </div>
      </div>
    </div>
  )
}
