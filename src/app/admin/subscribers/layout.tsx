import { requireAdminArea } from '@/lib/auth/require-admin'

export default async function AdminSubscribersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminArea('marketing')
  return children
}
