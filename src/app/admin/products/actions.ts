'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import { sanitizeFormField } from '@/lib/sanitize'

export async function setProductStatus(
  id: string,
  status: 'approved' | 'rejected',
) {
  await assertAdminForServerAction()

  const admin = createAdminClient()
  const { error } = await (admin as any)
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await logAdminAction({
    action: `product.${status}`,
    entityType: 'product',
    entityId: id,
    metadata: { status },
  })

  revalidatePath('/admin/products')
  revalidatePath('/collection')
}

export async function updateProductDetails(formData: FormData) {
  await assertAdminForServerAction()

  const id = sanitizeFormField(formData, 'id')
  if (!id) return { ok: false as const, error: 'Missing product id.' }

  const name = sanitizeFormField(formData, 'name')
  const slug = sanitizeFormField(formData, 'slug')
  const category = sanitizeFormField(formData, 'category')
  const status = (sanitizeFormField(formData, 'status') || 'pending') as 'approved' | 'rejected' | 'pending'
  const priceRaw = sanitizeFormField(formData, 'price')
  const price = Number(priceRaw)

  if (!name || !slug || !Number.isFinite(price) || price < 1) {
    return { ok: false as const, error: 'Name, slug, and valid price are required.' }
  }

  const admin = createAdminClient()
  const { error } = await (admin as any)
    .from('products')
    .update({
      name,
      slug,
      category,
      status,
      price: Math.round(price),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { ok: false as const, error: error.message }

  await logAdminAction({
    action: 'product.updated',
    entityType: 'product',
    entityId: id,
    metadata: { fields: ['name', 'slug', 'category', 'status', 'price'] },
  })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/collection')
  return { ok: true as const }
}

export async function toggleProductFeatured(
  id: string,
  isFeatured: boolean,
) {
  await assertAdminForServerAction()

  const admin = createAdminClient()
  const updates = isFeatured
    ? { is_featured: true, featured_rank: 100, updated_at: new Date().toISOString() }
    : { is_featured: false, featured_rank: null, updated_at: new Date().toISOString() }

  const { error } = await (admin as any)
    .from('products')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)

  await logAdminAction({
    action: isFeatured ? 'product.featured' : 'product.unfeatured',
    entityType: 'product',
    entityId: id,
    metadata: { is_featured: isFeatured },
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/collection')
}

export async function setProductFeaturedRank(
  id: string,
  rank: number | null,
) {
  await assertAdminForServerAction()

  const admin = createAdminClient()
  const { error } = await (admin as any)
    .from('products')
    .update({ featured_rank: rank, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'product.rank_changed',
    entityType: 'product',
    entityId: id,
    metadata: { featured_rank: rank },
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
}
