import { Suspense } from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 flex items-center justify-center bg-surface">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <p className="text-center font-sans text-sm text-on-surface-variant">
              Loading…
            </p>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  )
}
