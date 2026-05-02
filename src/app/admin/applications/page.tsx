import Link from 'next/link'
import { Eye } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { acceptApplication } from './actions'
import type { ProducerApplicationRow } from '@/lib/supabase/types'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RejectApplicationButton } from '@/components/admin/RejectApplicationButton'

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  es: 'Spanish',
  pt: 'Portuguese',
}

function languageName(code: string | null | undefined): string | null {
  if (!code || code === 'en') return null
  return LANGUAGE_NAMES[code.toLowerCase()] ?? code.toUpperCase()
}

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected'
const FILTER_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'pending',  label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

function parseFilter(v: string | string[] | undefined): StatusFilter {
  const s = Array.isArray(v) ? v[0] : v
  if (s === 'pending' || s === 'accepted' || s === 'rejected') return s
  return 'all'
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  // Next 16: searchParams is now async per the route handler contract.
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const activeFilter = parseFilter(params.status)

  const admin = createAdminClient()
  const { data: allRows, error } = await (admin as any)
    .from('producer_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Producer applications" />
        <p className="text-error font-sans text-sm" role="alert">
          {error.message}
        </p>
      </div>
    )
  }

  const all = (allRows ?? []) as (ProducerApplicationRow & {
    source_language?: string | null
    is_organic?: string | null
    certifications?: string[] | null
    production_scale?: string | null
    pricing_range?: string | null
    desired_plan?: 'founding' | 'growth' | 'premium' | null
  })[]

  // Tab counts drive badges on the filter pills — computed over `all` so the
  // numbers stay accurate regardless of the current filter.
  const counts: Record<StatusFilter, number> = {
    all: all.length,
    pending: all.filter((a) => a.status === 'pending').length,
    accepted: all.filter((a) => a.status === 'accepted').length,
    rejected: all.filter((a) => a.status === 'rejected').length,
  }

  const list = activeFilter === 'all' ? all : all.filter((a) => a.status === activeFilter)

  return (
    <div>
      <AdminPageHeader
        title="Producer applications"
        description="Review submissions and accept or reject. Accepted producers can be activated under Producers; applicants are notified by email."
      />

      {/* Preview link */}
      <div className="admin-toolbar mb-6">
        <Link
          href="/admin/applications/preview"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-secondary border border-secondary/25 px-4 py-2 rounded-full hover:bg-secondary/5 transition-colors"
        >
          <Eye size={12} strokeWidth={2} />
          Preview the application form
        </Link>
      </div>

      {/* Status filter tabs — `?status=rejected` etc. */}
      <nav
        className="mb-6 flex flex-wrap gap-2"
        aria-label="Filter applications by status"
      >
        {FILTER_TABS.map((tab) => {
          const isActive = tab.value === activeFilter
          const href =
            tab.value === 'all'
              ? '/admin/applications'
              : `/admin/applications?status=${tab.value}`
          return (
            <Link
              key={tab.value}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/25 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                  isActive
                    ? 'bg-on-primary/20 text-on-primary'
                    : 'bg-outline-variant/15 text-on-surface-variant'
                }`}
              >
                {counts[tab.value]}
              </span>
            </Link>
          )
        })}
      </nav>

      {list.length === 0 ? (
        <p className="text-on-surface-variant font-sans text-sm">
          {activeFilter === 'all'
            ? 'No applications yet.'
            : `No ${activeFilter} applications.`}
        </p>
      ) : (
        <div className="space-y-8">
          {list.map((app) => {
            const lang = languageName(app.source_language)
            return (
              <article
                key={app.id}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="font-serif text-xl text-primary hover:underline"
                    >
                      {app.full_name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {app.business_name && (
                        <p className="font-sans text-sm text-on-surface-variant">{app.business_name}</p>
                      )}
                      {lang && (
                        <span className="font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-tertiary-fixed/20 text-tertiary border border-tertiary/20">
                          {lang}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">
                      <a href={`mailto:${app.email}`} className="text-secondary hover:underline">
                        {app.email}
                      </a>
                      {app.phone && ` · ${app.phone}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-sans text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${
                        app.status === 'pending'
                          ? 'bg-tertiary-fixed/30 text-tertiary'
                          : app.status === 'accepted'
                            ? 'bg-primary-fixed/40 text-primary'
                            : 'bg-error-container/50 text-error'
                      }`}
                    >
                      {app.status}
                    </span>
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <form action={acceptApplication}>
                          <input type="hidden" name="id" value={app.id} />
                          <button
                            type="submit"
                            className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-4 py-2 rounded-full hover:opacity-90"
                          >
                            Accept
                          </button>
                        </form>
                        <RejectApplicationButton
                          id={app.id}
                          applicantName={app.full_name}
                          applicantEmail={app.email}
                          locale={app.source_language ?? 'en'}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-sans text-xs text-on-surface-variant mb-2">
                  {app.country} · {app.region}
                  {app.created_at &&
                    ` · ${new Date(app.created_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}`}
                </p>
                <Link href={`/admin/applications/${app.id}`} className="block group">
                  <p className="font-sans text-sm text-on-surface/80 line-clamp-3 mb-2 group-hover:text-on-surface transition-colors">
                    {app.product_description}
                  </p>
                </Link>
                <p className="font-sans text-xs text-on-surface-variant mb-2">
                  Categories: {app.product_categories?.join(', ') || '—'}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-sans text-xs text-on-surface-variant">Requested plan:</span>
                  <span className={`font-sans text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    app.desired_plan === 'premium'
                      ? 'bg-secondary/15 text-secondary border border-secondary/20'
                      : app.desired_plan === 'growth'
                        ? 'bg-primary/8 text-primary border border-primary/15'
                        : 'bg-surface-container text-on-surface-variant border border-outline-variant/20'
                  }`}>
                    {app.desired_plan ?? 'founding'}
                  </span>
                </div>
                {/* Quality signals */}
                <div className="flex flex-wrap gap-1.5">
                  {app.is_organic === 'yes_certified' && (
                    <span className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                      Certified Organic
                    </span>
                  )}
                  {(app.certifications ?? []).filter((c) => c !== 'none').map((c) => (
                    <span key={c} className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-secondary/8 text-secondary border border-secondary/15">
                      {c.toUpperCase().replace('_', '/')}
                    </span>
                  ))}
                  {app.production_scale === 'fully_artisanal' && (
                    <span className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                      Fully artisanal
                    </span>
                  )}
                  {app.pricing_range && (
                    <span className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
                      {app.pricing_range}
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
