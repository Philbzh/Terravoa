import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { updateProducerDetails, addProducerAdminNote } from '../actions'
import { PLAN_CONFIG } from '@/lib/partnership-plans'

export default async function AdminProducerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('producers')
    .select('id, name, slug, region, country, specialty, tagline, status, plan, featured_placement, commission_rate_pct')
    .eq('id', id)
    .maybeSingle()
  const { data: notesData } = await (admin as any)
    .from('producer_admin_notes')
    .select('id, note, actor_email, created_at')
    .eq('producer_id', id)
    .order('created_at', { ascending: false })
  const { count: productCount } = await (admin as any)
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('producer_id', id)
  const { data: planRequests } = await (admin as any)
    .from('producer_plan_requests')
    .select('id, request_type, requested_plan, status, created_at')
    .eq('producer_id', id)
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch the original application (if any) so we can back-link to it.
  // Completes the Applications ↔ Producer ↔ Products triangle — admins can
  // re-read the original story, categories, and (when rejected at any step)
  // the recorded rejection metadata.
  const { data: linkedApplication } = await (admin as any)
    .from('producer_applications')
    .select('id, status, created_at')
    .eq('producer_id', id)
    .maybeSingle()

  if (!data) notFound()

  async function saveProducer(formData: FormData) {
    'use server'
    await updateProducerDetails(formData)
  }
  async function saveNote(formData: FormData) {
    'use server'
    await addProducerAdminNote(formData)
  }

  const planDefault = data.plan
    ? PLAN_CONFIG[data.plan as keyof typeof PLAN_CONFIG]
    : PLAN_CONFIG.founding

  return (
    <div>
      <Link
        href="/admin/producers"
        className="inline-block font-sans text-xs text-on-surface-variant hover:text-primary mb-4 transition-colors"
      >
        ← Back to producers
      </Link>
      <AdminPageHeader
        title={`Edit producer · ${data.name}`}
        description="Manage producer data, plan tier, featured placement, and commission rate."
      />

      {/* Origin trail — a compact cross-link back to the source application.
          Only rendered when the producer was created via the Applications
          flow (legacy producers seeded via SQL won't have a linked row). */}
      {linkedApplication && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
          <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">
            Origin
          </span>
          <Link
            href={`/admin/applications/${linkedApplication.id}`}
            className="font-sans text-sm text-secondary hover:underline"
          >
            Application · {new Date(linkedApplication.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Link>
          <span className={`font-sans text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            linkedApplication.status === 'pending'
              ? 'bg-tertiary-fixed/30 text-tertiary'
              : linkedApplication.status === 'accepted'
                ? 'bg-primary-fixed/40 text-primary'
                : 'bg-error-container/50 text-error'
          }`}>
            {linkedApplication.status}
          </span>
          <Link
            href={`/admin/products?producer_id=${data.id}`}
            className="ml-auto font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            Review products →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <form action={saveProducer} className="xl:col-span-8 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-5">
          <input type="hidden" name="id" value={data.id} />

          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" defaultValue={data.name} required />
            <Field label="Slug" name="slug" defaultValue={data.slug} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Region" name="region" defaultValue={data.region} />
            <Field label="Country" name="country" defaultValue={data.country} />
          </div>
          <Field label="Specialty" name="specialty" defaultValue={data.specialty} />
          <Field label="Tagline" name="tagline" defaultValue={data.tagline} />

          <hr className="border-outline-variant/20" />

          {/* Status + Plan */}
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="font-sans text-xs text-on-surface-variant">Status</span>
              <select
                name="status"
                defaultValue={data.status}
                className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>

            <label className="block">
              <span className="font-sans text-xs text-on-surface-variant">Plan tier</span>
              <select
                name="plan"
                defaultValue={data.plan ?? 'founding'}
                className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
              >
                <option value="founding">Founding — €0/mo · 15% commission · max 10 products</option>
                <option value="growth">Growth — €39/mo · 12% commission · unlimited products</option>
                <option value="premium">Premium — €89/mo · 8% commission · unlimited products</option>
              </select>
            </label>
          </div>

          {/* Commission rate override */}
          <div>
            <label className="block">
              <span className="font-sans text-xs text-on-surface-variant">
                Commission rate override (%)
              </span>
              <p className="font-sans text-[10px] text-on-surface-variant/60 mb-1">
                Leave blank to use the plan default ({planDefault.commissionPct}%). Enter a custom % to override for this producer.
              </p>
              <input
                type="number"
                name="commission_rate_pct"
                defaultValue={data.commission_rate_pct ?? ''}
                min="0"
                max="50"
                step="0.5"
                placeholder={`${planDefault.commissionPct} (plan default)`}
                className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
              />
            </label>
          </div>

          {/* Featured placement */}
          <div className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-3">
            <input
              type="checkbox"
              id="featured_placement"
              name="featured_placement"
              defaultChecked={data.featured_placement === true}
              className="mt-0.5 accent-secondary"
            />
            <label htmlFor="featured_placement" className="block cursor-pointer">
              <span className="font-sans text-sm font-medium text-on-surface">Featured Placement add-on</span>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                Producer and their products appear at the top of listings. Charge €25–€100/month separately.
              </p>
              {productCount !== null && (
                <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1">
                  {productCount} product{productCount !== 1 ? 's' : ''} listed
                </p>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
        </form>

        <div className="xl:col-span-4 xl:sticky xl:top-24 space-y-6">
          {/* Plan/add-on requests snapshot */}
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-base font-medium text-on-surface">Plan & add-on requests</h2>
            <p className="font-sans text-xs text-on-surface-variant">
              Latest producer-initiated upgrades and add-on requests.
            </p>
          </div>
          <Link
            href="/admin/plan-requests"
            className="font-sans text-xs text-secondary hover:underline"
          >
            Open request queue
          </Link>
        </div>
        {(planRequests ?? []).length === 0 ? (
          <p className="font-sans text-xs text-on-surface-variant">No requests yet.</p>
        ) : (
          <div className="space-y-2">
            {(planRequests as Array<{
              id: string
              request_type: string
              requested_plan: string | null
              status: 'pending' | 'approved' | 'rejected'
              created_at: string
            }>).map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-outline-variant/20 bg-surface px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-sans text-sm text-on-surface">
                    {labelForPlanRequest(r.request_type, r.requested_plan)}
                  </p>
                  <span
                    className={`font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      r.status === 'pending'
                        ? 'bg-tertiary-fixed/30 text-tertiary'
                        : r.status === 'approved'
                          ? 'bg-primary-fixed/40 text-primary'
                          : 'bg-error-container/50 text-error'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                  {new Date(r.created_at).toLocaleString('en-GB')}
                </p>
              </div>
            ))}
          </div>
        )}
          </section>

          {/* Admin notes */}
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-4">
            <h2 className="font-sans text-base font-medium text-on-surface">Internal admin notes</h2>
            <p className="font-sans text-xs text-on-surface-variant">
              Private comments for producer follow-up. Not visible to producers or customers.
            </p>
            <form action={saveNote} className="space-y-3">
              <input type="hidden" name="producer_id" value={data.id} />
              <textarea
                name="note"
                required
                rows={4}
                placeholder="Write your internal comment..."
                className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
              />
              <button
                type="submit"
                className="font-sans text-xs uppercase tracking-wider bg-secondary text-on-secondary px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Add note
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {(notesData ?? []).length === 0 ? (
                <p className="font-sans text-xs text-on-surface-variant">No notes yet.</p>
              ) : (
                (notesData as Array<{ id: number; note: string; actor_email: string; created_at: string }>).map((n) => (
                  <article key={n.id} className="rounded-lg border border-outline-variant/20 bg-surface p-3">
                    <p className="font-sans text-sm text-on-surface whitespace-pre-wrap">{n.note}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-2">
                      {n.actor_email} · {new Date(n.created_at).toLocaleString('en-GB')}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function labelForPlanRequest(type: string, requestedPlan: string | null): string {
  if (type === 'plan_upgrade') return `Plan upgrade to ${requestedPlan ?? '—'}`
  if (type === 'addon_featured_placement') return 'Featured Placement add-on'
  if (type === 'addon_homepage_feature') return 'Homepage Feature add-on'
  return type
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="font-sans text-xs text-on-surface-variant">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
      />
    </label>
  )
}
