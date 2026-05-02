// ─────────────────────────────────────────────────────────────────────────────
// Result<T> — explicit success/failure without try/catch leaking to callers
// ─────────────────────────────────────────────────────────────────────────────
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

/** Convenience helpers */
export const ok = <T>(data: T): Result<T> => ({ ok: true, data })
export const err = (error: string): Result<never> => ({ ok: false, error })

// ─────────────────────────────────────────────────────────────────────────────
// Brand<T, B> — nominal typing to prevent mixing up IDs at the call site
//
// Usage:
//   type OrderId   = Brand<string, 'OrderId'>
//   type ProductId = Brand<string, 'ProductId'>
//
//   function getOrder(id: OrderId) { ... }
//   getOrder(productId)  // ← TS error: prevents accidental swap
// ─────────────────────────────────────────────────────────────────────────────
declare const __brand: unique symbol
export type Brand<T, B> = T & { readonly [__brand]: B }

// Common branded ID types used across the platform
export type OrderId    = Brand<string, 'OrderId'>
export type ProductId  = Brand<string, 'ProductId'>
export type ProducerId = Brand<string, 'ProducerId'>
export type UserId     = Brand<string, 'UserId'>

/** Cast a plain string to a branded ID — only call at trust boundaries (DB reads, API params). */
export const asOrderId    = (id: string) => id as OrderId
export const asProductId  = (id: string) => id as ProductId
export const asProducerId = (id: string) => id as ProducerId
export const asUserId     = (id: string) => id as UserId

// ─────────────────────────────────────────────────────────────────────────────
// Utility types
// ─────────────────────────────────────────────────────────────────────────────

/** Make specific keys required on an otherwise Partial type */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Make specific keys optional */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** Deep partial — useful for patch/update payloads */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

/** Strict Omit that enforces the key actually exists */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>

/** Extract the resolved type of a Promise */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/** Extract the element type from an array */
export type ArrayElement<T extends readonly unknown[]> = T[number]

/** Non-nullable — removes null and undefined */
export type NonNullable<T> = T extends null | undefined ? never : T

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ─────────────────────────────────────────────────────────────────────────────
// API / fetch helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Standard JSON error shape returned from API routes */
export interface ApiError {
  error: string
  code?: string
  details?: unknown
}
