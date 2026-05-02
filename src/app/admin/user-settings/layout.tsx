import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminUserSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('operations')
  return children
}
