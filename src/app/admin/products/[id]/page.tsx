import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { updateProductDetails } from '../actions'

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('products')
    .select('id, name, slug, category, status, price, created_at, producer_id')
    .eq('id', id)
    .maybeSingle()
  const { data: producer } = await (admin as any)
    .from('producers')
    .select('id, name, slug')
    .eq('id', data?.producer_id ?? '')
    .maybeSingle()

  if (!data) notFound()

  async function saveProduct(formData: FormData) {
    'use server'
    await updateProductDetails(formData)
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-block font-sans text-xs text-on-surface-variant hover:text-primary mb-4 transition-colors"
      >
        ← Back to products
      </Link>
      <AdminPageHeader
        title={`Edit product · ${data.name}`}
        description="Correct product information and approval status."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <form action={saveProduct} className="xl:col-span-8 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 space-y-5">
          <input type="hidden" name="id" value={data.id} />
          <Field label="Name" name="name" defaultValue={data.name} required />
          <Field label="Slug" name="slug" defaultValue={data.slug} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category" name="category" defaultValue={data.category} />
            <Field label="Price (cents)" name="price" defaultValue={String(data.price)} required />
          </div>
          <label className="block">
            <span className="font-sans text-xs text-on-surface-variant">Status</span>
            <select
              name="status"
              defaultValue={data.status}
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </label>
          <button
            type="submit"
            className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
        </form>

        <aside className="xl:col-span-4 xl:sticky xl:top-24 space-y-4">
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-base font-medium text-on-surface mb-3">Product context</h2>
            <dl className="space-y-2 font-sans text-sm">
              <div>
                <dt className="text-xs text-on-surface-variant">Product ID</dt>
                <dd className="text-on-surface font-mono text-xs break-all">{data.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">Current status</dt>
                <dd className="text-on-surface capitalize">{data.status}</dd>
              </div>
              <div>
                <dt className="text-xs text-on-surface-variant">Created</dt>
                <dd className="text-on-surface">
                  {new Date(data.created_at).toLocaleString('en-GB')}
                </dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-base font-medium text-on-surface mb-2">Producer</h2>
            {producer ? (
              <div className="space-y-2">
                <p className="font-sans text-sm text-on-surface">{producer.name}</p>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/producers/${producer.id}`} className="font-sans text-xs text-secondary hover:underline">
                    Open producer editor
                  </Link>
                  <Link href={`/en/producers/${producer.slug}`} className="font-sans text-xs text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
                    Public profile
                  </Link>
                </div>
              </div>
            ) : (
              <p className="font-sans text-sm text-on-surface-variant">Producer not found.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="font-sans text-xs text-on-surface-variant">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
      />
    </label>
  )
}
