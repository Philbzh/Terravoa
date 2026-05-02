import { defineField, defineType } from 'sanity'

export const producerType = defineType({
  name: 'producer',
  title: 'Producer',
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
      name: 'region',
      title: 'Cultural / Gastronomic Region',
      type: 'string',
      description: 'The well-known food territory (e.g. "Brittany", "Black Forest", "Tuscany")',
    }),
    defineField({
      name: 'administrativeRegion',
      title: 'Official Administrative Region',
      type: 'string',
      description: 'The official administrative unit (e.g. "Baden-Württemberg", "Grand Est", "Toscana")',
    }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'specialty', title: 'Specialty', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'storyHeadline',
      title: 'Story headline',
      type: 'string',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'text',
      rows: 10,
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
    defineField({
      name: 'image',
      title: 'Profile image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({ name: 'established', title: 'Established', type: 'string' }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'savoirFaire',
      title: 'Savoir-faire',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 4 },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'region' },
  },
})
