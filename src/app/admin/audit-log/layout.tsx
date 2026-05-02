import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminAuditLogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('operations')
  return children
}
