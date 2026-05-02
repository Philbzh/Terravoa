import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminApplicationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('supplier')
  return children
}
