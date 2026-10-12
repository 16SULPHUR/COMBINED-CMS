import type { CollectionConfig } from 'payload'

import { publicRead, tags, tone } from '../fields'

export const Skills: CollectionConfig = {
  slug: 'portfolio-skills',
  labels: { singular: 'Skill group', plural: 'Skill groups' },
  orderable: true,
  access: publicRead,
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    tone(true),
    tags('items', true),
  ],
}
