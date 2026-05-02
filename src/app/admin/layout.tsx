import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { getAdminNavCounts } from '@/lib/admin/navigation'
import './admin-theme.css'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { access } = await requireAdminSession()
  const counts = await getAdminNavCounts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-surface-container-lowest px-4 md:px-6 lg:px-8 py-5 md:py-6">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6">
        <AdminSidebar counts={counts} access={access} />
        <div className="admin-content flex-1 min-w-0 rounded-2xl border border-outline-variant/20 bg-surface px-4 md:px-6 lg:px-7 py-5 md:py-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
