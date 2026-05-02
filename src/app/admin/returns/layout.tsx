import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminReturnsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('customer')
  return children
}
