'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AdminAccess } from '@/lib/auth/require-admin'
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
  Search,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  PenTool,
} from 'lucide-react'

export type AdminNavCounts = {
  pendingApplications: number
  pendingProducts: number
  ratingAlerts: number
  pendingReviews: number
  pendingReturns: number
  pendingPlanRequests: number
  pendingDiscoveries: number
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
    links: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    section: 'Supplier Ops',
    links: [
      { href: '/admin/producers', label: 'Producers', icon: FolderKanban },
      { href: '/admin/applications', label: 'Applications', icon: ClipboardList, badgeKey: 'pendingApplications' },
      { href: '/admin/products', label: 'Product approval', icon: Package, badgeKey: 'pendingProducts' },
      { href: '/admin/ratings', label: 'Producer ratings', icon: Star, badgeKey: 'ratingAlerts' },
      { href: '/admin/reviews', label: 'Admin comments', icon: MessageSquare, badgeKey: 'pendingReviews' },
      { href: '/admin/discoveries', label: 'Discoveries', icon: MessageSquare, badgeKey: 'pendingDiscoveries' },
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
      { href: '/admin/coupons', label: 'Coupons', icon: Tag },
      { href: '/admin/finance', label: 'Finance', icon: LineChart },
      { href: '/admin/payouts', label: 'Payouts', icon: Banknote },
    ],
  },
  {
    section: 'Content',
    links: [
      { href: '/studio', label: 'Content Studio', icon: PenTool },
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

/* ─── Sidebar content shared between desktop & mobile ─── */
function SidebarContent({
  counts,
  access,
  pathname,
  query,
  setQuery,
  quickLinks,
  activeQuickIndex,
  onNavigate,
}: {
  counts: AdminNavCounts
  access: AdminAccess
  pathname: string
  query: string
  setQuery: (q: string) => void
  quickLinks: (NavLink & { section: string })[]
  activeQuickIndex: number
  onNavigate?: () => void
}) {
  const visibleSections = sections
    .filter((s) => isSectionAllowed(s.section, access))
    .map((s) => ({ ...s, links: s.links.filter((l) => isLinkAllowed(l.href, access)) }))
    .filter((s) => s.links.length > 0)

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <Link href="/admin" className="block" onClick={onNavigate}>
          <h1 className="font-serif text-lg font-bold text-white tracking-tight">Terravoa</h1>
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/50 mt-0.5">
            Admin
          </p>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            id="admin-nav-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick switch…"
            className="w-full rounded-lg bg-white/8 pl-8 pr-10 py-2 font-sans text-xs text-white placeholder:text-white/40 border border-white/8 focus:outline-none focus:border-white/20 focus:bg-white/12 transition-colors"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-sans text-[9px] text-white/30 border border-white/15 rounded px-1 py-0.5">
            Ctrl+K
          </span>
        </div>
        {query.trim() && (
          <div className="mt-2 rounded-lg border border-white/10 bg-white/8 p-1.5 space-y-0.5 max-h-60 overflow-y-auto">
            {quickLinks.length === 0 ? (
              <p className="px-2 py-1.5 font-sans text-[11px] text-white/50">No matching pages.</p>
            ) : (
              quickLinks.map((link, i) => {
                const Icon = link.icon
                return (
                  <Link
                    key={`${link.href}-${i}`}
                    href={link.href}
                    onClick={() => {
                      setQuery('')
                      onNavigate?.()
                    }}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors ${
                      i === activeQuickIndex
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.5} className="shrink-0 opacity-70" />
                    <div className="min-w-0">
                      <p className="font-sans text-xs truncate">{link.label}</p>
                      <p className="font-sans text-[10px] text-white/40 truncate">{link.section}</p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1" aria-label="Admin navigation">
        {visibleSections.map((section) => (
          <SidebarSection
            key={section.section}
            section={section}
            counts={counts}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-3 border-t border-white/8 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ExternalLink size={14} strokeWidth={1.5} />
          View site
        </Link>
        <SignOutButton />
      </div>
    </div>
  )
}

function SidebarSection({
  section,
  counts,
  pathname,
  onNavigate,
}: {
  section: NavSection
  counts: AdminNavCounts
  pathname: string
  onNavigate?: () => void
}) {
  // Overview section has no label, just the link
  if (section.section === 'Overview') {
    return (
      <div className="mb-1">
        {section.links.map((link) => (
          <SidebarNavLink
            key={link.href}
            link={link}
            counts={counts}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    )
  }

  // Count total badges in this section
  const sectionBadgeTotal = section.links.reduce((sum, link) => {
    if (link.badgeKey && counts[link.badgeKey] > 0) return sum + counts[link.badgeKey]
    return sum
  }, 0)

  return (
    <div className="mb-1">
      <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
          {section.section}
        </p>
        {sectionBadgeTotal > 0 && (
          <span className="font-sans text-[9px] font-bold tabular-nums px-1.5 py-0.5 rounded-full bg-secondary/80 text-white min-w-[18px] text-center">
            {sectionBadgeTotal > 99 ? '99+' : sectionBadgeTotal}
          </span>
        )}
      </div>
      {section.links.map((link) => (
        <SidebarNavLink
          key={link.href}
          link={link}
          counts={counts}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function SidebarNavLink({
  link,
  counts,
  pathname,
  onNavigate,
}: {
  link: NavLink
  counts: AdminNavCounts
  pathname: string
  onNavigate?: () => void
}) {
  const active = isLinkActive(pathname, link.href, Boolean(link.exact))
  const Icon = link.icon
  const badgeCount = link.badgeKey ? counts[link.badgeKey] : 0

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-[13px] transition-all duration-150 group relative ${
        active
          ? 'bg-white/12 text-white font-medium shadow-sm'
          : 'text-white/60 hover:text-white hover:bg-white/6'
      }`}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-secondary" />
      )}
      <Icon
        size={16}
        strokeWidth={active ? 1.8 : 1.5}
        className={`shrink-0 ${active ? 'text-secondary' : 'opacity-70 group-hover:opacity-100'}`}
      />
      <span className="flex-1 truncate">{link.label}</span>
      {badgeCount > 0 && (
        <span className="font-sans text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full bg-secondary/90 text-white min-w-[20px] text-center">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  )
}

function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors"
    >
      <LogOut size={14} strokeWidth={1.5} />
      Sign out
    </button>
  )
}

/* ─── Main export ─── */
export function AdminSidebar({ counts, access }: { counts: AdminNavCounts; access: AdminAccess }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeQuickIndex, setActiveQuickIndex] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  const visibleSections = sections
    .filter((s) => isSectionAllowed(s.section, access))
    .map((s) => ({ ...s, links: s.links.filter((l) => isLinkAllowed(l.href, access)) }))
    .filter((s) => s.links.length > 0)

  const quickLinks = useMemo(
    () =>
      visibleSections
        .flatMap((s) => s.links.map((l) => ({ ...l, section: s.section })))
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Reset quick search index on query change
  useEffect(() => {
    setActiveQuickIndex(0)
  }, [query])

  // Keyboard shortcuts: Ctrl+K, arrow nav, Escape
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
        ;(document.activeElement as HTMLElement)?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [quickLinks, activeQuickIndex, router])

  // Focus trap for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <>
      {/* ─── Desktop sidebar (hidden on mobile) ─── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-primary text-white h-screen sticky top-0 overflow-hidden">
        <SidebarContent
          counts={counts}
          access={access}
          pathname={pathname}
          query={query}
          setQuery={setQuery}
          quickLinks={quickLinks}
          activeQuickIndex={activeQuickIndex}
        />
      </aside>

      {/* ─── Mobile header bar ─── */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-primary text-white shadow-md">
        <Link href="/admin">
          <h1 className="font-serif text-base font-bold tracking-tight">Terravoa</h1>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ─── Mobile drawer overlay ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute inset-y-0 left-0 w-72 bg-primary text-white shadow-2xl"
            style={{ animation: 'sidebar-slide-in 200ms ease-out' }}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
            <SidebarContent
              counts={counts}
              access={access}
              pathname={pathname}
              query={query}
              setQuery={setQuery}
              quickLinks={quickLinks}
              activeQuickIndex={activeQuickIndex}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

/* ─── Helpers ─── */
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
  if (href.startsWith('/admin/producers') || href.startsWith('/admin/applications') || href.startsWith('/admin/products') || href.startsWith('/admin/ratings') || href.startsWith('/admin/reviews') || href.startsWith('/admin/discoveries') || href.startsWith('/admin/plan-requests')) {
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
