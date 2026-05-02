'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AdminAccess } from '@/lib/auth/require-admin'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  ShoppingCart,
  LineChart,
  UserCheck,
  Mail,
  Star,
  MessageSquare,
  FolderKanban,
  History,
  RotateCcw,
  Siren,
  Banknote,
  Tag,
} from 'lucide-react'

export type AdminNavCounts = {
  pendingApplications: number
  pendingProducts: number
  ratingAlerts: number
  pendingReviews: number
  pendingReturns: number
  pendingPlanRequests: number
}

type NavLink = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
  badgeKey?: keyof AdminNavCounts
}

type NavSection = {
  section: string
  links: NavLink[]
}

const sections: NavSection[] = [
  {
    section: 'Overview',
    links: [{ href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true }],
  },
  {
    section: 'Supplier Ops',
    links: [
      { href: '/admin/producers', label: 'Producers', icon: FolderKanban },
      { href: '/admin/applications', label: 'Applications', icon: ClipboardList, badgeKey: 'pendingApplications' },
      { href: '/admin/products', label: 'Product approval', icon: Package, badgeKey: 'pendingProducts' },
      { href: '/admin/ratings', label: 'Producer ratings', icon: Star, badgeKey: 'ratingAlerts' },
      { href: '/admin/reviews', label: 'Admin comments', icon: MessageSquare, badgeKey: 'pendingReviews' },
      { href: '/admin/plan-requests', label: 'Plan requests', icon: ClipboardList, badgeKey: 'pendingPlanRequests' },
    ],
  },
  {
    section: 'Customer Ops',
    links: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/returns', label: 'Returns', icon: RotateCcw, badgeKey: 'pendingReturns' },
      { href: '/admin/customers', label: 'Customers', icon: UserCheck },
    ],
  },
  {
    section: 'Growth & Finance',
    links: [
      { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
      { href: '/admin/coupons',     label: 'Coupons',     icon: Tag },
      { href: '/admin/finance',     label: 'Finance',     icon: LineChart },
      { href: '/admin/payouts',     label: 'Payouts',     icon: Banknote },
    ],
  },
  {
    section: 'Operations',
    links: [
      { href: '/admin/command-center', label: 'Command center', icon: Siren },
      { href: '/admin/audit-log', label: 'Audit log', icon: History },
      { href: '/admin/user-settings', label: 'User settings', icon: Users },
    ],
  },
]

