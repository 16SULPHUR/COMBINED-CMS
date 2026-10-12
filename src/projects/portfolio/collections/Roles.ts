import type { CollectionConfig } from 'payload'

import { pastel, publicRead, tags } from '../fields'

export const Roles: CollectionConfig = {
  slug: 'portfolio-roles',
  labels: { singular: 'Role', plural: 'Roles' },
  orderable: true,
  access: publicRead,
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'title', 'period'] },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    pastel,
    tags('points', true),
    tags('tags'),
    { name: 'note', type: 'text' },
  ],
}
