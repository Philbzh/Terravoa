'use client'

import { useRouter } from 'next/navigation'
import { RejectApplicationModal } from './RejectApplicationModal'

/**
 * Compact "Reject" pill used in the admin applications listing row.
 * Delegates to {@link RejectApplicationModal} so the admin picks
 * structured rejection reasons + an optional note. After the server
 * action finishes, we refresh the current route to pick up the new
 * status from the DB.
 */
export function RejectApplicationButton({
  id,
  applicantName,
  applicantEmail,
  locale,
}: {
  id: string
  applicantName: string
  applicantEmail: string
  locale: string
}) {
  const router = useRouter()
  return (
    <RejectApplicationModal
      applicationId={id}
      applicantName={applicantName}
      applicantEmail={applicantEmail}
      locale={locale}
      variant="ghost"
      onRejected={() => router.refresh()}
    />
  )
}
