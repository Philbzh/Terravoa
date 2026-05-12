import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm'
import { upsertAdminAccess, removeAdminAccess } from './actions'
import { Shield, UserPlus, Users } from 'lucide-react'

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

const AREA_LABELS: { key: keyof AdminAccessRow; label: string }[] = [
  { key: 'can_supplier', label: 'Supplier' },
  { key: 'can_customer', label: 'Customer' },
  { key: 'can_marketing', label: 'Marketing' },
  { key: 'can_finance', label: 'Finance' },
  { key: 'can_operations', label: 'Operations' },
]

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
        title="User settings & access"
        description="Manage your account, add admin users, and assign role-based permissions."
        metrics={[{ label: 'delegated users', value: rows.length }]}
      />

      <div className="grid xl:grid-cols-3 gap-6 mb-8">
        {/* ── Your account ── */}
        <div className="xl:col-span-1 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <ChangePasswordForm />
        </div>

        {/* ── Add / update user ── */}
        <div className="xl:col-span-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4 text-on-surface-variant" />
            <h3 className="font-sans text-sm font-semibold text-on-surface">Add or update user</h3>
          </div>
          <form action={upsertAdminAccess} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="user-email" className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 block">
                  Email
                </label>
                <input
                  id="user-email"
                  name="email"
                  required
                  type="email"
                  placeholder="person@company.com"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label htmlFor="user-name" className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 block">
                  Full name
                </label>
                <input
                  id="user-name"
                  name="full_name"
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <p className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-2">
                Access areas
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <label className="inline-flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
                  <input name="is_active" type="checkbox" defaultChecked className="rounded border-outline-variant/30 text-primary focus:ring-primary/30" />
                  Active
                </label>
                {AREA_LABELS.map(({ key, label }) => (
                  <label key={key} className="inline-flex items-center gap-2 font-sans text-sm text-on-surface cursor-pointer">
                    <input name={key} type="checkbox" className="rounded border-outline-variant/30 text-primary focus:ring-primary/30" />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-5 py-2 rounded-full hover:opacity-90"
            >
              <Shield className="h-3.5 w-3.5" />
              Save access rights
            </button>
          </form>
        </div>
      </div>

      {/* ── Current users table ── */}
      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-outline-variant/10 bg-surface-container-low/30">
          <Users className="h-4 w-4 text-on-surface-variant" />
          <h2 className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-medium">
            Delegated users
          </h2>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="font-sans text-sm text-on-surface-variant">
              No delegated users yet. Root admins always have full access.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">User</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Status</th>
                  {AREA_LABELS.map(({ label }) => (
                    <th key={label} className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-center">
                      {label}
                    </th>
                  ))}
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {rows.map((r) => (
                  <tr key={r.email} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-on-surface font-medium">{r.full_name || r.email}</p>
                      {r.full_name && (
                        <p className="font-sans text-[11px] text-on-surface-variant">{r.email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        r.is_active
                          ? 'bg-primary-fixed/40 text-primary'
                          : 'bg-error-container/50 text-error'
                      }`}>
                        {r.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {AREA_LABELS.map(({ key }) => (
                      <td key={key} className="px-4 py-3 text-center">
                        {r[key] ? (
                          <span className="inline-block h-2 w-2 rounded-full bg-primary" title="Granted" />
                        ) : (
                          <span className="inline-block h-2 w-2 rounded-full bg-outline-variant/30" title="Not granted" />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <form action={removeAdminAccess} className="inline">
                        <input type="hidden" name="email" value={r.email} />
                        <button
                          type="submit"
                          className="font-sans text-[11px] uppercase tracking-wider border border-error/30 text-error px-3 py-1.5 rounded-full hover:bg-error/5 transition-colors"
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
