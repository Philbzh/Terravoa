import { Suspense } from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <p className="font-sans text-sm text-white/50">Loading…</p>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
