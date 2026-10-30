import type { CollectionConfig } from 'payload'

import { collectionVersions, hidden, listedRead, livePreview, tags } from '../fields'

export const Articles: CollectionConfig = {
  slug: 'portfolio-articles',
  labels: { singular: 'Article', plural: 'Articles' },
  orderable: true,
  access: listedRead,
  versions: collectionVersions,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publication', 'date', 'hidden'], livePreview: livePreview() },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'publication', type: 'text', required: true },
    { name: 'date', type: 'text', required: true },
    { name: 'readTime', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true },
    tags('topics'),
    { name: 'href', type: 'text', required: true, unique: true },
    hidden,
  ],
}
