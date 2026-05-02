import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { upsertAdminAccess, removeAdminAccess } from './actions'

type AdminAccessRow = {
  email: string
  full_name: string | null
  is_active: boolean
  can_supplier: boolean
  can_customer: boolean
  can_marketing: boolean
  can_finance: boolean
  can_operations: boolean
}

export default async function AdminUserSettingsPage() {
  const admin = createAdminClient() as any
  const { data } = await admin
    .from('admin_user_access')
    .select('email, full_name, is_active, can_supplier, can_customer, can_marketing, can_finance, can_operations')
    .order('email', { ascending: true })

  const rows = (data ?? []) as AdminAccessRow[]

  return (
    <div>
      <AdminPageHeader
        title="User settings & access rights"
        description="Grant dashboard access by function: supplier, customer, marketing, finance, and operations."
      />

      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 mb-6 max-w-4xl">
        <h2 className="font-serif text-xl text-primary mb-4">Add or update user</h2>
        <form action={upsertAdminAccess} className="grid gap-3 md:grid-cols-2">
          <input
            name="email"
            required
            type="email"
            placeholder="person@company.com"
            className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm"
          />
          <input
            name="full_name"
            placeholder="Full name"
            className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm"
          />
          <label className="font-sans text-sm text-on-surface"><input name="is_active" type="checkbox" defaultChecked className="mr-2" />Active</label>
          <label className="font-sans text-sm text-on-surface"><input name="can_supplier" type="checkbox" className="mr-2" />Supplier area</label>
          <label className="font-sans text-sm text-on-surface"><input name="can_customer" type="checkbox" className="mr-2" />Customer area</label>
          <label className="font-sans text-sm text-on-surface"><input name="can_marketing" type="checkbox" className="mr-2" />Marketing area</label>
          <label className="font-sans text-sm text-on-surface"><input name="can_finance" type="checkbox" className="mr-2" />Finance area</label>
          <label className="font-sans text-sm text-on-surface"><input name="can_operations" type="checkbox" className="mr-2" />Operations area</label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-5 py-2 rounded-full hover:opacity-90"
            >
              Save access rights
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 max-w-5xl">
        <h2 className="font-serif text-xl text-primary mb-4">Current users</h2>
        {rows.length === 0 ? (
          <p className="font-sans text-sm text-on-surface-variant">No delegated users yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.email} className="rounded-lg border border-outline-variant/20 bg-surface px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-sans text-sm text-on-surface font-medium">{r.full_name || r.email}</p>
                    <p className="font-sans text-xs text-on-surface-variant">{r.email}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                      {[
                        r.can_supplier ? 'Supplier' : null,
                        r.can_customer ? 'Customer' : null,
                        r.can_marketing ? 'Marketing' : null,
                        r.can_finance ? 'Finance' : null,
                        r.can_operations ? 'Operations' : null,
                      ].filter(Boolean).join(' · ') || 'No areas assigned'}
                      {!r.is_active ? ' · Inactive' : ''}
                    </p>
                  </div>
                  <form action={removeAdminAccess}>
                    <input type="hidden" name="email" value={r.email} />
                    <button
                      type="submit"
                      className="font-sans text-xs uppercase tracking-wider border border-error/30 text-error px-4 py-2 rounded-full hover:bg-error/5"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
