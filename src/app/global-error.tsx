'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1.5rem',
          background: '#faf9f7',
          fontFamily: 'sans-serif',
          margin: 0,
        }}
      >
        <p style={{ fontSize: '5rem', color: '#ccc', marginBottom: '1.5rem', lineHeight: 1 }}>
          500
        </p>
        <h1 style={{ fontSize: '1.75rem', color: '#2d4a2e', marginBottom: '1rem' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#666', maxWidth: '28rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          A critical error occurred. Our team has been notified. Please try
          refreshing the page.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '1rem 2rem',
              borderRadius: '9999px',
              background: '#2d4a2e',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: '1rem 2rem',
              borderRadius: '9999px',
              border: '1px solid #ccc',
              color: '#333',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Go home
          </a>
        </div>
        {error.digest && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#aaa', marginTop: '2.5rem' }}>
            Error ID: {error.digest}
          </p>
        )}
      </body>
    </html>
  )
}
