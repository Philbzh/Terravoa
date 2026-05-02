'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'terravoa_cookie_consent'

export function CookieBanner() {
  const t = useTranslations('cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label={t('dialogLabel')}
      className="fixed bottom-0 left-0 right-0 z-[60] bg-surface border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-6 py-5 md:py-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-sans text-sm text-on-surface/80 max-w-2xl leading-relaxed">
          {t('banner')}{' '}
          <Link href="/cookies" className="text-secondary underline underline-offset-3 hover:opacity-75">
            {t('policyLink')}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={decline}
            className="font-sans text-xs uppercase tracking-[0.12em] text-on-surface-variant hover:text-primary transition-colors px-4 py-2 whitespace-nowrap"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={accept}
            className="font-sans text-xs uppercase tracking-[0.12em] font-semibold bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
