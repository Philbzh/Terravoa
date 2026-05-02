'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const labels: Record<string, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  pt: 'PT',
}

export function LocaleSwitcher({ onHero = false }: { onHero?: boolean }) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <label
      className={`flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] ${
        onHero ? 'text-white/70' : 'text-primary/60'
      }`}
    >
      <span className="sr-only">{t('language')}</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value
          startTransition(() => {
            router.replace(pathname, { locale: next })
          })
        }}
        className={`cursor-pointer bg-transparent rounded-full px-2 py-1 focus:outline-none transition-colors ${
          onHero
            ? 'border border-white/30 text-white focus:ring-1 focus:ring-white/30'
            : 'border border-outline-variant/30 text-primary focus:ring-1 focus:ring-primary/40'
        }`}
        aria-label={t('language')}
      >
        {routing.locales.map((loc) => (
          <option
            key={loc}
            value={loc}
            style={{ color: '#1f2a1f', backgroundColor: '#ffffff' }}
          >
            {labels[loc] ?? loc.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  )
}
