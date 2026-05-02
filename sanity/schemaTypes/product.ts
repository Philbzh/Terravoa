import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (cents)',
      type: 'number',
      description: 'Integer, e.g. 3200 = €32.00',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({ name: 'origin', title: 'Origin (country/region label)', type: 'string' }),
    defineField({
      name: 'producer',
      title: 'Producer',
      type: 'reference',
      to: [{ type: 'producer' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'details',
      title: 'Detail bullets',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      description:
        'Optional in CMS; the storefront uses a placeholder until you upload an asset (recommended before launch).',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      description: 'Optional label shown on the product card. Set both fields or leave both empty.',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Label text',
          type: 'string',
          description: 'Short text shown on the badge, e.g. "New", "Organic", "Last batch"',
        },
        {
          name: 'variant',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Artisan / Origin (earthy green)', value: 'producer' },
              { title: 'Bestseller (gold)', value: 'bestseller' },
              { title: 'New (terracotta)', value: 'new' },
              { title: 'Limited (deep plum)', value: 'limited' },
              { title: 'Seasonal (sage green)', value: 'seasonal' },
              { title: 'Sale (warm red)', value: 'sale' },
            ],
            layout: 'radio',
          },
        },
      ],
    }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),

    // ── Homepage feature ──────────────────────────────────────────────────────
    defineField({
      name: 'isFeatured',
      title: '⭐ Featured on homepage',
      type: 'boolean',
      description:
        'Tick to show this product in the "Curated Collection" section on the homepage. Untick to remove it. Max 8 products are shown — if more are ticked, use Featured order to control which appear first.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured order',
      type: 'number',
      description:
        'Controls position on the homepage (lower number = shown first). Leave blank and products are ordered by when they were featured. Only used when Featured on homepage is ticked.',
      hidden: ({ document }) => !document?.isFeatured,
      validation: (Rule) => Rule.min(1).integer(),
    }),

    // ── Pre-order / Seasonal ──
    defineField({
      name: 'isPreOrder',
      title: 'Pre-order / Seasonal item',
      type: 'boolean',
      description: 'Enable to mark this product as available for pre-order only. Stock ships when the season begins.',
      initialValue: false,
    }),
    defineField({
      name: 'preOrderAvailableFrom',
      title: 'Available from (season start)',
      type: 'date',
      description: 'Estimated date when the order will be dispatched. Shown to customers.',
      hidden: ({ document }) => !document?.isPreOrder,
    }),
    defineField({
      name: 'season',
      title: 'Season / Harvest label',
      type: 'string',
      description: 'E.g. "Summer 2026 harvest", "Christmas edition". Shown on product card and detail page.',
      hidden: ({ document }) => !document?.isPreOrder,
    }),

    // ── Subscription / Recurring delivery ──
    defineField({
      name: 'subscriptionAvailable',
      title: 'Subscription available',
      type: 'boolean',
      description: 'Allow customers to subscribe for recurring deliveries of this product.',
      initialValue: false,
    }),
    defineField({
      name: 'subscriptionIntervals',
      title: 'Available delivery intervals',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Every month', value: 'monthly' },
          { title: 'Every 2 months', value: 'bimonthly' },
          { title: 'Every 3 months', value: 'quarterly' },
          { title: 'Every 6 months', value: 'biannual' },
        ],
        layout: 'list',
      },
      hidden: ({ document }) => !document?.subscriptionAvailable,
    }),
    defineField({
      name: 'subscriptionDiscount',
      title: 'Subscription discount (%)',
      type: 'number',
      description: 'Optional discount for subscribers (e.g. 10 = 10% off). Leave blank for no discount.',
      validation: Rule => Rule.min(0).max(50),
      hidden: ({ document }) => !document?.subscriptionAvailable,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      producerName: 'producer.name',
      isFeatured: 'isFeatured',
      featuredOrder: 'featuredOrder',
    },
    prepare({ title, media, producerName, isFeatured, featuredOrder }) {
      const featured = isFeatured
        ? `⭐ Homepage${featuredOrder ? ` #${featuredOrder}` : ''} · `
        : ''
      return {
        title,
        media,
        subtitle: `${featured}${producerName ?? ''}`,
      }
    },
  },
})
