import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { ReturnRequestForm } from './ReturnRequestForm'

export const metadata = { title: 'Request a Return' }

/**
 * P3 fix: gate this page server-side so anonymous users are redirected to login.
 * The client component (ReturnRequestForm) never even loads for unauthenticated users,
 * which means the API call is never attempted without a session.
 */
export default async function NewReturnPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/login?next=/account/returns/new`)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-surface">
      <div className="max-w-lg mx-auto">
        <ReturnRequestForm />
      </div>
    </div>
  )
}
