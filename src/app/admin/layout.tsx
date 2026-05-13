import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminPageTransition } from '@/components/admin/AdminPageTransition'
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
    <div className="flex min-h-screen bg-surface-container-lowest">
      {/* Skip-to-content link for accessibility */}
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>

      <AdminSidebar counts={counts} access={access} />

      <main
        id="admin-main"
        className="admin-content flex-1 min-w-0 min-h-screen lg:pl-0"
      >
        <div className="px-4 md:px-6 lg:px-8 py-5 md:py-6 max-w-[1400px]">
          <AdminPageTransition>
            {children}
          </AdminPageTransition>
        </div>
      </main>
    </div>
  )
}
