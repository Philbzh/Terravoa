import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('customer')
  return children
}
