import { Suspense } from 'react'

export default function LocaleLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-12rem)] pt-32 pb-20 px-6 flex items-start justify-center bg-surface">
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
