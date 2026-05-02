import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminFinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('finance')
  return children
}
