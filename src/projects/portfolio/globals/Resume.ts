import type { Field, GlobalConfig } from 'payload'

import { linkFields, links, publicRead, tags } from '../fields'

const link: Field = { name: 'link', type: 'group', fields: linkFields.map((f) => ({ ...f, required: false })) }

const points: Field = {
  name: 'points',
  type: 'array',
  admin: { description: 'Bullets. "Lead" is shown in bold before the text.' },
  fields: [{ name: 'lead', type: 'text' }, { name: 'text', type: 'textarea', required: true }, link],
}

export const Resume: GlobalConfig = {
  slug: 'portfolio-resume',
  label: 'Resume',
  access: publicRead,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    links('contact'),
    {
      name: 'skills',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }, tags('items', true)],
    },
    {
      name: 'experience',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'org', type: 'text', required: true },
        { name: 'href', type: 'text' },
        { name: 'period', type: 'text', required: true },
        tags('stack'),
        points,
      ],
    },
    {
      name: 'projects',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }, tags('stack'), link, points],
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        { name: 'degree', type: 'text', required: true },
        { name: 'school', type: 'text', required: true },
        { name: 'period', type: 'text', required: true },
        { name: 'note', type: 'text' },
      ],
    },
  ],
}
