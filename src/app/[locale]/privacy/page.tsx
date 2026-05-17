import { createLegalMetadata, LegalPage } from '@/lib/legal/LegalPage'

export const generateMetadata = createLegalMetadata('privacy')

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <LegalPage slug="privacy" params={params} />
}
