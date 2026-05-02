'use server'

import { createServerSupabase } from '@/lib/supabase/server'

export async function submitReview(
  productSlug: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be signed in to leave a review.' }
  }

  const reviewerName = (formData.get('reviewer_name') as string | null)?.trim() ?? ''
  const body = (formData.get('body') as string | null)?.trim() ?? ''
  const ratingRaw = formData.get('rating') as string | null
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : 0

  if (!reviewerName) return { success: false, error: 'Name is required.' }
  if (rating < 1 || rating > 5) return { success: false, error: 'Please select a rating.' }
  if (body.length < 20) return { success: false, error: 'Review must be at least 20 characters.' }

  const { error } = await (supabase as any).from('product_reviews').insert({
    product_slug: productSlug,
    user_id: user.id,
    reviewer_name: reviewerName,
    rating,
    body,
    approved: false,
  })

  if (error) return { success: false, error: error.message }

  return { success: true }
}
