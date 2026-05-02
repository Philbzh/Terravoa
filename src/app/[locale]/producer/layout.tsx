import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getProducerForSession } from '@/lib/producer/server'
import { ProducerSidebar } from '@/components/producer/ProducerSidebar'

export const metadata: Metadata = {
  title: 'Producer portal',
  robots: { index: false, follow: false },
}

export default async function ProducerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ── Auth gate ──────────────────────────────────────────────────────────────
  // Single source of truth for the entire /producer/* namespace. Individual
  // pages must not rely on this alone (defence in depth), but this layout
  // guarantees nothing below is rendered for unauthenticated or non-approved
  // producers.
  //
  // MED-8: `producer` is only populated when the account is `approved`;
  // pending/suspended accounts are redirected with a status hint so the login
  // page can display the right message instead of dumping them into an empty
  // dashboard.
  const session = await getProducerForSession()
  if (!session) redirect('/login/producer')
  if (session.accountState !== 'approved') {
    redirect(`/login/producer?status=${session.accountState}`)
  }

  return (
    <div className="pt-32 pb-16 px-6 md:px-12 min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-12">
        <ProducerSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
