import type { CollectionConfig } from 'payload'

import { collectionVersions, hidden, listedRead, livePreview, pastel, tags } from '../fields'

export const Roles: CollectionConfig = {
  slug: 'portfolio-roles',
  labels: { singular: 'Role', plural: 'Roles' },
  orderable: true,
  access: listedRead,
  versions: collectionVersions,
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'title', 'period', 'hidden'], livePreview: livePreview() },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    pastel,
    tags('points', true),
    tags('tags'),
    { name: 'note', type: 'text' },
    hidden,
  ],
}
