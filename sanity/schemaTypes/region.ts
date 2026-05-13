import { defineField, defineType } from 'sanity'

export const regionType = defineType({
  name: 'region',
  title: 'Region',
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
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'administrativeRegion',
      title: 'Official Administrative Region',
      type: 'string',
      description: 'The official administrative unit (e.g. "Baden-Württemberg" for Black Forest)',
    }),
    defineField({ name: 'specialty', title: 'Specialty line', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Long description',
      type: 'text',
      rows: 12,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'traditions',
      title: 'Traditions & Flavours',
      description: 'Cultural editorial blocks shown on the region page. Aim for 3 entries covering food culture, craftsmanship, and lifestyle.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'Short heading, e.g. "The Olive Harvest", "Smoke & Cure"',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'body',
              type: 'text',
              title: 'Body',
              rows: 4,
              description: '2-3 sentences of editorial text.',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon (emoji)',
              description: 'A single emoji shown above the title, e.g. "🫒", "🍯", "🧂"',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'icon' },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: `${subtitle ?? ''} ${title ?? ''}`.trim() }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'selectedAddresses',
      title: 'Selected Addresses',
      description:
        'Curated places the Terravoa team recommends — agriturismo, restaurants, bakeries, experiences. Aim for 3–6 per region.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Name',
              description: 'Name of the establishment or experience',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'kind',
              type: 'string',
              title: 'Category',
              options: {
                list: [
                  { title: 'Agriturismo', value: 'agriturismo' },
                  { title: 'Restaurant', value: 'restaurant' },
                  { title: 'Hotel', value: 'hotel' },
                  { title: 'Experience', value: 'experience' },
                  { title: 'Bakery', value: 'bakery' },
                  { title: 'Vineyard', value: 'vineyard' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 3,
              description: '1–2 sentence editorial blurb',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'location',
              type: 'string',
              title: 'Location',
              description: 'Town / area, e.g. "Panzano in Chianti"',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'website',
              type: 'url',
              title: 'Website',
              description: 'Optional link',
            },
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'kind', location: 'location' },
            prepare({
              title,
              subtitle,
              location,
            }: {
              title?: string
              subtitle?: string
              location?: string
            }) {
              const kindEmoji: Record<string, string> = {
                agriturismo: '🏡',
                restaurant: '🍽️',
                hotel: '🏨',
                experience: '🌿',
                bakery: '🥖',
                vineyard: '🍇',
              }
              return {
                title: `${kindEmoji[subtitle ?? ''] ?? '📍'} ${title ?? ''}`.trim(),
                subtitle: location,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'productCount',
      title: 'Product count (display)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'producerCount',
      title: 'Producer count (display)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'country' },
  },
})
