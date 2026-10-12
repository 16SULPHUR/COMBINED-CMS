import type { Block, CollectionConfig } from 'payload'

import { links, pastel, publicRead, tags, tone } from '../fields'

const shotBlocks: Block[] = [
  {
    slug: 'row',
    fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text' },
      { name: 'chip', type: 'text' },
      tone(),
      { name: 'rec', type: 'checkbox', label: 'Show recording dot' },
    ],
  },
  {
    slug: 'stages',
    fields: [{ name: 'items', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, tone()] }],
  },
  { slug: 'barcode', fields: [] },
  {
    slug: 'meter',
    fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'number', required: true, min: 0, max: 1 },
      { name: 'verdict', type: 'text', required: true },
      tone(true),
    ],
  },
]

export const Projects: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: { singular: 'Project', plural: 'Projects' },
  orderable: true,
  access: publicRead,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'group', 'year'] },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'caption', type: 'text', required: true },
    { name: 'year', type: 'text', required: true },
    {
      name: 'group',
      type: 'select',
      required: true,
      options: ['work', 'side'],
    },
    pastel,
    {
      name: 'shot',
      type: 'group',
      admin: { description: 'The mock screenshot drawn on the card' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'lines', type: 'blocks', blocks: shotBlocks },
      ],
    },
    { name: 'meta', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    tags('points', true),
    tags('tags'),
    links(),
    { name: 'note', type: 'text' },
  ],
}
