import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { translateFieldsToEnglish } from '@/lib/translate'
import type { ProducerApplicationRow } from '@/lib/supabase/types'
import { acceptApplication } from '../actions'
import { RejectApplicationModal } from '@/components/admin/RejectApplicationModal'
import {
  rejectionReasonAdminLabels,
  type RejectionReasonCode,
} from '@/lib/email/i18n'
import { getProductLimit, isPlanId } from '@/lib/partnership-plans'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', de: 'German', fr: 'French',
  it: 'Italian', es: 'Spanish', pt: 'Portuguese',
}
function languageName(code: string | null): string {
  if (!code) return 'English'
  return LANGUAGE_NAMES[code.toLowerCase()] ?? code.toUpperCase()
}

const CERT_LABELS: Record<string, string> = {
  dop: 'DOP / PDO', igp: 'IGP / PGI', stg: 'STG / TSG',
  labelRouge: 'Label Rouge', euOrganic: 'EU Organic', abFrance: 'AB (France)',
  demeter: 'Demeter', fairTrade: 'Fair Trade', none: 'No designation', other: 'Other',
}
const SCALE_LABELS: Record<string, string> = {
  fully_artisanal: 'Fully artisanal',
  traditional:     'Traditional methods',
  small_business:  'Small family business',
  undisclosed:     'Undisclosed',
}
const ORGANIC_LABELS: Record<string, string> = {
  yes_certified: '✓ Certified organic',
  partially:     'Partially organic',
  no_natural:    'Natural / low-input (not certified)',
  none:          'No organic practices',
}

interface Props { params: Promise<{ id: string }> }

