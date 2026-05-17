import { createLegalMetadata, LegalPage } from '@/lib/legal/LegalPage'

export const generateMetadata = createLegalMetadata('terms')

export default function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <LegalPage slug="terms" params={params} />
}
