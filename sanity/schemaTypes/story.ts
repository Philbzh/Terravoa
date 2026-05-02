import { defineField, defineType } from 'sanity'

export const storyType = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      description:
        'Regional guide = listed in Journal (SEO, regions, specialties). Producer portrait = long read lives on the producer profile only; not shown in Journal.',
      options: {
        list: [
          { title: 'Regional guide (Journal)', value: 'regionGuide' },
          { title: 'Producer portrait (producer page only)', value: 'producerFeature' },
        ],
        layout: 'radio',
      },
      initialValue: 'regionGuide',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 4 }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 20 }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'date', title: 'Date', type: 'string' }),
    defineField({ name: 'readTime', title: 'Read time', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({ name: 'region', title: 'Region label', type: 'string' }),
    defineField({
      name: 'producer',
      title: 'Related producer',
      type: 'reference',
      to: [{ type: 'producer' }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
})
