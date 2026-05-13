'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Shield, ShoppingBag, ArrowLeft, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { sanitizeAdminNextPath } from '@/lib/auth/admin-login'

type Portal = 'select' | 'admin' | 'producer'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = useMemo(
    () => sanitizeAdminNextPath(searchParams.get('next')),
    [searchParams],
  )
  const forbidden = searchParams.get('error') === 'forbidden'
  const initialPortal = searchParams.get('portal') === 'producer' ? 'producer' : forbidden ? 'admin' : 'select'

  const [portal, setPortal] = useState<Portal>(initialPortal)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!cancelled) setSessionEmail(user?.email ?? null)
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signError) { setError(signError.message); return }

    if (portal === 'producer') {
      router.push('/en/producer')
    } else {
      router.push(next)
    }
    router.refresh()
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setSessionEmail(null)
    router.refresh()
  }

  // ─── Portal selector view ───
  if (portal === 'select') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-6 py-12">
        {/* Brand */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white tracking-tight mb-2">
            Terravoa
          </h1>
          <p className="font-sans text-sm text-white/60">
            Select your portal to continue
          </p>
        </div>

        {/* Portal cards */}
        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Admin portal card */}
          <button
            type="button"
            onClick={() => setPortal('admin')}
            className="group relative rounded-2xl border border-white/15 bg-white/6 backdrop-blur-sm p-8 text-left transition-all duration-200 hover:bg-white/12 hover:border-white/25 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-secondary/20 mb-5">
              <Shield className="h-7 w-7 text-secondary" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-xl font-semibold text-white mb-2">
              Admin Portal
            </h2>
            <p className="font-sans text-sm text-white/50 leading-relaxed">
              Manage products, orders, producers, and platform operations.
            </p>
            <div className="absolute top-6 right-6 font-sans text-[9px] uppercase tracking-[0.15em] text-white/30 border border-white/15 rounded px-2 py-1">
              Staff only
            </div>
          </button>

          {/* Producer portal card */}
          <button
            type="button"
            onClick={() => setPortal('producer')}
            className="group relative rounded-2xl border border-white/15 bg-white/6 backdrop-blur-sm p-8 text-left transition-all duration-200 hover:bg-white/12 hover:border-white/25 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary-fixed/15 mb-5">
              <ShoppingBag className="h-7 w-7 text-primary-fixed" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-xl font-semibold text-white mb-2">
              Producer Portal
            </h2>
            <p className="font-sans text-sm text-white/50 leading-relaxed">
              Manage your product listings, view orders, and track your performance.
            </p>
            <div className="absolute top-6 right-6 font-sans text-[9px] uppercase tracking-[0.15em] text-white/30 border border-white/15 rounded px-2 py-1">
              Partners
            </div>
          </button>
        </div>

        {/* Back to site */}
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Terravoa
          </Link>
        </div>
      </div>
    )
  }

  // ─── Login form view (admin or producer) ───
  const isAdmin = portal === 'admin'

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center h-14 w-14 rounded-xl mx-auto mb-4"
            style={{ background: isAdmin ? 'rgba(254,158,114,0.15)' : 'rgba(210,232,210,0.12)' }}
          >
            {isAdmin ? (
              <Shield className="h-7 w-7 text-secondary" strokeWidth={1.5} />
            ) : (
              <ShoppingBag className="h-7 w-7 text-primary-fixed" strokeWidth={1.5} />
            )}
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-1">
            {isAdmin ? 'Admin Portal' : 'Producer Portal'}
          </h1>
          <p className="font-sans text-sm text-white/50">
            {isAdmin
              ? 'Terravoa staff area — authorised accounts only.'
              : 'Access your Terravoa producer dashboard.'}
          </p>
        </div>

        {/* Forbidden alert (admin only) */}
        {forbidden && isAdmin && (
          <div className="mb-6 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 font-sans text-sm leading-relaxed" role="alert">
            <p className="font-medium text-red-300 mb-1">Access denied</p>
            <p className="text-white/60">
              {sessionEmail ? (
                <>
                  Signed in as <strong className="text-white/80">{sessionEmail}</strong>, but not authorized for admin.
                </>
              ) : (
                <>This account is not authorized for the admin area.</>
              )}
            </p>
            {sessionEmail && (
              <button
                type="button"
                onClick={signOut}
                className="mt-2 font-sans text-xs uppercase tracking-wider text-secondary hover:text-white transition-colors"
              >
                Sign out and try another account
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-sm p-7 space-y-5"
        >
          {error && (
            <p className="text-red-300 font-sans text-sm bg-red-500/10 border border-red-400/20 px-4 py-3 rounded-lg" role="alert">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="font-sans text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/12 transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="font-sans text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/12 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-secondary text-white px-5 py-3 font-sans text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            ) : (
              <><Lock size={14} /> Sign in</>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-6 px-1">
          <button
            type="button"
            onClick={() => { setPortal('select'); setError(null) }}
            className="inline-flex items-center gap-1.5 font-sans text-xs text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            Change portal
          </button>
          <Link
            href="/"
            className="font-sans text-xs text-white/40 hover:text-white transition-colors"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}
