import type { CollectionConfig } from 'payload'

import { collectionVersions, hidden, listedRead, livePreview, tags } from '../fields'

export const Internships: CollectionConfig = {
  slug: 'portfolio-internships',
  labels: { singular: 'Internship', plural: 'Internships' },
  orderable: true,
  access: listedRead,
  versions: collectionVersions,
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'title', 'period', 'hidden'], livePreview: livePreview() },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    tags('points', true),
    hidden,
  ],
}
