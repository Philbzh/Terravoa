'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

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

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return { ok: false as const, error: 'Missing product id.' }

  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const status = String(formData.get('status') ?? 'pending').trim() as 'approved' | 'rejected' | 'pending'
  const priceRaw = String(formData.get('price') ?? '').trim()
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
