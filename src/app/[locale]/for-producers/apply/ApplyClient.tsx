'use client'

import { useState, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Upload, Check, Loader2, AlertTriangle } from 'lucide-react'
import { submitApplication } from './actions'
import { useTranslations, useLocale } from 'next-intl'

const totalSteps = 5

export function ApplyClient() {
  const t = useTranslations('producerApply')
  const locale = useLocale()

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const stepLabels = [
    t('stepLabels.aboutYou'),
    t('stepLabels.products'),
    t('stepLabels.quality'),
    t('stepLabels.story'),
    t('stepLabels.shipping'),
  ]

  // ── Step 2: Product categories (no alcohol) ──
  const productCategories = [
    { key: 'oliveOil',       label: t('step2.categories.oliveOil') },
    { key: 'honey',          label: t('step2.categories.honey') },
    { key: 'cheese',         label: t('step2.categories.cheese') },
    { key: 'curedMeats',     label: t('step2.categories.curedMeats') },
    { key: 'truffles',       label: t('step2.categories.truffles') },
    { key: 'pastaGrains',    label: t('step2.categories.pastaGrains') },
    { key: 'preserves',      label: t('step2.categories.preserves') },
    { key: 'vinegars',       label: t('step2.categories.vinegars') },
    { key: 'chocolateSweets',label: t('step2.categories.chocolateSweets') },
    { key: 'spices',         label: t('step2.categories.spices') },
    { key: 'teas',           label: t('step2.categories.teas') },
    { key: 'freshProduce',   label: t('step2.categories.freshProduce') },
    { key: 'ceramics',       label: t('step2.categories.ceramics') },
    { key: 'textiles',       label: t('step2.categories.textiles') },
    { key: 'bodyCare',       label: t('step2.categories.bodyCare') },
    { key: 'other',          label: t('step2.categories.other') },
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
      const all3 =
        fd.get('confirm_no_alcohol') === 'on' &&
        fd.get('confirm_local') === 'on' &&
        fd.get('confirm_quality') === 'on'
      if (!all3) return t('errors.confirmationsRequired')
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

      <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()}>
        <input type="hidden" name="locale" value={locale} />

        {/* ── Step 1: About You ── */}
        <div className={step === 1 ? '' : 'hidden'}>
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step1.sectionTitle')}</SectionTitle>

            <FormField label={t('step1.fullName')} required>
              <input name="full_name" type="text" required className={inputClasses} placeholder={t('step1.fullNamePlaceholder')} />
            </FormField>
            <FormField label={t('step1.businessName')} hint={t('step1.businessNameHint')}>
              <input name="business_name" type="text" className={inputClasses} placeholder={t('step1.businessNamePlaceholder')} />
            </FormField>

            <FormField
              label="Preferred partnership plan"
              hint="This helps us tailor the review. Final assignment is confirmed by admin."
            >
              <select
                name="desired_plan"
                defaultValue="founding"
                className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary py-3 font-sans text-sm text-on-surface focus:outline-none transition-colors"
              >
                <option value="founding">Founding - EUR0/mo - 15% commission</option>
                <option value="growth">Growth - EUR39/mo - 12% commission</option>
                <option value="premium">Premium - EUR89/mo - 8% commission</option>
              </select>
            </FormField>
            <FormField label={t('step1.email')} required>
              <input name="email" type="email" required className={inputClasses} placeholder={t('step1.emailPlaceholder')} />
            </FormField>
            <FormField label={t('step1.phone')} hint={t('step1.phoneHint')}>
              <input name="phone" type="tel" className={inputClasses} placeholder={t('step1.phonePlaceholder')} />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step1.regionTitle')}</SectionTitle>
            </div>

            <FormField label={t('step1.country')} required>
              <input name="country" type="text" required className={inputClasses} placeholder={t('step1.countryPlaceholder')} />
            </FormField>
            <FormField label={t('step1.region')} required>
              <input name="region" type="text" required className={inputClasses} placeholder={t('step1.regionPlaceholder')} />
            </FormField>
            <FormField label={t('step1.productionLocation')}>
              <input name="production_location" type="text" className={inputClasses} placeholder={t('step1.productionLocationPlaceholder')} />
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
              <div className="flex flex-wrap gap-2 mt-1">
                {productCategories.map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors has-[:checked]:bg-primary has-[:checked]:text-on-primary"
                  >
                    <input type="checkbox" name="product_categories" value={key} className="sr-only" />
                    <span className="font-sans text-xs uppercase tracking-wider">{label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={t('step2.descriptionLabel')} hint={t('step2.descriptionHint')} required>
              <textarea name="product_description" required rows={4} className={inputClasses} placeholder={t('step2.descriptionPlaceholder')} />
            </FormField>

            <FormField label={t('step2.differentiatorLabel')} hint={t('step2.differentiatorHint')}>
              <textarea name="product_differentiator" rows={3} className={inputClasses} placeholder={t('step2.differentiatorPlaceholder')} />
            </FormField>

            <FormField label={t('step2.pricingRangeLabel')} hint={t('step2.pricingRangeHint')}>
              <input name="pricing_range" type="text" className={inputClasses} placeholder={t('step2.pricingRangePlaceholder')} />
            </FormField>
          </motion.div>
        </div>

        {/* ── Step 3: Quality & Craft (NEW) ── */}
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
                    <input type="radio" name="is_organic" value={value} className="w-4 h-4 accent-primary" />
                    <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={t('step3.organicCertifierLabel')} hint={t('step3.organicCertifierHint')}>
              <input name="organic_certifier" type="text" className={inputClasses} placeholder={t('step3.organicCertifierPlaceholder')} />
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
                      <input type="checkbox" name="certifications" value={key} className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
                      <span className="font-sans text-sm text-on-surface/80 leading-snug">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label={t('step3.certificationBodyLabel')} hint={t('step3.certificationBodyHint')}>
              <input name="certification_body" type="text" className={inputClasses} placeholder={t('step3.certificationBodyPlaceholder')} />
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
                      <input type="radio" name="production_scale" value={value} required className="w-4 h-4 accent-primary" />
                      <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label={t('step3.annualProductionLabel')} hint={t('step3.annualProductionHint')}>
              <input name="annual_production" type="text" className={inputClasses} placeholder={t('step3.annualProductionPlaceholder')} />
            </FormField>

            <FormField label={t('step3.shelfLifeLabel')} hint={t('step3.shelfLifeHint')}>
              <input name="shelf_life" type="text" className={inputClasses} placeholder={t('step3.shelfLifePlaceholder')} />
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
                      <input type="radio" name="packaging_ready" value={value} className="w-4 h-4 accent-primary" />
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
              <textarea name="story" required rows={7} className={inputClasses} placeholder={t('step4.storyPlaceholder')} />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step4.glimpseTitle')}</SectionTitle>
              <p className="text-on-surface-variant font-sans text-sm mt-2 mb-6">{t('step4.glimpseSubtitle')}</p>
            </div>

            <FormField label={t('step4.productPhotos')}>
              <UploadArea id="product_photos" name="product_photos" text={t('step4.productPhotosUpload')} uploadNote={t('step4.uploadNote')} />
            </FormField>
            <FormField label={t('step4.productionProcess')}>
              <UploadArea id="production_photos" name="production_photos" text={t('step4.productionProcessUpload')} uploadNote={t('step4.uploadNote')} />
            </FormField>
            <FormField label={t('step4.environmentRegion')}>
              <UploadArea id="environment_photos" name="environment_photos" text={t('step4.environmentRegionUpload')} uploadNote={t('step4.uploadNote')} />
            </FormField>

            <div className="border-t border-outline-variant/15 pt-8">
              <SectionTitle>{t('step4.onlinePresenceTitle')}</SectionTitle>
              <p className="text-on-surface-variant font-sans text-sm mt-2 mb-1">{t('step4.onlinePresenceSubtitle')}</p>
            </div>

            <FormField label={t('step4.website')} hint={t('step4.websiteHint')}>
              <input name="website" type="url" className={inputClasses} placeholder={t('step4.websitePlaceholder')} />
            </FormField>
            <FormField label={t('step4.instagram')}>
              <input name="instagram" type="text" className={inputClasses} placeholder={t('step4.instagramPlaceholder')} />
            </FormField>
            <FormField label={t('step4.otherLinks')} hint={t('step4.otherLinksHint')}>
              <input name="other_links" type="text" className={inputClasses} placeholder={t('step4.otherLinksPlaceholder')} />
            </FormField>
          </motion.div>
        </div>

        {/* ── Step 5: Shipping & Confirmation ── */}
        <div className={step === 5 ? '' : 'hidden'}>
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <SectionTitle>{t('step5.sectionTitle')}</SectionTitle>

            <FormField label={t('step5.shippingCountries')}>
              <input name="shipping_countries" type="text" className={inputClasses} placeholder={t('step5.shippingCountriesPlaceholder')} />
            </FormField>

            <FormField label={t('step5.shippingSpeed')} required>
              <div className="space-y-3">
                {shippingTimes.map((time) => (
                  <label key={time} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="shipping_speed" value={time} required className="w-4 h-4 accent-primary" />
                    <span className="font-sans text-sm text-on-surface/80 group-hover:text-primary transition-colors">{time}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label={t('step5.shippingExperience')}>
              <div className="flex gap-6">
                {[t('step5.yes'), t('step5.no')].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="shipping_experience" value={opt} className="w-4 h-4 accent-primary" />
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
              <input type="checkbox" name="confirm_no_alcohol" value="on" required className="mt-1 w-4 h-4 accent-primary shrink-0" />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">{t('step5.confirmNoAlcohol')}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="confirm_local" value="on" required className="mt-1 w-4 h-4 accent-primary shrink-0" />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">{t('step5.confirmLocal')}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="confirm_quality" value="on" required className="mt-1 w-4 h-4 accent-primary shrink-0" />
              <span className="font-sans text-sm text-on-surface/80 leading-relaxed">
                {t.rich('step5.confirmQuality', {
                  link: (chunks) => (
                    <Link href="/terms" className="text-secondary underline underline-offset-2">{chunks}</Link>
                  ),
                })}
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
      </form>
    </div>
  )
}

// ── Shared sub-components ──

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

function UploadArea({ id, name, text, uploadNote }: { id: string; name: string; text: string; uploadNote: string }) {
  return (
    <label htmlFor={id} className="block border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center hover:border-secondary/40 transition-colors cursor-pointer">
      <input id={id} name={name} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" />
      <Upload size={24} strokeWidth={1.2} className="text-on-surface-variant/70 mx-auto mb-3" />
      <p className="font-sans text-sm text-on-surface-variant">{text}</p>
      <p className="font-sans text-xs text-on-surface-variant/75 mt-1">{uploadNote}</p>
    </label>
  )
}
