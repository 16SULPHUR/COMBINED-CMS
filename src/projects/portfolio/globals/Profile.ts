import type { GlobalConfig } from 'payload'

import { globalVersions, links, livePreview, publicRead } from '../fields'

export const Profile: GlobalConfig = {
  slug: 'portfolio-profile',
  label: 'Profile',
  access: publicRead,
  versions: globalVersions,
  admin: { livePreview: livePreview() },
  fields: [
    { name: 'greeting', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'first', type: 'text', required: true },
        { name: 'last', type: 'text', required: true },
      ],
    },
    { name: 'role', type: 'text', required: true },
    { name: 'tagline', type: 'textarea', required: true },
    {
      name: 'now',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'href', type: 'text' },
      ],
    },
    links(),
  ],
}
