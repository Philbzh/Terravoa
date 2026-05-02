import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminProducersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('supplier')
  return children
}
