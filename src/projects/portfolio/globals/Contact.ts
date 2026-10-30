import type { GlobalConfig } from 'payload'

import { globalVersions, links, livePreview, publicRead } from '../fields'

export const Contact: GlobalConfig = {
  slug: 'portfolio-contact',
  label: 'Contact',
  access: publicRead,
  versions: globalVersions,
  admin: { livePreview: livePreview() },
  fields: [
    { name: 'greeting', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'email', type: 'email', required: true },
    links(),
    { name: 'signoff', type: 'text', required: true },
  ],
}
