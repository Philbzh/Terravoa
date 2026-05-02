'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error boundary]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <span className="font-serif text-8xl text-outline-variant/20 mb-6 select-none">!</span>
      <h1 className="font-serif text-3xl text-primary mb-4">Something went wrong</h1>
      <p className="font-sans text-sm text-on-surface-variant max-w-md mb-10 leading-relaxed">
        An unexpected error occurred in the admin panel. You can try again or
        return to the admin home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-on-primary font-sans font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center px-8 py-4 rounded-full border border-outline-variant/30 text-on-surface font-sans font-medium hover:bg-surface-container-low transition-colors"
        >
          Back to admin
        </Link>
      </div>
      {error.digest && (
        <p className="font-mono text-xs text-on-surface-variant/40 mt-10">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
