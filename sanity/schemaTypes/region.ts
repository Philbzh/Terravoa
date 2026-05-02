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