export default async function AdminApplicationDetailPage({ params }: Props) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: raw, error } = await (admin as any)
    .from('producer_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !raw) notFound()

  const app = raw as ProducerApplicationRow & {
    source_language?:    string | null
    is_organic?:         string | null
    organic_certifier?:  string | null
    certifications?:     string[] | null
    certification_body?: string | null
    production_scale?:   string | null
    annual_production?:  string | null
    shelf_life?:         string | null
    packaging_ready?:    string | null
    pricing_range?:      string | null
    no_alcohol_confirmed?: boolean | null
    desired_plan?: 'founding' | 'growth' | 'premium' | null
    rejection_reasons?:  string[] | null
    rejection_note?:     string | null
    producer_id?:        string | null
  }

  // When the application has been accepted and linked to a producer, pull a
  // compact product-status breakdown to show the reviewer what this producer
  // has actually listed since signup (bridges Applications → Products).
  type ProductStats = { pending: number; approved: number; rejected: number; total: number }
  let productStats: ProductStats | null = null
  if (app.status === 'accepted' && app.producer_id) {
    const [pendingRes, approvedRes, rejectedRes, totalRes] = await Promise.all([
      (admin as any).from('products').select('id', { count: 'exact', head: true })
        .eq('producer_id', app.producer_id).eq('status', 'pending'),
      (admin as any).from('products').select('id', { count: 'exact', head: true })
        .eq('producer_id', app.producer_id).eq('status', 'approved'),
      (admin as any).from('products').select('id', { count: 'exact', head: true })
        .eq('producer_id', app.producer_id).eq('status', 'rejected'),
      (admin as any).from('products').select('id', { count: 'exact', head: true })
        .eq('producer_id', app.producer_id),
    ])
    productStats = {
      pending:  pendingRes.count  ?? 0,
      approved: approvedRes.count ?? 0,
      rejected: rejectedRes.count ?? 0,
      total:    totalRes.count    ?? 0,
    }
  }

  const sourceLang   = app.source_language ?? 'en'
  const isNonEnglish = sourceLang !== 'en'
  const langLabel    = languageName(sourceLang)

  // Auto-translate narrative text fields via MyMemory
  const textFields: Record<string, string> = {}
  if (app.story)                  textFields.story = app.story
  if (app.product_description)    textFields.product_description = app.product_description
  if (app.product_differentiator) textFields.product_differentiator = app.product_differentiator

  const translated = isNonEnglish
    ? await translateFieldsToEnglish(textFields, sourceLang)
    : null

  const certs = (app.certifications ?? []).filter((c) => c !== 'none')
  const hasNoCerts = (app.certifications ?? []).includes('none') || (app.certifications ?? []).length === 0

  return (
    <div>
      <Link
        href="/admin/applications"
        className="inline-block font-sans text-xs text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        ← All applications
      </Link>

      <AdminPageHeader title={app.full_name} description={app.business_name ?? undefined} />

      {/* Language badge */}
      {isNonEnglish && (
        <div className="mb-6 flex items-center gap-3">
          <span className="font-sans text-xs px-3 py-1 rounded-full bg-tertiary-fixed/20 text-tertiary border border-tertiary/20">
            Submitted in {langLabel} — auto-translated below
          </span>
        </div>
      )}

      {/* Products summary — only shown once the applicant has been provisioned
          as a producer. Deep-links into the Products review queue filtered to
          this producer so admins can jump straight from "who" to "what". */}
      {productStats && app.producer_id && (
        <div className="mb-6 rounded-xl border border-outline-variant/25 bg-surface-container-low p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                Products submitted since signup
              </p>
              <p className="font-sans text-sm text-on-surface">
                <strong className="text-on-surface">{productStats.total}</strong> total ·{' '}
                <span className="text-tertiary">{productStats.pending} pending</span> ·{' '}
                <span className="text-primary">{productStats.approved} approved</span>
                {productStats.rejected > 0 && (
                  <> · <span className="text-error">{productStats.rejected} rejected</span></>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/products?producer_id=${app.producer_id}`}
                className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-secondary border border-secondary/30 px-3 py-1.5 rounded-full hover:bg-secondary/5 transition-colors"
              >
                Review products →
              </Link>
              <Link
                href={`/admin/producers/${app.producer_id}`}
                className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-on-surface-variant border border-outline-variant/30 px-3 py-1.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
              >
                Open producer
              </Link>
            </div>
          </div>
        </div>
      )}

      {app.status === 'rejected' && (app.rejection_reasons?.length || app.rejection_note) && (
        <div className="mb-6 rounded-xl border border-error/25 bg-error-container/20 p-5">
          <p className="font-sans text-xs uppercase tracking-wider text-error mb-2">
            Rejection recorded
          </p>
          {app.rejection_reasons && app.rejection_reasons.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 font-sans text-sm text-on-surface/90 mb-3">
              {(app.rejection_reasons as RejectionReasonCode[]).map((code) => (
                <li key={code}>
                  {rejectionReasonAdminLabels[code] ?? code}
                </li>
              ))}
            </ul>
          )}
          {app.rejection_note && (
            <div className="mt-2 pt-3 border-t border-error/15">
              <p className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1">
                Admin note (included in email)
              </p>
              <p className="font-sans text-sm text-on-surface/80 whitespace-pre-wrap">
                {app.rejection_note}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          {/* ── Status & meta ── */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`font-sans text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${
                app.status === 'pending'  ? 'bg-tertiary-fixed/30 text-tertiary' :
                app.status === 'accepted' ? 'bg-primary-fixed/40 text-primary'   :
                                            'bg-error-container/50 text-error'
              }`}>
                {app.status}
              </span>
              {app.no_alcohol_confirmed && (
                <span className="font-sans text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                  No-alcohol confirmed
                </span>
              )}
              {app.created_at && (
                <span className="font-sans text-xs text-on-surface-variant">
                  Received {new Date(app.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              {app.reviewed_at && (
                <span className="font-sans text-xs text-on-surface-variant">
                  · Reviewed {new Date(app.reviewed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-sans text-sm">
              <div>
                <dt className="text-xs text-on-surface-variant">Email</dt>
                <dd><a href={`mailto:${app.email}`} className="text-secondary hover:underline">{app.email}</a></dd>
              </div>
              {app.phone && (
                <div>
                  <dt className="text-xs text-on-surface-variant">Phone</dt>
                  <dd className="text-on-surface">{app.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-on-surface-variant">Location</dt>
                <dd className="text-on-surface">{app.region}, {app.country}</dd>
              </div>
              {app.production_location && (
                <div>
                  <dt className="text-xs text-on-surface-variant">Production site</dt>
                  <dd className="text-on-surface">{app.production_location}</dd>
                </div>
              )}
              {app.pricing_range && (
                <div>
                  <dt className="text-xs text-on-surface-variant">Price range</dt>
                  <dd className="text-on-surface font-medium">{app.pricing_range}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-on-surface-variant">Requested plan</dt>
                <dd className="text-on-surface font-medium capitalize">
                  {app.desired_plan ?? 'founding'}
                  {(() => {
                    const plan = isPlanId(app.desired_plan) ? app.desired_plan : 'founding'
                    const cap = getProductLimit(plan)
                    return (
                      <span className="ml-2 font-normal text-xs text-on-surface-variant normal-case">
                        · {cap === null ? 'unlimited products' : `up to ${cap} products`}
                      </span>
                    )
                  })()}
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Categories ── */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <h2 className="font-serif text-base text-primary mb-3">Product categories</h2>
            <div className="flex flex-wrap gap-2">
              {(app.product_categories ?? []).map((cat) => (
                <span key={cat} className="font-sans text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 capitalize">
                  {cat.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                </span>
              ))}
              {!app.product_categories?.length && <span className="font-sans text-sm text-on-surface-variant">—</span>}
            </div>
          </div>

          {/* ── Quality & Certifications ── */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <h2 className="font-serif text-base text-primary mb-4">Quality & Craft</h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 font-sans text-sm mb-5">
          {app.is_organic && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-on-surface-variant mb-1">Organic status</dt>
              <dd className={`font-medium ${app.is_organic === 'yes_certified' ? 'text-green-700' : 'text-on-surface'}`}>
                {ORGANIC_LABELS[app.is_organic] ?? app.is_organic}
                {app.organic_certifier && <span className="font-normal text-on-surface-variant ml-2">({app.organic_certifier})</span>}
              </dd>
            </div>
          )}
          {app.production_scale && (
            <div>
              <dt className="text-xs text-on-surface-variant mb-1">Production scale</dt>
              <dd className="text-on-surface">{SCALE_LABELS[app.production_scale] ?? app.production_scale}</dd>
            </div>
          )}
          {app.annual_production && (
            <div>
              <dt className="text-xs text-on-surface-variant mb-1">Annual volume</dt>
              <dd className="text-on-surface">{app.annual_production}</dd>
            </div>
          )}
          {app.shelf_life && (
            <div>
              <dt className="text-xs text-on-surface-variant mb-1">Shelf life</dt>
              <dd className="text-on-surface">{app.shelf_life}</dd>
            </div>
          )}
          {app.packaging_ready && (
            <div>
              <dt className="text-xs text-on-surface-variant mb-1">Packaging ready</dt>
              <dd className="text-on-surface capitalize">{app.packaging_ready}</dd>
            </div>
          )}
        </dl>

        {/* Certifications */}
        <div>
          <p className="text-xs text-on-surface-variant mb-2">Official designations</p>
          {hasNoCerts && certs.length === 0 ? (
            <p className="font-sans text-sm text-on-surface-variant">No official designations declared</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {certs.map((c) => (
                <span key={c} className="font-sans text-xs px-3 py-1.5 rounded-full bg-secondary/8 text-secondary border border-secondary/20 font-medium">
                  {CERT_LABELS[c] ?? c}
                </span>
              ))}
              {hasNoCerts && (
                <span className="font-sans text-xs px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
                  No designation
                </span>
              )}
            </div>
          )}
          {app.certification_body && (
            <p className="font-sans text-xs text-on-surface-variant mt-2">
              Issuing authority: <span className="text-on-surface">{app.certification_body}</span>
            </p>
          )}
        </div>
          </div>

          {/* ── Narrative fields with auto-translation ── */}
          <div className="space-y-6">
            <TextField label="Product description"     original={app.product_description}    translated={translated?.product_description}    isNonEnglish={isNonEnglish} langLabel={langLabel} />
            <TextField label="What makes it unique"    original={app.product_differentiator}  translated={translated?.product_differentiator} isNonEnglish={isNonEnglish} langLabel={langLabel} />
            <TextField label="Producer story"          original={app.story}                   translated={translated?.story}                  isNonEnglish={isNonEnglish} langLabel={langLabel} />
          </div>

          {/* ── Shipping ── */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <h2 className="font-serif text-base text-primary mb-3">Shipping</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm">
              <div>
                <dt className="text-xs text-on-surface-variant">Shipping speed</dt>
                <dd className="text-on-surface">{app.shipping_speed || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">International experience</dt>
                <dd className="text-on-surface">
                  {app.shipping_experience === true ? 'Yes' : app.shipping_experience === false ? 'No' : '—'}
                </dd>
              </div>
              {app.shipping_countries && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-on-surface-variant">Ships to</dt>
                  <dd className="text-on-surface">{app.shipping_countries}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* ── Photos ── */}
          {(app.product_image_urls?.length > 0 || app.production_image_urls?.length > 0 || app.environment_image_urls?.length > 0) && (
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
              <h2 className="font-serif text-base text-primary mb-4">Photos</h2>
              <ImageGroup label="Products"    urls={app.product_image_urls} />
              <ImageGroup label="Production"  urls={app.production_image_urls} />
              <ImageGroup label="Environment" urls={app.environment_image_urls} />
            </div>
          )}
        </div>

        <aside className="xl:col-span-4 xl:sticky xl:top-24 space-y-4">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-base font-medium text-on-surface mb-3">Quick actions</h2>
            {app.status === 'pending' ? (
              <div className="space-y-2">
                <form action={acceptApplication}>
                  <input type="hidden" name="id" value={app.id} />
                  <button type="submit" className="w-full font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                    Accept application
                  </button>
                </form>
                <RejectApplicationModal
                  applicationId={app.id}
                  applicantName={app.full_name}
                  applicantEmail={app.email}
                  locale={sourceLang}
                  variant="primary"
                />
              </div>
            ) : (
              <p className="font-sans text-sm text-on-surface-variant">
                Application already reviewed.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-base font-medium text-on-surface mb-3">Contact & links</h2>
            <div className="space-y-2 font-sans text-sm">
              <p>
                <span className="text-on-surface-variant">Email:</span>{' '}
                <a href={`mailto:${app.email}`} className="text-secondary hover:underline break-all">{app.email}</a>
              </p>
              {app.phone && <p><span className="text-on-surface-variant">Phone:</span> {app.phone}</p>}
              {app.website && (
                <p>
                  <span className="text-on-surface-variant">Website:</span>{' '}
                  <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                    Open
                  </a>
                </p>
              )}
              {app.instagram && <p><span className="text-on-surface-variant">Instagram:</span> {app.instagram}</p>}
              {app.other_links && <p className="break-all"><span className="text-on-surface-variant">Other:</span> {app.other_links}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TextField({ label, original, translated, isNonEnglish, langLabel }: {
  label: string
  original: string | null | undefined
  translated: string | null | undefined
  isNonEnglish: boolean
  langLabel: string
}) {
  if (!original) return null
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-base text-primary mb-3">{label}</h2>
      {isNonEnglish && translated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Original ({langLabel})</p>
            <p className="font-sans text-sm text-on-surface/80 leading-relaxed whitespace-pre-wrap">{original}</p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">English (auto-translated)</p>
            <p className="font-sans text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{translated}</p>
          </div>
        </div>
      ) : (
        <p className="font-sans text-sm text-on-surface/80 leading-relaxed whitespace-pre-wrap">{original}</p>
      )}
    </div>
  )
}

function ImageGroup({ label, urls }: { label: string; urls: string[] | null }) {
  if (!urls || urls.length === 0) return null
  return (
    <div className="mb-4 last:mb-0">
      <p className="font-sans text-xs text-on-surface-variant mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${label} ${i + 1}`} className="h-24 w-24 object-cover rounded-lg border border-outline-variant/20 hover:opacity-90 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  )
}
