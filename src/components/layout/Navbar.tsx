'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { ShoppingBag, Menu, X, UserCircle, Search, Shield, Store } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCartStore, cartItemCount } from '@/lib/store/cart-store'
import { useSearchStore } from '@/lib/store/search-store'
import { useThemeStore } from '@/lib/store/theme-store'
import { createClient } from '@/lib/supabase/client'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navHrefs = ['/collection', '/producers', '/stories', '/about'] as const
const navKeys = ['shop', 'producers', 'journal', 'about'] as const

export function Navbar() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCartStore((s) => cartItemCount(s.lines))
  const openSearch = useSearchStore((s) => s.open)
  const isDark = useThemeStore((s) => s.isDark)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'producer' | 'customer' | null>(null)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Transparent "hero mode" only on the homepage (dark hero image underneath).
  // Every other page always gets the solid glass navbar so links stay visible.
  const isHomePage = pathname === '/'
  const onHero = isHomePage && !scrolled

  const fetchUserRole = useCallback(async () => {
    try {
      const res = await fetch('/api/user-role')
      if (res.ok) {
        const data = await res.json()
        setUserRole(data.role)
      }
    } catch {
      setUserRole(null)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user
      setIsSignedIn(signedIn)
      if (signedIn) fetchUserRole()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const signedIn = !!session?.user
      setIsSignedIn(signedIn)
      if (signedIn) fetchUserRole()
      else setUserRole(null)
    })
    return () => subscription.unsubscribe()
  }, [fetchUserRole])

  useEffect(() => {
    let lastY = 0
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 50)
      setHidden(y > 180 && y > lastY)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-500',
        onHero
          ? 'bg-transparent'
          : 'bg-surface/94 backdrop-blur-md border-b border-outline-variant/20 shadow-sm',
      )}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center px-10 py-2">
        <nav className="flex items-center gap-8">
          {navHrefs.map((href, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-sans text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300',
                onHero
                  ? 'text-white/75 hover:text-white'
                  : 'text-primary/65 hover:text-primary',
              )}
            >
              {t(navKeys[i])}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex justify-center px-8 py-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/terravoa-wordmark.png"
            alt="Terravoa — Taste the Origin"
            style={{
              height: 90,
              width: 'auto',
              maxWidth: 220,
              filter: onHero || isDark ? 'brightness(0) invert(1)' : 'none',
              opacity: onHero ? 0.9 : isDark ? 0.88 : 1,
            }}
            className="object-contain transition-[filter,opacity] duration-500"
          />
        </Link>

        <div className="flex justify-end items-center gap-3">
          <LocaleSwitcher onHero={onHero} />
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              {userRole === 'admin' && (
                <a
                  href="/admin"
                  className={cn(
                    'inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] font-semibold hover:opacity-75 transition-opacity border px-2.5 py-1.5 rounded-full',
                    onHero
                      ? 'text-white border-white/35'
                      : 'text-secondary border-secondary/30',
                  )}
                >
                  <Shield size={13} strokeWidth={1.5} />
                  Admin
                </a>
              )}
              {userRole === 'producer' && (
                <Link
                  href="/producer"
                  className={cn(
                    'inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] font-semibold hover:opacity-75 transition-opacity border px-2.5 py-1.5 rounded-full',
                    onHero
                      ? 'text-white border-white/35'
                      : 'text-secondary border-secondary/30',
                  )}
                >
                  <Store size={13} strokeWidth={1.5} />
                  Producer
                </Link>
              )}
              <Link
                href="/account"
                className={cn(
                  'inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:opacity-75 transition-opacity border px-3 py-1.5 rounded-full',
                  onHero
                    ? 'text-white border-white/35'
                    : 'text-primary border-primary/25',
                )}
              >
                <UserCircle size={15} strokeWidth={1.5} />
                {t('myAccount')}
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login?tab=register"
                className={cn(
                  'font-sans text-xs uppercase tracking-[0.15em] font-medium transition-colors',
                  onHero
                    ? 'text-white/60 hover:text-white'
                    : 'text-primary/60 hover:text-primary',
                )}
              >
                {t('register')}
              </Link>
              <Link
                href="/login"
                className={cn(
                  'font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:opacity-75 transition-opacity border px-3 py-1.5 rounded-full',
                  onHero
                    ? 'text-white border-white/35'
                    : 'text-primary border-primary/25',
                )}
              >
                {t('signIn')}
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className={cn(
              'transition-opacity hover:opacity-70',
              onHero ? 'text-white' : 'text-primary',
            )}
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <ThemeToggle onHero={onHero} />
          <Link
            href="/cart"
            data-cart-icon
            className={cn(
              'relative transition-opacity hover:opacity-80',
              onHero ? 'text-white' : 'text-primary',
            )}
            aria-label={t('cartAria')}
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-0.5 bg-secondary text-on-secondary text-[10px] rounded-full flex items-center justify-center font-sans font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <span
            className={cn(
              'h-4 w-px mx-1',
              onHero ? 'bg-white/20' : 'bg-outline-variant/50',
            )}
          />
          <Link
            href="/for-producers"
            className={cn(
              'font-sans text-xs uppercase tracking-[0.12em] font-semibold transition-colors',
              onHero
                ? 'text-white/88 hover:text-white'
                : 'text-secondary hover:text-primary',
            )}
          >
            {t('becomeProducer')}
          </Link>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-3">
        <button
          type="button"
          className={onHero ? 'text-white' : 'text-primary'}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t('menu')}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/terravoa-wordmark.png"
            alt="Terravoa"
            style={{
              height: 52,
              width: 'auto',
              maxWidth: 160,
              filter: onHero || isDark ? 'brightness(0) invert(1)' : 'none',
              opacity: onHero ? 0.9 : isDark ? 0.88 : 1,
            }}
            className="object-contain transition-[filter,opacity] duration-500"
          />
        </Link>

        <div className="flex items-center gap-3">
          <LocaleSwitcher onHero={onHero} />
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className={cn(onHero ? 'text-white' : 'text-primary')}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>
          <ThemeToggle onHero={onHero} />
          <Link
            href="/cart"
            className={cn('relative', onHero ? 'text-white' : 'text-primary')}
            aria-label={t('cart')}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-0.5 bg-secondary text-on-secondary text-[10px] rounded-full flex items-center justify-center font-sans font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
            className="md:hidden overflow-hidden bg-surface border-t border-outline-variant/15"
          >
            <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile">
              {navHrefs.map((href, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, duration: 0.22 }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-primary/70 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                  >
                    {t(navKeys[i])}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-outline-variant/20" />
              {isSignedIn ? (
                <>
                  {userRole === 'admin' && (
                    <a
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-secondary font-sans text-sm uppercase tracking-[0.15em] font-semibold"
                    >
                      <Shield size={15} strokeWidth={1.5} />
                      Admin Dashboard
                    </a>
                  )}
                  {userRole === 'producer' && (
                    <Link
                      href="/producer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-secondary font-sans text-sm uppercase tracking-[0.15em] font-semibold"
                    >
                      <Store size={15} strokeWidth={1.5} />
                      Producer Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary font-sans text-sm uppercase tracking-[0.15em] font-medium"
                  >
                    {t('myAccount')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login?tab=register"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary font-sans text-sm uppercase tracking-[0.15em] font-medium"
                  >
                    {t('register')}
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary font-sans text-sm uppercase tracking-[0.15em] font-medium"
                  >
                    {t('signIn')}
                  </Link>
                </>
              )}
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="text-primary font-sans text-sm uppercase tracking-[0.15em] font-medium"
              >
                {t('cart')}
                {cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <hr className="border-outline-variant/20" />
              <Link
                href="/for-producers"
                onClick={() => setMobileOpen(false)}
                className="text-secondary font-sans text-sm uppercase tracking-[0.15em] font-semibold"
              >
                {t('becomeProducer')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
