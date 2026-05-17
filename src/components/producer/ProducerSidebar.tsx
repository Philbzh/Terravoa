'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  ReceiptText,
  Truck,
  UserCircle,
  LifeBuoy,
  BarChart3,
} from 'lucide-react'

export function ProducerSidebar() {
  const t = useTranslations('producerPortal.sidebar')
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/producer', label: t('dashboard'), icon: LayoutDashboard, exact: true, tour: 'dashboard' },
    { href: '/producer/analytics', label: t('analytics'), icon: BarChart3, tour: 'analytics' },
    { href: '/producer/orders', label: t('orders'), icon: ShoppingBag, tour: 'orders' },
    { href: '/producer/products', label: t('products'), icon: Package, tour: 'products' },
    { href: '/producer/plan', label: 'Plan & Billing', icon: ReceiptText, tour: 'plan' },
    { href: '/producer/partnership', label: t('payments'), icon: CreditCard, tour: 'partnership' },
    { href: '/producer/shipping', label: t('shipping'), icon: Truck, tour: 'shipping' },
    { href: '/producer/profile', label: t('profile'), icon: UserCircle, tour: 'profile' },
    { href: '/producer/support', label: t('support'), icon: LifeBuoy, tour: 'support' },
  ]

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-outline-variant/20 pb-4 md:pb-0 md:pr-6">
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4 md:mb-6">
        {t('portalLabel')}
      </p>
      <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1">
        {links.map(({ href, label, icon: Icon, exact, tour }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              data-tour={tour}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm whitespace-nowrap transition-colors',
                active
                  ? 'bg-primary/8 text-primary'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low',
              )}
            >
              <Icon size={18} strokeWidth={1.2} className="shrink-0 opacity-80" />
              {label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut()}
        className="mt-6 md:mt-10 font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary text-left w-full"
      >
        {t('signOut')}
      </button>
    </aside>
  )
}
