function Bone({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low rounded animate-pulse ${className ?? ''}`} />
}

export default function CheckoutSuccessLoading() {
  return (
    <div className="max-w-xl mx-auto text-center py-8 pt-28">
      <Bone className="h-12 w-40 mx-auto mb-4" />
      <div className="space-y-2 mb-2">
        <Bone className="h-5 w-full mx-auto" />
        <Bone className="h-5 w-5/6 mx-auto" />
      </div>
      <Bone className="h-4 w-64 mx-auto mb-2" />
      <Bone className="h-4 w-36 mx-auto mb-8" />
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Bone className="h-12 w-44 rounded-full mx-auto sm:mx-0" />
        <Bone className="h-12 w-32 rounded-full mx-auto sm:mx-0" />
      </div>
    </div>
  )
}
