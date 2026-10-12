import type { CollectionConfig } from 'payload'

import { projects } from '../../projects'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Shared',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'project',
      type: 'select',
      options: projects.map((p) => ({ label: p.label, value: p.slug })),
      admin: { position: 'sidebar' },
    },
  ],
  upload: true,
}
