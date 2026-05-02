import Link from 'next/link'
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getProducerRatingDashboard, RATING_ALERT_RULES } from '@/lib/admin/producer-ratings'
import { routing } from '@/i18n/routing'

export default async function AdminProducerRatingsPage() {
  const { rows, alertCount } = await getProducerRatingDashboard()

  const critical = rows.filter((r) => r.status === 'critical')
  const warned = rows.filter((r) => r.status === 'warn')

  const r = RATING_ALERT_RULES

  return (
    <div>
      <AdminPageHeader
        title="Producer ratings"
        description="Aggregates approved product reviews by producer (mapped via product slug). Alerts use rolling 7- and 30-day windows — adjust thresholds in code if needed."
      />

      {/* Rules summary */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-5 mb-8 font-sans text-sm text-on-surface/85 leading-relaxed space-y-2">
        <p>
          <strong className="text-primary">Automatic flags</strong> (approved reviews only):{' '}
          <span className="text-error font-medium">Critical</span> — avg &lt; {r.criticalAvg7d} in last 7 days with
          ≥{r.minReviews7dCritical} reviews, or avg &lt; {r.criticalAvg30d} in last 30 days with ≥
          {r.minReviews30dCritical} reviews.{' '}
          <span className="text-amber-700 dark:text-amber-500 font-medium">Watch</span> — avg &lt; {r.warnAvg7d}{' '}
          (7d, ≥{r.minReviews7dWarn} reviews) or avg &lt; {r.warnAvg30d} (30d, ≥{r.minReviews30dWarn} reviews).
        </p>
        <p className="text-on-surface-variant text-xs">
          The sidebar badge shows how many producers are currently in Watch or Critical. This does not replace
          your contractual notices to producers.
        </p>
      </div>

      {/* Alerts first */}
      {(critical.length > 0 || warned.length > 0) && (
        <div className="mb-10 space-y-4">
          {critical.length > 0 && (
            <div className="rounded-xl border border-error/40 bg-error/5 p-4">
              <p className="font-sans text-xs uppercase tracking-wider text-error mb-2 flex items-center gap-2">
                <AlertTriangle size={14} strokeWidth={1.5} />
                Critical ({critical.length})
              </p>
              <ul className="space-y-1 font-sans text-sm text-on-surface">
                {critical.map((p) => (
                  <li key={p.producerId}>
                    <Link
                      href={`/${routing.defaultLocale}/producers/${p.slug}`}
                      className="text-secondary hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.name}
                    </Link>
                    {' · '}
                    <Link href={`/admin/producers/${p.producerId}`} className="text-xs text-secondary hover:underline">
                      Admin
                    </Link>
                    {' — '}
                    7d: {p.avg7d ?? '—'} ({p.count7d} reviews), 30d: {p.avg30d ?? '—'} ({p.count30d} reviews)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {warned.length > 0 && (
            <div className="rounded-xl border border-amber-500/35 bg-amber-500/5 p-4">
              <p className="font-sans text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                <AlertCircle size={14} strokeWidth={1.5} />
                Watch ({warned.length})
              </p>
              <ul className="space-y-1 font-sans text-sm text-on-surface">
                {warned.map((p) => (
                  <li key={p.producerId}>
                    <Link
                      href={`/${routing.defaultLocale}/producers/${p.slug}`}
                      className="text-secondary hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.name}
                    </Link>
                    {' · '}
                    <Link href={`/admin/producers/${p.producerId}`} className="text-xs text-secondary hover:underline">
                      Admin
                    </Link>
                    {' — '}
                    7d: {p.avg7d ?? '—'} ({p.count7d}), 30d: {p.avg30d ?? '—'} ({p.count30d})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {rows.length > 0 && alertCount === 0 && (
        <div className="flex items-center gap-2 text-primary font-sans text-sm mb-8">
          <CheckCircle2 size={18} strokeWidth={1.5} />
          No producers match the current warning thresholds.
        </div>
      )}

      {/* Full table */}
      <div className="rounded-xl border border-outline-variant/20 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                Status
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                Producer
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                7d avg
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                7d # 
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                30d avg
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                30d #
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                All-time
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                Total #
              </th>
              <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((row) => (
              <tr key={row.producerId} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-4 py-3">
                  {row.status === 'critical' && (
                    <span className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-wider text-error">
                      <AlertTriangle size={12} /> Critical
                    </span>
                  )}
                  {row.status === 'warn' && (
                    <span className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-500">
                      <AlertCircle size={12} /> Watch
                    </span>
                  )}
                  {row.status === 'ok' && (
                    <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/70">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${routing.defaultLocale}/producers/${row.slug}`}
                    className="font-sans text-sm text-primary hover:text-secondary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">
                  {row.avg7d ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-sans text-xs text-on-surface-variant tabular-nums">
                  {row.count7d}
                </td>
                <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">
                  {row.avg30d ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-sans text-xs text-on-surface-variant tabular-nums">
                  {row.count30d}
                </td>
                <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">
                  {row.avgAll ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-sans text-xs text-on-surface-variant tabular-nums">
                  {row.reviewCount}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/producers/${row.producerId}`}
                    className="font-sans text-xs text-secondary hover:underline whitespace-nowrap"
                  >
                    Notes / edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="font-sans text-sm text-on-surface-variant">No approved producers found.</p>
      )}
    </div>
  )
}
