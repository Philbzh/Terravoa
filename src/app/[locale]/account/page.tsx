import { createServerSupabase as createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Package, Heart, LogOut, ArrowRight } from 'lucide-react'

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login?next=/account`)

  const t = await getTranslations({ locale, namespace: 'account' })
  const name = user.user_metadata?.full_name ?? user.email

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-primary mb-1">{t('title')}</h1>
        <p className="font-sans text-sm text-on-surface-variant mb-10">{name}</p>

        <div className="grid gap-4">
          <Link
            href="/account/orders"
            className="group flex items-center gap-4 p-6 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:border-secondary/30 hover:bg-surface-container-high transition-all duration-300"
          >
            <Package size={24} strokeWidth={1.5} className="text-secondary/70 shrink-0" />
            <div className="flex-1">
              <p className="font-serif text-lg text-primary group-hover:text-secondary transition-colors duration-300">{t('orders')}</p>
              <p className="font-sans text-sm text-on-surface-variant">{t('ordersDesc')}</p>
            </div>
            <ArrowRight size={14} strokeWidth={2} className="text-on-surface-variant/30 group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
          </Link>
          <Link
            href="/account/wishlist"
            className="group flex items-center gap-4 p-6 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:border-secondary/30 hover:bg-surface-container-high transition-all duration-300"
          >
            <Heart size={24} strokeWidth={1.5} className="text-secondary/70 shrink-0" />
            <div className="flex-1">
              <p className="font-serif text-lg text-primary group-hover:text-secondary transition-colors duration-300">{t('wishlist')}</p>
              <p className="font-sans text-sm text-on-surface-variant">{t('wishlistDesc')}</p>
            </div>
            <ArrowRight size={14} strokeWidth={2} className="text-on-surface-variant/30 group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant/20">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 font-sans text-sm text-on-surface-variant/60 hover:text-primary transition-colors"
            >
              <LogOut size={16} strokeWidth={1.5} />
              {t('signOut')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
