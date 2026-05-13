/**
 * Next.js Edge Middleware — security gate for /admin and /producer routes.
 *
 * Re-exports the proxy function that:
 * 1. Runs next-intl locale routing for public pages
 * 2. Checks Supabase auth for /admin and /{locale}/producer routes
 * 3. Redirects unauthenticated users to the appropriate login page
 *
 * The layout-level checks (requireAdminSession, getProducerForSession) remain
 * the authoritative role/status checks. This middleware is defence-in-depth:
 * it ensures anonymous traffic never reaches protected routes even if a future
 * page forgets to call the layout guard.
 */
export { proxy as middleware, config } from './proxy'
