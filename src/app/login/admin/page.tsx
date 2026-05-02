'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { sanitizeAdminNextPath } from '@/lib/auth/admin-login'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = useMemo(
    () => sanitizeAdminNextPath(searchParams.get('next')),
    [searchParams],
  )
  const forbidden = searchParams.get('error') === 'forbidden'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!cancelled) setSessionEmail(user?.email ?? null)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

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

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setSessionEmail(null)
    router.refresh()
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2 text-center">Admin sign in</h1>
      <p className="text-on-surface-variant font-sans text-sm text-center mb-6">
        Terravoa staff area. Authorised accounts only.
      </p>

      {forbidden && (
        <div
          className="mb-6 rounded-xl border border-error/25 bg-error-container/35 px-4 py-3 font-sans text-sm text-on-surface leading-relaxed"
          role="alert"
        >
          <p className="font-medium text-error mb-1">Access denied</p>
          <p className="text-on-surface-variant">
            {sessionEmail ? (
              <>
                You are signed in as <strong className="text-on-surface">{sessionEmail}</strong>, but
                this account is not authorized for the admin area.
              </>
            ) : (
              <>This account is not authorized for the admin area.</>
            )}
          </p>
          {sessionEmail && (
            <button
              type="button"
              onClick={() => signOut()}
              className="mt-3 font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary"
            >
              Sign out and use a staff account
            </button>
          )}
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
        <Link href="/" className="text-secondary hover:underline underline-offset-4">
          Back to site
        </Link>
      </p>
    </div>
  )
}
