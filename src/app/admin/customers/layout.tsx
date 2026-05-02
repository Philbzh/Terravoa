import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminCustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('customer')
  return children
}
