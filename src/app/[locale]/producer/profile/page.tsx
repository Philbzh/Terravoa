import { Link } from '@/i18n/navigation'
import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { Star } from 'lucide-react'
import { BankDetailsForm } from './BankDetailsForm'
import { LanguageForm } from './LanguageForm'
import { ProducerProfileEditForm } from './ProducerProfileEditForm'

export default async function ProducerProfilePage() {
  const session = await getProducerForSession()
  const t = await getTranslations('producerPortal.profile')

  if (!session) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low/80 p-6 max-w-xl">
          <p className="font-sans text-sm text-on-surface mb-3">
            {t('signedOutMessage')}
          </p>
          <Link
            href="/login/producer"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4"
          >
            {t('signedOutLink')}
          </Link>
        </div>
      </div>
    )
  }

  if (!session.producer) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-6 max-w-xl">
          <p className="font-sans text-sm text-on-surface">
            {t('noProfileMessage')}
          </p>
        </div>
      </div>
    )
  }

  const p = session.producer

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm max-w-xl mb-4">
        {t('subtitle')}
      </p>

      {p.featured_placement && (
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 border border-secondary/25 px-4 py-2 mb-6">
          <Star size={13} strokeWidth={1.8} className="text-secondary" />
          <span className="font-sans text-xs uppercase tracking-wider text-secondary">
            Featured Placement Active
          </span>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <h2 className="font-serif text-lg text-primary mb-1">{t('editTitle')}</h2>
          <ProducerProfileEditForm
            specialty={p.specialty}
            tagline={p.tagline}
            storyHeadline={p.story_headline}
            story={p.story}
            quote={p.quote}
          />
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <h2 className="font-serif text-lg text-primary mb-4">{t('previewTitle')}</h2>
          <dl className="space-y-4 font-sans text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldNameSlug')}
              </dt>
              <dd className="text-on-surface">
                {p.name}{' '}
                <span className="text-on-surface-variant">/producers/{p.slug}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldRegion')}
              </dt>
              <dd className="text-on-surface">
                {p.region}, {p.country}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldSpecialty')}
              </dt>
              <dd className="text-on-surface">{p.specialty}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldTagline')}
              </dt>
              <dd className="text-on-surface italic">{p.tagline}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldStoryHeadline')}
              </dt>
              <dd className="text-on-surface">{p.story_headline}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                {t('fieldStory')}
              </dt>
              <dd className="text-on-surface whitespace-pre-wrap leading-relaxed">{p.story}</dd>
            </div>
            {p.quote && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                  {t('fieldQuote')}
                </dt>
                <dd className="text-on-surface italic border-l-2 border-secondary/40 pl-4">
                  {p.quote}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {(p.image_src || p.hero_image_src) && (
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <h3 className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-4">
              {t('imagesTitle')}
            </h3>
            <div className="flex flex-wrap gap-4">
              {p.image_src && (
                <figure>
                  <img
                    src={p.image_src}
                    alt={p.image_alt || p.name}
                    className="w-32 h-32 object-cover rounded-lg border border-outline-variant/15"
                  />
                  <figcaption className="font-sans text-[10px] text-on-surface-variant mt-2">
                    {t('imageProfile')}
                  </figcaption>
                </figure>
              )}
              {p.hero_image_src && (
                <figure>
                  <img
                    src={p.hero_image_src}
                    alt={p.hero_image_alt || ''}
                    className="w-48 h-32 object-cover rounded-lg border border-outline-variant/15"
                  />
                  <figcaption className="font-sans text-[10px] text-on-surface-variant mt-2">
                    {t('imageHero')}
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        )}

        {/* Bank details for SEPA payout */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <h2 className="font-serif text-lg text-primary mb-1">Bank details</h2>
          <p className="font-sans text-xs text-on-surface-variant mb-5 leading-relaxed">
            Required for SEPA payout after each shipment. Your details are stored securely
            and only used for transferring your earnings (minus commission).
          </p>
          <BankDetailsForm
            initialIban={(p as any).bank_iban ?? null}
            initialBic={(p as any).bank_bic ?? null}
            initialAccountName={(p as any).bank_account_name ?? null}
          />
        </div>

        {/* Language preference */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <h2 className="font-serif text-lg text-primary mb-1">Communication language</h2>
          <LanguageForm initialLanguage={(p as any).preferred_language ?? null} />
        </div>

        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-6">
          <p className="font-sans text-sm text-on-surface-variant">
            {t('editNoteImages')}{' '}
            <Link href="/contact" className="text-secondary underline underline-offset-2">
              {t('editNoteLink')}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
