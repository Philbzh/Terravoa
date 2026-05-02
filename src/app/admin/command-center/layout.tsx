import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminCommandCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Cross-domain operational view: supplier + customer coordination.
  await requireAdminArea('operations')
  return children
}
