import type { GlobalConfig } from 'payload'

import { links, publicRead } from '../fields'

export const Contact: GlobalConfig = {
  slug: 'portfolio-contact',
  label: 'Contact',
  access: publicRead,
  fields: [
    { name: 'greeting', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'email', type: 'email', required: true },
    links(),
    { name: 'signoff', type: 'text', required: true },
  ],
}
