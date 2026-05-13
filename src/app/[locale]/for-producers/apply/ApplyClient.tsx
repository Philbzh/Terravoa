'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Loader2,
  AlertTriangle,
  ExternalLink,
  FileImage,
  X,
} from 'lucide-react'
import { submitApplication } from './actions'
import { useTranslations, useLocale } from 'next-intl'

const totalSteps = 5

// ---------------------------------------------------------------------------
// Draft persistence
// ---------------------------------------------------------------------------
// The producer application takes 5-10 minutes to fill. A single accidental
// back-button, page refresh, or click on an inline link (e.g. "quality
// standards") previously wiped everything. We now snapshot every text / choice
// field to sessionStorage on input, and restore on mount. File inputs cannot
// be restored from storage (File blobs aren't serialisable), so those still
// need to be re-selected; we warn users about that at the relevant step.

const DRAFT_KEY = 'terravoa:apply-draft:v1'
const DRAFT_TTL_MS = 48 * 60 * 60 * 1000 // 48h

type DraftValues = Record<string, string | string[]>

type ApplyDraft = {
  step: number
  values: DraftValues
  savedAt: number
}

function readDraft(): ApplyDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ApplyDraft
    if (
      !parsed ||
      typeof parsed.step !== 'number' ||
      typeof parsed.savedAt !== 'number' ||
      !parsed.values
    ) {
      return null
    }
    if (Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      sessionStorage.removeItem(DRAFT_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeDraft(draft: ApplyDraft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // Quota exceeded or storage unavailable — silently ignore. The user will
    // lose their draft if they navigate away, but the form still works.
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

function draftValue(
  draft: ApplyDraft | null,
  name: string,
  fallback = '',
): string {
  if (!draft) return fallback
  const v = draft.values[name]
  if (typeof v === 'string') return v
  return fallback
}

function draftChecked(
  draft: ApplyDraft | null,
  name: string,
  value: string,
): boolean {
  if (!draft) return false
  const v = draft.values[name]
  if (Array.isArray(v)) return v.includes(value)
  if (typeof v === 'string') return v === value
  return false
}

function formatAge(savedAt: number, t: (k: string, v?: Record<string, string | number>) => string): string {
  const ms = Date.now() - savedAt
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return t('draft.momentsAgo')
  if (mins < 60) return t('draft.minutesAgo', { n: mins })
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('draft.hoursAgo', { n: hours })
  const days = Math.floor(hours / 24)
  return t('draft.daysAgo', { n: days })
}

// ---------------------------------------------------------------------------
// Category grouping
// ---------------------------------------------------------------------------
// Instead of 16 chips wrapping in an unstructured pile, group them into four
// clear themes so producers can scan quickly. "Other" stays standalone and
// reveals a free-text field when ticked (so producers can ask us to add a new
// category without leaving the form).

type CategoryKey =
  | 'oliveOil' | 'vinegars' | 'preserves' | 'pastaGrains' | 'spices' | 'teas'
  | 'cheese' | 'curedMeats' | 'truffles' | 'freshProduce'
  | 'honey' | 'chocolateSweets'
  | 'ceramics' | 'textiles' | 'bodyCare'
  | 'other'

const categoryGroups: ReadonlyArray<{ groupKey: string; items: CategoryKey[] }> = [
  { groupKey: 'pantry',           items: ['oliveOil', 'vinegars', 'preserves', 'pastaGrains', 'spices', 'teas'] },
  { groupKey: 'dairyMeatsFresh',  items: ['cheese', 'curedMeats', 'truffles', 'freshProduce'] },
  { groupKey: 'sweetsHoney',      items: ['honey', 'chocolateSweets'] },
  { groupKey: 'artisan',          items: ['ceramics', 'textiles', 'bodyCare'] },
]

export function ApplyClient() {
  const t = useTranslations('producerApply')
  const locale = useLocale()

  // `draft` starts as undefined (not yet hydrated), becomes null (no draft)
  // or a draft object after the first client-side tick. We don't render the
  // form until this is resolved, so `defaultValue`/`defaultChecked` get the
  // correct initial values on first render. This avoids SSR/CSR hydration
  // mismatch (sessionStorage is unavailable on the server).
  const [draft, setDraft] = useState<ApplyDraft | null | undefined>(undefined)
  const [draftRestored, setDraftRestored] = useState(false)

  const [step, setStep] = useState(1)
  const [formKey, setFormKey] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const stepRef = useRef(step)
  useEffect(() => { stepRef.current = step }, [step])

  // Mount: read draft and (if valid) seed the step.
  useEffect(() => {
    const found = readDraft()
    if (found) {
      setStep(Math.min(Math.max(found.step, 1), totalSteps))
      setDraftRestored(true)
      setDraft(found)
    } else {
      setDraft(null)
    }
  }, [])

  // Auto-save: debounced input/change listener on the form.
  useEffect(() => {
    if (draft === undefined) return
    const form = formRef.current
    if (!form) return

    let timer: ReturnType<typeof setTimeout> | null = null
    const save = () => {
      try {
        const fd = new FormData(form)
        const values: DraftValues = {}
        const keys = new Set<string>()
        for (const key of fd.keys()) keys.add(key)
        for (const key of keys) {
          const all = fd
            .getAll(key)
            .filter((v): v is string => typeof v === 'string')
          if (all.length === 0) continue
          values[key] = all.length > 1 ? all : all[0]
        }
        writeDraft({ step: stepRef.current, values, savedAt: Date.now() })
      } catch {
        /* ignore */
      }
    }
    const onEvent = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(save, 400)
    }

    form.addEventListener('input', onEvent)
    form.addEventListener('change', onEvent)
    return () => {
      if (timer) clearTimeout(timer)
      form.removeEventListener('input', onEvent)
      form.removeEventListener('change', onEvent)
    }
  }, [draft, formKey])

  // Whenever `step` changes, update the stored step eagerly so a back-nav
  // from step 3 comes back to step 3 (not step 1) even if no field was edited.
  useEffect(() => {
    if (draft === undefined) return
    const existing = readDraft()
    if (!existing) return
    writeDraft({ ...existing, step, savedAt: Date.now() })
  }, [step, draft])

  function discardDraft() {
    clearDraft()
    setDraft(null)
    setDraftRestored(false)
    setStep(1)
    setError(null)
    // Force a remount of the form so every uncontrolled input picks up its
    // new empty defaultValue.
    setFormKey((k) => k + 1)
  }

  const stepLabels = [
    t('stepLabels.aboutYou'),
    t('stepLabels.products'),
    t('stepLabels.quality'),
    t('stepLabels.story'),
    t('stepLabels.shipping'),
  ]

  // ── Step 3: Certifications ──
  const certificationOptions = [
    { key: 'dop',       label: t('step3.certifications.dop') },
    { key: 'igp',       label: t('step3.certifications.igp') },
    { key: 'stg',       label: t('step3.certifications.stg') },
    { key: 'labelRouge',label: t('step3.certifications.labelRouge') },
    { key: 'euOrganic', label: t('step3.certifications.euOrganic') },
    { key: 'abFrance',  label: t('step3.certifications.abFrance') },
    { key: 'demeter',   label: t('step3.certifications.demeter') },
    { key: 'fairTrade', label: t('step3.certifications.fairTrade') },
    { key: 'none',      label: t('step3.certifications.none') },
    { key: 'other',     label: t('step3.certifications.other') },
  ]

  // ── Step 5: Shipping speeds ──
  const shippingTimes = [
    t('step5.shippingTimes.within24'),
    t('step5.shippingTimes.within48'),
    t('step5.shippingTimes.moreThan48'),
  ]

  const next = () => { setStep((s) => Math.min(s + 1, totalSteps)); setError(null) }
  const prev = () => { setStep((s) => Math.max(s - 1, 1)); setError(null) }

  function validateStep(current: number): string | null {
    if (!formRef.current) return t('errors.formNotReady')
    const fd = new FormData(formRef.current)

    if (current === 1) {
      if (!String(fd.get('full_name') ?? '').trim())  return t('errors.fullNameRequired')
      if (!String(fd.get('business_name') ?? '').trim()) return t('errors.businessNameRequired')
      if (!String(fd.get('company_registration_country') ?? '').trim()) {
        return t('errors.companyRegistrationCountryRequired')
      }
      if (!String(fd.get('vat_id') ?? '').trim()) return t('errors.vatIdRequired')
      if (!String(fd.get('email') ?? '').trim())      return t('errors.emailRequired')
      if (!String(fd.get('country') ?? '').trim())    return t('errors.countryRequired')
      if (!String(fd.get('region') ?? '').trim())     return t('errors.regionRequired')
    }
    if (current === 2) {
      if (fd.getAll('product_categories').length === 0) return t('errors.categoryRequired')
      if (!String(fd.get('product_description') ?? '').trim()) return t('errors.descriptionRequired')
    }
    if (current === 3) {
      if (!String(fd.get('production_scale') ?? '').trim()) return t('errors.productionScaleRequired')
    }
    if (current === 4) {
      if (!String(fd.get('story') ?? '').trim()) return t('errors.storyRequired')
    }
    if (current === 5) {
      if (!String(fd.get('shipping_speed') ?? '').trim()) return t('errors.shippingSpeedRequired')
      const all4 =
        fd.get('confirm_no_alcohol') === 'on' &&
        fd.get('confirm_local') === 'on' &&
        fd.get('confirm_quality') === 'on' &&
        fd.get('confirm_company_registered') === 'on'
      if (!all4) return t('errors.confirmationsRequired')
    }
    return null
  }

  function onPrimaryAction() {
    setError(null)
    const err = validateStep(step)
    if (err) { setError(err); return }
    if (step < totalSteps) {
      next()
    } else {
      void handleSubmit()
    }
  }

  async function handleSubmit() {
    if (!formRef.current) return
    setSubmitting(true)
    setError(null)
    const formData = new FormData(formRef.current)
    const result = await submitApplication(formData)
    if (result.success) {
      clearDraft()
      setSubmitted(true)
    } else {
      setError(result.error ?? t('errors.genericError'))
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-16 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Check size={32} strokeWidth={1.5} className="text-primary" />
          </div>
          <h1 className="font-serif text-4xl text-primary mb-6">{t('success.title')}</h1>
          <p className="text-on-surface-variant font-sans text-lg leading-relaxed mb-4">{t('success.body1')}</p>
          <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-4">{t('success.body2')}</p>
          <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-12 max-w-md mx-auto">{t('success.body3')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-sans font-medium hover:scale-[0.98] transition-transform"
          >
            {t('success.backHome')}
          </Link>
        </motion.div>
      </div>
    )
  }

  // Hold back the form until we know whether a draft exists, so uncontrolled
  // inputs receive the right initial values on first render.
  if (draft === undefined) {
    return <div className="pt-32 pb-24 px-6 md:px-16 max-w-5xl mx-auto" aria-hidden="true" />
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-16 max-w-5xl mx-auto">
      <Link
        href="/for-producers"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        {t('backToProducerInfo')}
      </Link>

      <motion.div className="mb-12" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-6">{t('pageTitle')}</h1>
        <div className="space-y-4 text-on-surface-variant font-sans leading-relaxed max-w-2xl">
          <p>{t('intro1')}</p>
          <p>{t('intro2')}</p>
          <p className="text-on-surface/80">{t('intro3')}</p>
        </div>
      </motion.div>

      {draftRestored && draft && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-secondary/30 bg-secondary/5 px-5 py-4 flex items-start gap-3"
        >
          <Check size={18} strokeWidth={1.8} className="text-secondary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-primary mb-0.5">
              {t('draft.restoredTitle')}
            </p>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {t('draft.restoredBody', { age: formatAge(draft.savedAt, t) })}
            </p>
          </div>
          <button
            type="button"
            onClick={discardDraft}
            className="font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors shrink-0 self-start"
          >
            {t('draft.discard')}
          </button>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-3 gap-1">
          {stepLabels.map((label, i) => (
            <span
              key={i}
              className={`font-sans text-xs uppercase tracking-wider transition-colors ${
                i + 1 <= step ? 'text-secondary' : 'text-on-surface-variant/70'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-0.5 bg-outline-variant/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-secondary rounded-full"
            initial={{ width: '20%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <form key={formKey} ref={formRef} noValidate onSubmit={(e) => e.preventDefault()}>
        <input type="hidden" name="locale" value={locale} />

        {/* ── Step 1: About You ── */}
        <div className={step === 1 ? '' : 'hidden'}>
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step1.sectionTitle')}</SectionTitle>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-2xl -mt-4">
              {t('step1.contactCompanyIntro')}
            </p>

            <FormField label={t('step1.fullName')} hint={t('step1.fullNameHint')} required>
              <input
                name="full_name"
                type="text"
                required
                defaultValue={draftValue(draft, 'full_name')}
                className={inputClasses}
                placeholder={t('step1.fullNamePlaceholder')}
              />
            </FormField>
            <FormField label={t('step1.businessName')} hint={t('step1.businessNameHint')} required>
              <input
                name="business_name"
                type="text"
                required
                defaultValue={draftValue(draft, 'business_name')}
                className={inputClasses}
                placeholder={t('step1.businessNamePlaceholder')}
              />
            </FormField>

            <FormField
              label={t('step1.companyRegistrationCountry')}
              hint={t('step1.companyRegistrationCountryHint')}
              required
            >
              <input
                name="company_registration_country"
                type="text"
                required
                defaultValue={draftValue(draft, 'company_registration_country')}
                className={inputClasses}
                placeholder={t('step1.companyRegistrationCountryPlaceholder')}
              />
            </FormField>

            <FormField label={t('step1.vatId')} hint={t('step1.vatIdHint')} required>
              <input
                name="vat_id"
                type="text"
                required
                defaultValue={draftValue(draft, 'vat_id')}
                className={inputClasses}
                placeholder={t('step1.vatIdPlaceholder')}
                autoComplete="off"
              />
            </FormField>

            <FormField
              label={t('step1.desiredPlanLabel')}
              hint={t('step1.desiredPlanHint')}
            >
              <select
                name="desired_plan"
                defaultValue={draftValue(draft, 'desired_plan', 'founding')}
                className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary py-3 font-sans text-sm text-on-surface focus:outline-none transition-colors"
              >
                <option value="founding">{t('step1.desiredPlans.founding')}</option>
                <option value="growth">{t('step1.desiredPlans.growth')}</option>
                <option value="premium">{t('step1.desiredPlans.premium')}</option>
              </select>
            </FormField>
            <FormField label={t('step1.email')} required>
              <input
                name="email"
                type="email"
                required
                defaultValue={draftValue(draft, 'email')}
                className={inputClasses}
                placeholder={t('step1.emailPlaceholder')}
              />
            </FormField>
            <FormField label={t('step1.phone')} hint={t('step1.phoneHint')}>
              <input
                name="phone"
                type="tel"
                defaultValue={draftValue(draft, 'phone')}
                className={inputClasses}
                placeholder={t('step1.phonePlaceholder')}
              />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step1.regionTitle')}</SectionTitle>
            </div>

            <FormField label={t('step1.country')} required>
              <input
                name="country"
                type="text"
                required
                defaultValue={draftValue(draft, 'country')}
                className={inputClasses}
                placeholder={t('step1.countryPlaceholder')}
              />
            </FormField>
            <FormField label={t('step1.region')} required>
              <input
                name="region"
                type="text"
                required
                defaultValue={draftValue(draft, 'region')}
                className={inputClasses}
                placeholder={t('step1.regionPlaceholder')}
              />
            </FormField>
            <FormField label={t('step1.productionLocation')}>
              <input
                name="production_location"
                type="text"
                defaultValue={draftValue(draft, 'production_location')}
                className={inputClasses}
                placeholder={t('step1.productionLocationPlaceholder')}
              />
            </FormField>
          </motion.div>
        </div>

        {/* ── Step 2: Your Products ── */}
        <div className={step === 2 ? '' : 'hidden'}>
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step2.sectionTitle')}</SectionTitle>

            {/* No-alcohol notice */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50/60 px-5 py-4">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-amber-800 mb-0.5">{t('step2.noAlcoholTitle')}</p>
                <p className="font-sans text-sm text-amber-700 leading-relaxed">{t('step2.noAlcoholNote')}</p>
              </div>
            </div>

            <FormField label={t('step2.categoriesLabel')} hint={t('step2.categoriesHint')} required>
              <div className="space-y-6 mt-2">
                {categoryGroups.map(({ groupKey, items }) => (
                  <div key={groupKey}>
                    <h3 className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant/85 mb-3">
                      {t(`step2.categoryGroups.${groupKey}`)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((key) => (
                        <label
                          key={key}
                          className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low/50 px-4 py-3 cursor-pointer hover:border-secondary/30 transition-colors has-[:checked]:border-secondary/60 has-[:checked]:bg-secondary/5"
                        >
                          <input
                            type="checkbox"
                            name="product_categories"
                            value={key}
                            defaultChecked={draftChecked(draft, 'product_categories', key)}
                            className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                          />
                          <span className="font-sans text-sm text-on-surface/80 leading-snug">
                            {t(`step2.categories.${key}`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* "Other" with free-text reveal */}
                <OtherCategoryBlock
                  draft={draft}
                  label={t('step2.categories.other')}
                  otherLabel={t('step2.otherCategoryLabel')}
                  otherHint={t('step2.otherCategoryHint')}
                  otherPlaceholder={t('step2.otherCategoryPlaceholder')}
                />
              </div>
            </FormField>

            <FormField label={t('step2.descriptionLabel')} hint={t('step2.descriptionHint')} required>
              <textarea
                name="product_description"
                required
                rows={4}
                defaultValue={draftValue(draft, 'product_description')}
                className={inputClasses}
                placeholder={t('step2.descriptionPlaceholder')}
              />
            </FormField>

            <FormField label={t('step2.differentiatorLabel')} hint={t('step2.differentiatorHint')}>
              <textarea
                name="product_differentiator"
                rows={3}
                defaultValue={draftValue(draft, 'product_differentiator')}
                className={inputClasses}
                placeholder={t('step2.differentiatorPlaceholder')}
              />
            </FormField>

            {/* Pricing range — reframed as a broad band, with a visible € affordance */}
            <FormField label={t('step2.pricingRangeLabel')} hint={t('step2.pricingRangeHint')}>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 font-sans text-sm text-on-surface-variant/80 pointer-events-none"
                >
                  €
                </span>
                <input
                  name="pricing_range"
                  type="text"
                  inputMode="text"
                  defaultValue={draftValue(draft, 'pricing_range')}
                  className={`${inputClasses} pl-5`}
                  placeholder={t('step2.pricingRangePlaceholder')}
                />
              </div>
            </FormField>
          </motion.div>
        </div>

        {/* ── Step 3: Quality & Craft ── */}
        <div className={step === 3 ? '' : 'hidden'}>
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <div>
              <SectionTitle>{t('step3.sectionTitle')}</SectionTitle>
              <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-2xl">
                {t('step3.sectionSubtitle')}
              </p>
            </div>

            {/* Organic */}
            <FormField label={t('step3.organicLabel')}>
              <div className="space-y-3 mt-1">
                {(
                  [
                    ['yes_certified', t('step3.organicYesCertified')],
                    ['partially',     t('step3.organicPartially')],
                    ['no_natural',    t('step3.organicNoNatural')],
                    ['none',          t('step3.organicNone')],
                  ] as [string, string][]
                ).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="is_organic"
                      value={value}
                      defaultChecked={draftChecked(draft, 'is_organic', value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={t('step3.organicCertifierLabel')} hint={t('step3.organicCertifierHint')}>
              <input
                name="organic_certifier"
                type="text"
                defaultValue={draftValue(draft, 'organic_certifier')}
                className={inputClasses}
                placeholder={t('step3.organicCertifierPlaceholder')}
              />
            </FormField>

            {/* Certifications */}
            <div className="border-t border-outline-variant/15 pt-8">
              <FormField label={t('step3.certificationsLabel')} hint={t('step3.certificationsHint')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {certificationOptions.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low/50 px-4 py-3 cursor-pointer hover:border-secondary/30 transition-colors has-[:checked]:border-secondary/60 has-[:checked]:bg-secondary/5"
                    >
                      <input
                        type="checkbox"
                        name="certifications"
                        value={key}
                        defaultChecked={draftChecked(draft, 'certifications', key)}
                        className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                      />
                      <span className="font-sans text-sm text-on-surface/80 leading-snug">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label={t('step3.certificationBodyLabel')} hint={t('step3.certificationBodyHint')}>
              <input
                name="certification_body"
                type="text"
                defaultValue={draftValue(draft, 'certification_body')}
                className={inputClasses}
                placeholder={t('step3.certificationBodyPlaceholder')}
              />
            </FormField>

            {/* Production scale */}
            <div className="border-t border-outline-variant/15 pt-8">
              <FormField label={t('step3.productionScaleLabel')} hint={t('step3.productionScaleHint')} required>
                <div className="space-y-3 mt-1">
                  {(
                    [
                      ['fully_artisanal', t('step3.productionScales.fullyArtisanal')],
                      ['traditional',     t('step3.productionScales.traditional')],
                      ['small_business',  t('step3.productionScales.smallBusiness')],
                      ['undisclosed',     t('step3.productionScales.undisclosed')],
                    ] as [string, string][]
                  ).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="production_scale"
                        value={value}
                        required
                        defaultChecked={draftChecked(draft, 'production_scale', value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label={t('step3.annualProductionLabel')} hint={t('step3.annualProductionHint')}>
              <input
                name="annual_production"
                type="text"
                defaultValue={draftValue(draft, 'annual_production')}
                className={inputClasses}
                placeholder={t('step3.annualProductionPlaceholder')}
              />
            </FormField>

            <FormField label={t('step3.shelfLifeLabel')} hint={t('step3.shelfLifeHint')}>
              <input
                name="shelf_life"
                type="text"
                defaultValue={draftValue(draft, 'shelf_life')}
                className={inputClasses}
                placeholder={t('step3.shelfLifePlaceholder')}
              />
            </FormField>

            {/* Packaging readiness */}
            <div className="border-t border-outline-variant/15 pt-8">
              <FormField label={t('step3.packagingLabel')}>
                <div className="space-y-3 mt-1">
                  {(
                    [
                      ['yes',       t('step3.packagingYes')],
                      ['partially', t('step3.packagingPartially')],
                      ['no',        t('step3.packagingNo')],
                    ] as [string, string][]
                  ).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="packaging_ready"
                        value={value}
                        defaultChecked={draftChecked(draft, 'packaging_ready', value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
          </motion.div>
        </div>

        {/* ── Step 4: Your Story ── */}
        <div className={step === 4 ? '' : 'hidden'}>
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step4.sectionTitle')}</SectionTitle>

            <FormField label={t('step4.storyLabel')} required hint={t('step4.storyHint')}>
              <textarea
                name="story"
                required
                rows={7}
                defaultValue={draftValue(draft, 'story')}
                className={inputClasses}
                placeholder={t('step4.storyPlaceholder')}
              />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step4.glimpseTitle')}</SectionTitle>
              <p className="text-on-surface-variant font-sans text-sm mt-2 mb-1">{t('step4.glimpseSubtitle')}</p>
              <p className="text-on-surface-variant/80 font-sans text-xs italic mb-6">{t('step4.photosDraftWarning')}</p>
            </div>

            <FormField label={t('step4.productPhotos')}>
              <UploadArea
                id="product_photos"
                name="product_photos"
                text={t('step4.productPhotosUpload')}
                uploadNote={t('step4.uploadNote')}
                selectedLabel={(n) => t('step4.filesSelected', { n })}
                clearLabel={t('step4.clearSelection')}
              />
            </FormField>
            <FormField label={t('step4.productionProcess')}>
              <UploadArea
                id="production_photos"
                name="production_photos"
                text={t('step4.productionProcessUpload')}
                uploadNote={t('step4.uploadNote')}
                selectedLabel={(n) => t('step4.filesSelected', { n })}
                clearLabel={t('step4.clearSelection')}
              />
            </FormField>
            <FormField label={t('step4.environmentRegion')}>
              <UploadArea
                id="environment_photos"
                name="environment_photos"
                text={t('step4.environmentRegionUpload')}
                uploadNote={t('step4.uploadNote')}
                selectedLabel={(n) => t('step4.filesSelected', { n })}
                clearLabel={t('step4.clearSelection')}
              />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step4.onlinePresenceTitle')}</SectionTitle>
              <p className="text-on-surface-variant font-sans text-sm mt-2 mb-1">{t('step4.onlinePresenceSubtitle')}</p>
            </div>

            <FormField label={t('step4.website')} hint={t('step4.websiteHint')}>
              <input
                name="website"
                type="url"
                defaultValue={draftValue(draft, 'website')}
                className={inputClasses}
                placeholder={t('step4.websitePlaceholder')}
              />
            </FormField>
            <FormField label={t('step4.instagram')}>
              <input
                name="instagram"
                type="text"
                defaultValue={draftValue(draft, 'instagram')}
                className={inputClasses}
                placeholder={t('step4.instagramPlaceholder')}
              />
            </FormField>
            <FormField label={t('step4.otherLinks')} hint={t('step4.otherLinksHint')}>
              <input
                name="other_links"
                type="text"
                defaultValue={draftValue(draft, 'other_links')}
                className={inputClasses}
                placeholder={t('step4.otherLinksPlaceholder')}
              />
            </FormField>
          </motion.div>
        </div>

        {/* ── Step 5: Shipping & Confirmation ── */}
        <div className={step === 5 ? '' : 'hidden'}>
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step5.sectionTitle')}</SectionTitle>

            <FormField label={t('step5.shippingCountries')}>
              <input
                name="shipping_countries"
                type="text"
                defaultValue={draftValue(draft, 'shipping_countries')}
                className={inputClasses}
                placeholder={t('step5.shippingCountriesPlaceholder')}
              />
            </FormField>

            <FormField label={t('step5.shippingSpeed')} required>
              <div className="space-y-3">
                {shippingTimes.map((time) => (
                  <label key={time} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="shipping_speed"
                      value={time}
                      required
                      defaultChecked={draftChecked(draft, 'shipping_speed', time)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{time}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={t('step5.shippingExperience')}>
              <div className="flex gap-6">
                {[t('step5.yes'), t('step5.no')].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping_experience"
                      value={opt}
                      defaultChecked={draftChecked(draft, 'shipping_experience', opt)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-sans text-sm text-on-surface/80">{opt}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step5.confirmTitle')}</SectionTitle>
            </div>

            {/* Three confirmations */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirm_no_alcohol"
                value="on"
                required
                defaultChecked={draftChecked(draft, 'confirm_no_alcohol', 'on')}
                className="mt-1 w-4 h-4 accent-primary shrink-0"
              />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">{t('step5.confirmNoAlcohol')}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirm_local"
                value="on"
                required
                defaultChecked={draftChecked(draft, 'confirm_local', 'on')}
                className="mt-1 w-4 h-4 accent-primary shrink-0"
              />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">{t('step5.confirmLocal')}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirm_quality"
                value="on"
                required
                defaultChecked={draftChecked(draft, 'confirm_quality', 'on')}
                className="mt-1 w-4 h-4 accent-primary shrink-0"
              />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">
                {t.rich('step5.confirmQuality', {
                  link: (chunks) => (
                    // Open in a new tab so filling out the application isn't
                    // interrupted. This uses a native anchor (not the next-intl
                    // Link) because target="_blank" + locale-aware routing is
                    // still honoured via the /terms path.
                    <a
                      href={`/${locale}/terms`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-secondary underline underline-offset-2 hover:opacity-80"
                    >
                      {chunks}
                      <ExternalLink size={12} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  ),
                })}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirm_company_registered"
                value="on"
                required
                defaultChecked={draftChecked(draft, 'confirm_company_registered', 'on')}
                className="mt-1 w-4 h-4 accent-primary shrink-0"
              />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">
                {t('step5.confirmCompanyRegistered')}
              </span>
            </label>
          </motion.div>
        </div>

        {/* Error */}
        {error && <p className="text-error font-sans text-sm mt-6">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-outline-variant/15">
          {step > 1 ? (
            <button type="button" onClick={prev} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors">
              <ArrowLeft size={14} />
              {t('nav.back')}
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={onPrimaryAction}
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full font-sans font-medium hover:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" />{t('nav.submitting')}</>
            ) : (
              <>{step === totalSteps ? t('nav.submit') : t('nav.continue')}<ArrowRight size={16} strokeWidth={2} /></>
            )}
          </button>
        </div>

        {/* Subtle auto-save indicator */}
        <p className="mt-6 text-center font-sans text-xs text-on-surface-variant/70">
          {t('draft.autosaveNote')}
        </p>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputClasses =
  'w-full bg-transparent border-b border-outline-variant/50 focus:border-primary py-3 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none transition-colors'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-2xl text-primary">{children}</h2>
}

function FormField({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className="font-sans text-xs uppercase tracking-wider text-on-surface/85">
          {label}
          {required && <span className="text-secondary ml-1">*</span>}
        </span>
        {hint && <span className="block font-sans text-xs text-on-surface-variant/85 mt-0.5">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

// Free-text reveal for the "Other" category.
function OtherCategoryBlock({
  draft,
  label,
  otherLabel,
  otherHint,
  otherPlaceholder,
}: {
  draft: ApplyDraft | null
  label: string
  otherLabel: string
  otherHint: string
  otherPlaceholder: string
}) {
  const [checked, setChecked] = useState<boolean>(() =>
    draftChecked(draft, 'product_categories', 'other'),
  )

  return (
    <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-low/30 p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="product_categories"
          value="other"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary shrink-0"
        />
        <span className="font-sans text-sm text-on-surface/80 leading-snug">
          {label}
        </span>
      </label>

      {checked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pl-7"
        >
          <label className="block mb-1.5">
            <span className="font-sans text-xs uppercase tracking-wider text-on-surface/85">
              {otherLabel}
            </span>
            <span className="block font-sans text-xs text-on-surface-variant/85 mt-0.5">
              {otherHint}
            </span>
          </label>
          <input
            name="other_category_label"
            type="text"
            defaultValue={draftValue(draft, 'other_category_label')}
            maxLength={80}
            className={inputClasses}
            placeholder={otherPlaceholder}
          />
        </motion.div>
      )}
    </div>
  )
}

function UploadArea({
  id,
  name,
  text,
  uploadNote,
  selectedLabel,
  clearLabel,
}: {
  id: string
  name: string
  text: string
  uploadNote: string
  selectedLabel: (n: number) => string
  clearLabel: string
}) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []))
  }, [])

  const clear = useCallback(() => {
    setFiles([])
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return (
    <div>
      <label
        htmlFor={id}
        className="block border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center hover:border-secondary/40 transition-colors cursor-pointer"
      >
        <input
          id={id}
          ref={inputRef}
          name={name}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleChange}
        />
        <Upload size={24} strokeWidth={1.2} className="text-on-surface-variant/70 mx-auto mb-3" />
        <p className="font-sans text-sm text-on-surface-variant">{text}</p>
        <p className="font-sans text-xs text-on-surface-variant/75 mt-1">{uploadNote}</p>
      </label>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
              {selectedLabel(files.length)}
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              <X size={12} strokeWidth={2} />
              {clearLabel}
            </button>
          </div>
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 font-sans text-xs text-on-surface/85">
                <FileImage size={12} strokeWidth={1.8} className="shrink-0 text-on-surface-variant" />
                <span className="truncate flex-1 min-w-0">{f.name}</span>
                <span className="text-on-surface-variant shrink-0">
                  {(f.size / 1024).toFixed(0)} KB
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
