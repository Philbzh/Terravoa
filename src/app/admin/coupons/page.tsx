import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { createCoupon, toggleCoupon, deleteCoupon } from './actions'
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'

async function createCouponAction(formData: FormData): Promise<void> {
  'use server'
  await createCoupon(formData)
}

type CouponRow = {
  id: string
  code: string
  discount_pct: number
  expires_at: string | null
  max_uses: number | null
  use_count: number
  is_active: boolean
  description: string | null
  created_at: string
}

async function getCoupons(): Promise<CouponRow[]> {
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('coupons')
    .select('id, code, discount_pct, expires_at, max_uses, use_count, is_active, description, created_at')
    .order('created_at', { ascending: false })
  return (data ?? []) as CouponRow[]
}

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isExpired(c: CouponRow) {
  return c.expires_at !== null && new Date(c.expires_at) < new Date()
}

function isExhausted(c: CouponRow) {
  return c.max_uses !== null && c.use_count >= c.max_uses
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()
  const active   = coupons.filter((c) => c.is_active && !isExpired(c) && !isExhausted(c))
  const inactive = coupons.filter((c) => !c.is_active || isExpired(c) || isExhausted(c))

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Create percentage-off discount codes. Customers enter them at checkout."
      />

      {/* Create form */}
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 mb-8 max-w-2xl">
        <h2 className="font-serif text-lg text-primary mb-5 flex items-center gap-2">
          <Plus size={16} />
          New coupon
        </h2>
        <form action={createCouponAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
              Code *
            </label>
            <input
              name="code"
              type="text"
              required
              placeholder="WELCOME20"
              maxLength={30}
              className="w-full font-mono text-sm rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 text-on-surface uppercase placeholder:normal-case placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
              Discount % *
            </label>
            <input
              name="discount_pct"
              type="number"
              required
              min={1}
              max={100}
              placeholder="10"
              className="w-full font-sans text-sm rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
              Expires on
            </label>
            <input
              name="expires_at"
              type="date"
              className="w-full font-sans text-sm rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
              Max uses
            </label>
            <input
              name="max_uses"
              type="number"
              min={1}
              placeholder="Unlimited"
              className="w-full font-sans text-sm rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
              Description (internal note)
            </label>
            <input
              name="description"
              type="text"
              placeholder="e.g. Welcome discount for newsletter subscribers"
              maxLength={200}
              className="w-full font-sans text-sm rounded-lg border border-outline-variant/25 bg-surface px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <Plus size={13} />
              Create coupon
            </button>
          </div>
        </form>
      </div>

      {/* Active coupons */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-xl text-primary mb-4">
            Active <span className="font-sans text-sm text-secondary ml-1">({active.length})</span>
          </h2>
          <CouponTable coupons={active} />
        </section>
      )}

      {/* Inactive / expired */}
      {inactive.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-primary mb-4">
            Inactive / Expired <span className="font-sans text-sm text-on-surface-variant ml-1">({inactive.length})</span>
          </h2>
          <CouponTable coupons={inactive} dimmed />
        </section>
      )}

      {coupons.length === 0 && (
        <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-14 text-center max-w-md">
          <Tag size={32} strokeWidth={1} className="mx-auto mb-4 text-on-surface-variant/30" />
          <p className="font-sans text-sm text-on-surface-variant">No coupons yet. Create your first above.</p>
        </div>
      )}
    </div>
  )
}

function CouponTable({ coupons, dimmed }: { coupons: CouponRow[]; dimmed?: boolean }) {
  return (
    <div className={`rounded-xl border border-outline-variant/20 overflow-hidden ${dimmed ? 'opacity-70' : ''}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface-container-low/50">
            {['Code', 'Discount', 'Used', 'Expires', 'Description', ''].map((h) => (
              <th key={h} className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 first:pl-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {coupons.map((c) => (
            <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-5 py-3">
                <span className="font-mono text-sm text-on-surface font-medium">{c.code}</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-sans text-sm text-secondary font-semibold">{c.discount_pct}%</span>
              </td>
              <td className="px-4 py-3 font-sans text-sm text-on-surface-variant">
                {c.use_count}{c.max_uses !== null ? ` / ${c.max_uses}` : ''}
              </td>
              <td className="px-4 py-3 font-sans text-xs text-on-surface-variant">
                {isExpired(c)
                  ? <span className="text-error">Expired {fmt(c.expires_at)}</span>
                  : fmt(c.expires_at)}
              </td>
              <td className="px-4 py-3 font-sans text-xs text-on-surface-variant max-w-xs truncate">
                {c.description ?? '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <form action={toggleCoupon.bind(null, c.id, !c.is_active)}>
                    <button
                      type="submit"
                      title={c.is_active ? 'Deactivate' : 'Activate'}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {c.is_active
                        ? <ToggleRight size={18} className="text-secondary" />
                        : <ToggleLeft size={18} />}
                    </button>
                  </form>
                  <form action={deleteCoupon.bind(null, c.id)}>
                    <button
                      type="submit"
                      title="Delete"
                      className="text-on-surface-variant/40 hover:text-error transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