export function AdminSidebar({ counts, access }: { counts: AdminNavCounts; access: AdminAccess }) {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeQuickIndex, setActiveQuickIndex] = useState(0)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const visibleSections = sections
    .filter((section) => isSectionAllowed(section.section, access))
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => isLinkAllowed(link.href, access)),
    }))
    .filter((section) => section.links.length > 0)

  const activeSection =
    visibleSections.find((section) =>
      section.links.some((link) => isLinkActive(pathname, link.href, Boolean(link.exact))),
    ) ?? visibleSections[0]
  const shouldShowSubtabs = (activeSection?.links.length ?? 0) > 1

  const quickLinks = useMemo(
    () =>
      visibleSections
        .flatMap((section) =>
          section.links.map((link) => ({
            ...link,
            section: section.section,
          })),
        )
        .filter((link) => {
          const q = query.trim().toLowerCase()
          if (!q) return true
          return (
            link.label.toLowerCase().includes(q) ||
            link.section.toLowerCase().includes(q) ||
            link.href.toLowerCase().includes(q)
          )
        })
        .slice(0, 8),
    [visibleSections, query],
  )

  useEffect(() => {
    setActiveQuickIndex(0)
  }, [query])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const el = document.getElementById('admin-nav-search') as HTMLInputElement | null
        el?.focus()
      }
      if (document.activeElement?.id !== 'admin-nav-search') return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveQuickIndex((i) => Math.min(i + 1, quickLinks.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveQuickIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const target = quickLinks[activeQuickIndex]
        if (target) {
          e.preventDefault()
          router.push(target.href)
          setQuery('')
        }
      } else if (e.key === 'Escape') {
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [quickLinks, activeQuickIndex, router])

  return (
    <aside className="w-full rounded-2xl border border-outline-variant/30 bg-surface shadow-sm">
      <div className="px-4 md:px-5 py-3 border-b border-outline-variant/20">
        <div className="flex items-center justify-between gap-3">
          <p className="font-sans text-sm md:text-base font-semibold text-on-surface">Admin Dashboard</p>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-outline-variant/30 bg-surface-container-low px-2.5 py-1 font-sans text-[11px] md:text-xs text-on-surface hover:text-primary hover:border-primary/30 transition-colors"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center rounded-full border border-outline-variant/30 bg-surface-container-low px-2.5 py-1 font-sans text-[11px] md:text-xs text-on-surface hover:text-primary hover:border-primary/30 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-2.5">
          <div className="relative">
            <input
              id="admin-nav-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick switch: pages, areas, routes..."
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-sans text-[10px] text-on-surface-variant/80 border border-outline-variant/30 rounded px-1.5 py-0.5">
              Ctrl+K
            </span>
          </div>
          {query.trim() && (
            <div className="mt-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-2 space-y-1">
              {quickLinks.length === 0 ? (
                <p className="px-2 py-1 font-sans text-xs text-on-surface-variant">No matching pages.</p>
              ) : (
                quickLinks.map((link, i) => (
                  <button
                    key={`${link.href}-${i}`}
                    type="button"
                    onClick={() => {
                      router.push(link.href)
                      setQuery('')
                    }}
                    className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors ${
                      i === activeQuickIndex
                        ? 'bg-primary/12 text-on-surface'
                        : 'hover:bg-surface text-on-surface-variant'
                    }`}
                  >
                    <p className="font-sans text-sm">{link.label}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant">
                      {link.section} · {link.href}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 md:px-4 py-2.5">
        <div className="flex flex-wrap gap-2 mb-2" aria-label="Admin top sections">
          {visibleSections.map((section) => {
            const isActive = activeSection?.section === section.section
            const sectionHref = section.links[0]?.href ?? '/admin'
            return (
              <Link
                key={section.section}
                href={sectionHref}
                className={`relative inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-sm transition-colors ${
                  isActive
                    ? 'text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:text-primary'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-section-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{section.section}</span>
              </Link>
            )
          })}
        </div>

        {activeSection && shouldShowSubtabs && (
          <nav className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/15" aria-label="Admin subtabs">
            {activeSection.links.map((link) => {
              const active = isLinkActive(pathname, link.href, Boolean(link.exact))
              const Icon = link.icon
              const badge =
                link.badgeKey && counts[link.badgeKey] > 0 ? (
                  <span
                    className="ml-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-secondary text-on-secondary text-[10px] font-sans font-semibold flex items-center justify-center tabular-nums"
                    aria-label={`${counts[link.badgeKey]} pending`}
                  >
                    {counts[link.badgeKey] > 99 ? '99+' : counts[link.badgeKey]}
                  </span>
                ) : null
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-sm transition-colors ${
                    active
                      ? 'text-on-surface font-medium ring-1 ring-secondary/30'
                      : 'text-on-surface-variant bg-surface-container-low hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-subtab-pill"
                      className="absolute inset-0 rounded-full bg-secondary/18"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                    />
                  )}
                  <Icon size={16} strokeWidth={1.6} className="relative z-10 shrink-0 opacity-90" />
                  <span className="relative z-10">{link.label}</span>
                  <span className="relative z-10">{badge}</span>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

function isLinkActive(pathname: string, href: string, exact: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

function isSectionAllowed(section: string, access: AdminAccess): boolean {
  if (access.isRootAdmin) return true
  if (section === 'Supplier Ops') return access.canSupplier
  if (section === 'Customer Ops') return access.canCustomer
  if (section === 'Growth & Finance') return access.canMarketing || access.canFinance || access.canSupplier
  if (section === 'Operations') return access.canOperations
  return true
}

function isLinkAllowed(href: string, access: AdminAccess): boolean {
  if (access.isRootAdmin) return true
  if (href.startsWith('/admin/producers') || href.startsWith('/admin/applications') || href.startsWith('/admin/products') || href.startsWith('/admin/ratings') || href.startsWith('/admin/reviews') || href.startsWith('/admin/plan-requests')) {
    return access.canSupplier
  }
  if (href.startsWith('/admin/orders') || href.startsWith('/admin/returns') || href.startsWith('/admin/customers')) {
    return access.canCustomer
  }
  if (href.startsWith('/admin/subscribers')) {
    return access.canMarketing
  }
  if (href.startsWith('/admin/finance') || href.startsWith('/admin/payouts') || href.startsWith('/admin/coupons')) {
    return access.canFinance
  }
  if (href.startsWith('/admin/command-center') || href.startsWith('/admin/audit-log') || href.startsWith('/admin/user-settings')) {
    return access.canOperations
  }
  return href === '/admin'
}
