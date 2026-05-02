import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

type SubscriberRow = {
  id: string
  email: string
  created_at: string
}

// MED-6: bounded scan. Export UI for larger lists should go through a CSV
// export endpoint instead of rendering every row in one table.
const SUBSCRIBERS_PAGE_LIMIT = 5_000

export default async function AdminSubscribersPage() {
  const admin = createAdminClient()

  const { data, error } = await (admin as any)
    .from('newsletter_subscribers')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(SUBSCRIBERS_PAGE_LIMIT)

  const list = (data ?? []) as SubscriberRow[]

  function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      <AdminPageHeader
        title="Newsletter subscribers"
        description="Everyone who has opted in to the Terravoa newsletter from the site footer."
      />
      <p className="font-sans text-sm text-on-surface-variant mb-8">
        <span className="font-serif text-primary text-xl">{list.length}</span>{' '}
        subscriber{list.length !== 1 ? 's' : ''}
      </p>

      {error && (
        <p className="text-error font-sans text-sm mb-4">{error.message}</p>
      )}

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No subscribers yet. They will appear here once visitors sign up.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Email
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">
                  Date subscribed
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-on-surface">{s.email}</p>
                    <p className="font-sans text-xs text-on-surface-variant sm:hidden">{fmt(s.created_at)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant">{fmt(s.created_at)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-fixed/40 text-primary">
                      Subscribed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="font-sans text-xs text-on-surface-variant/60 mt-6">
        To export, query the <span className="font-mono">newsletter_subscribers</span> table directly in your Supabase dashboard.
      </p>
    </div>
  )
}
