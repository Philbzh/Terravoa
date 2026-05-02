'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

export type CouponResult = { ok: true } | { ok: false; error: string }

export async function createCoupon(formData: FormData): Promise<CouponResult> {
  try { await assertAdminForServerAction() } catch { return { ok: false, error: 'Unauthorized' } }

  const code        = String(formData.get('code') ?? '').trim().toUpperCase()
  const discountPct = Number(formData.get('discount_pct') ?? 0)
  const expiresAt   = String(formData.get('expires_at') ?? '').trim() || null
  const maxUses     = String(formData.get('max_uses') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null

  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) {
    return { ok: false, error: 'Code must be 3–30 uppercase letters/numbers/hyphens.' }
  }
  if (!Number.isInteger(discountPct) || discountPct < 1 || discountPct > 100) {
    return { ok: false, error: 'Discount must be 1–100%.' }
  }

  const admin = createAdminClient()
  const { error } = await (admin as any).from('coupons').insert({
    code,
    discount_pct: discountPct,
    expires_at: expiresAt,
    max_uses: maxUses ? Number(maxUses) : null,
    is_active: true,
    description,
    use_count: 0,
  })

  if (error) {
    if (error.code === '23505') return { ok: false, error: `Code "${code}" already exists.` }
    return { ok: false, error: error.message }
  }

  await logAdminAction({ action: 'coupon.created', entityType: 'coupon', entityId: code, metadata: { discount_pct: discountPct } })
  revalidatePath('/admin/coupons')
  return { ok: true }
}

export async function toggleCoupon(id: string, isActive: boolean): Promise<void> {
  try { await assertAdminForServerAction() } catch { return }
  const admin = createAdminClient()
  await (admin as any).from('coupons').update({ is_active: isActive }).eq('id', id)
  await logAdminAction({ action: isActive ? 'coupon.activated' : 'coupon.deactivated', entityType: 'coupon', entityId: id, metadata: {} })
  revalidatePath('/admin/coupons')
}

export async function deleteCoupon(id: string): Promise<void> {
  try { await assertAdminForServerAction() } catch { return }
  const admin = createAdminClient()
  await (admin as any).from('coupons').delete().eq('id', id)
  await logAdminAction({ action: 'coupon.deleted', entityType: 'coupon', entityId: id, metadata: {} })
  revalidatePath('/admin/coupons')
}
