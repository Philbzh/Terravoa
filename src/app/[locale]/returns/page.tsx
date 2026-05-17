import { createLegalMetadata, LegalPage } from '@/lib/legal/LegalPage'

export const generateMetadata = createLegalMetadata('returns')

export default function ReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <LegalPage slug="returns" params={params} />
}
