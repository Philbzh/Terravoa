import 'server-only'

import { getProducerRatingDashboard } from '@/lib/admin/producer-ratings'
import { createAdminClient } from '@/lib/supabase/admin'

/** Badge counts for the admin sidebar (items needing attention). */
export async function getAdminNavCounts() {
  const admin = createAdminClient() as any

  const [applications, products, ratings, reviews, returns, planRequests] = await Promise.all([
    admin
      .from('producer_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    admin.from('products').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    getProducerRatingDashboard(),
    admin.from('product_reviews').select('id', { count: 'exact', head: true }).eq('approved', false),
    admin.from('return_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('producer_plan_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    pendingApplications: applications.count ?? 0,
    pendingProducts: products.count ?? 0,
    ratingAlerts: ratings.alertCount,
    pendingReviews: reviews.count ?? 0,
    pendingReturns: returns.count ?? 0,
    pendingPlanRequests: planRequests.count ?? 0,
  }
}
