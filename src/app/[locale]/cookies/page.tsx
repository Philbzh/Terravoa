import { createLegalMetadata, LegalPage } from '@/lib/legal/LegalPage'

export const generateMetadata = createLegalMetadata('cookies')

export default function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <LegalPage slug="cookies" params={params} />
}
