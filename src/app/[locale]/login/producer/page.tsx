'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

function sanitizeProducerNext(raw: string | null): string {
  const fallback = '/producer'
  if (!raw) return fallback
  const s = raw.trim()
  if (!s.startsWith('/') || s.startsWith('//') || s.includes('\\')) return fallback
  const pathname = s.split(/[?#]/)[0] ?? ''
  if (pathname !== '/producer' && !pathname.startsWith('/producer/')) return fallback
  return s
}

export default function ProducerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = sanitizeProducerNext(searchParams.get('next'))
  const status = searchParams.get('status')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (signError) {
      setError(signError.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2 text-center">
        Producer sign in
      </h1>
      <p className="text-on-surface-variant font-sans text-sm text-center mb-8">
        Access your Terravoa portal — partnership details stay here, not on the public site.
      </p>

      {status === 'pending' && (
        <div className="mb-6 rounded-xl border border-tertiary/30 bg-tertiary-container/30 px-4 py-3 font-sans text-sm leading-relaxed" role="status">
          <p className="font-medium text-primary mb-1">Application under review</p>
          <p className="text-on-surface-variant">
            Your producer account hasn&apos;t been approved yet. You&apos;ll get an email the moment the Terravoa team confirms your onboarding.
          </p>
        </div>
      )}
      {status === 'suspended' && (
        <div className="mb-6 rounded-xl border border-error/25 bg-error-container/35 px-4 py-3 font-sans text-sm leading-relaxed" role="alert">
          <p className="font-medium text-error mb-1">Access paused</p>
          <p className="text-on-surface-variant">
            Your producer account is temporarily suspended. Please contact
            <a href="mailto:support@terravoa.com" className="text-secondary hover:underline underline-offset-2 ml-1">support@terravoa.com</a>.
          </p>
        </div>
      )}
      {status === 'unlinked' && (
        <div className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3 font-sans text-sm leading-relaxed" role="status">
          <p className="font-medium text-on-surface mb-1">No producer profile yet</p>
          <p className="text-on-surface-variant">
            This sign-in isn&apos;t linked to a producer profile. Complete your application from the public site first.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 space-y-5"
      >
        {error && (
          <p className="text-error font-sans text-sm" role="alert">
            {error}
          </p>
        )}
        <div>
          <label
            htmlFor="email"
            className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <Button
          variant="primary"
          type="submit"
          className="w-full justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <p className="text-center font-sans text-sm text-on-surface-variant mt-8">
        <Link href="/for-producers" className="text-secondary hover:underline underline-offset-4">
          Producer information &amp; application
        </Link>
      </p>
    </div>
  )
}
