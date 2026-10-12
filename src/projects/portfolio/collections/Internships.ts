import type { CollectionConfig } from 'payload'

import { publicRead, tags } from '../fields'

export const Internships: CollectionConfig = {
  slug: 'portfolio-internships',
  labels: { singular: 'Internship', plural: 'Internships' },
  orderable: true,
  access: publicRead,
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'title', 'period'] },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    tags('points', true),
  ],
}
