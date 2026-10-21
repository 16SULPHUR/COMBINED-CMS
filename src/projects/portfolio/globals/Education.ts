import type { GlobalConfig } from 'payload'

import { globalVersions, livePreview, publicRead } from '../fields'

export const Education: GlobalConfig = {
  slug: 'portfolio-education',
  label: 'Education',
  access: publicRead,
  versions: globalVersions,
  admin: { livePreview: livePreview() },
  fields: [
    { name: 'degree', type: 'text', required: true },
    { name: 'school', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    {
      name: 'score',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            { name: 'outOf', type: 'text', required: true },
          ],
        },
        { name: 'note', type: 'text' },
      ],
    },
    { name: 'blurb', type: 'textarea', required: true },
  ],
}
