import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Singleton document — only one instance ever exists (ID = 'homepageCollection').
 *
 * Controls which products appear in the "Curated Collection" section on the
 * homepage. Drag to reorder. Recommended: 4 or 8 products (the grid shows
 * 4 per row on large screens).
 *
 * The singleton is surfaced via a custom structure entry in sanity.config.ts,
 * which hides the "Create new" button and always navigates to this document.
 */
export const homepageCollectionType = defineType({
  name: 'homepageCollection',
  title: 'Homepage — Curated Collection',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description:
        'Not shown on the website. Use this to identify the active selection (e.g. "Spring 2026", "Christmas Edit").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitleOverride',
      title: 'Section subtitle override',
      type: 'string',
      description:
        'Optional. Replaces the default subtitle shown under "Curated Collection" on the homepage. Leave blank to use the default translation.',
    }),
    defineField({
      name: 'products',
      title: 'Featured products',
      type: 'array',
      description:
        'Drag handles on the left to reorder. 4 or 8 products fills the grid cleanly. Maximum 8.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: 'defined(slug.current)',
          },
        },
      ],
      validation: (Rule) => Rule.max(8).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      p0: 'products.0.name',
      p1: 'products.1.name',
      p2: 'products.2.name',
    },
    prepare({ title, p0, p1, p2 }) {
      const listed = [p0, p1, p2].filter(Boolean).join(', ')
      return {
        title: title || 'Homepage Collection',
        subtitle: listed ? `${listed}…` : 'No products selected yet',
      }
    },
  },
})
