import type { CollectionConfig } from 'payload'

import { collectionVersions, hidden, listedRead, livePreview, tags, tone } from '../fields'

export const Skills: CollectionConfig = {
  slug: 'portfolio-skills',
  labels: { singular: 'Skill group', plural: 'Skill groups' },
  orderable: true,
  access: listedRead,
  versions: collectionVersions,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'hidden'], livePreview: livePreview() },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    tone(true),
    tags('items', true),
    hidden,
  ],
}
