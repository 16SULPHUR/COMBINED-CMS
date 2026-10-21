import type { Access, CheckboxField, CollectionAdminOptions, Field, TextField } from 'payload'

type LivePreviewConfig = NonNullable<CollectionAdminOptions['livePreview']>

export const publicRead = { read: () => true }

export const isAdmin: Access = ({ req }) => Boolean(req.user)

// Hidden entries stay readable in the admin but are left out of the public API.
export const listedRead = { read: (({ req }) => (req.user ? true : { hidden: { not_equals: true } })) as Access }

export const hidden: CheckboxField = {
  name: 'hidden',
  type: 'checkbox',
  label: 'Hide on the site',
  defaultValue: false,
  index: true,
  admin: { position: 'sidebar', description: 'Keeps it here but takes it off the portfolio.' },
}

export const collectionVersions = { maxPerDoc: 50 }
export const globalVersions = { max: 50 }

export const portfolioUrl = () => (process.env.PORTFOLIO_URL || 'https://ankit.varietyheaven.in').replace(/\/+$/, '')

export const livePreview = (path = '/'): LivePreviewConfig => ({
  url: ({ collectionConfig, globalConfig }) =>
    `${portfolioUrl()}${path}?cms-preview=${collectionConfig?.slug ?? globalConfig?.slug ?? ''}`,
  breakpoints: [
    { label: 'Phone', name: 'phone', width: 390, height: 844 },
    { label: 'Laptop', name: 'laptop', width: 1440, height: 900 },
  ],
})

export const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  { name: 'href', type: 'text', required: true },
]

export const links = (name = 'links'): Field => ({ name, type: 'array', fields: linkFields })

export const tags = (name: string, required = false): Field => ({
  name,
  type: 'text',
  hasMany: true,
  required,
})

export const text = (name: string, defaultValue?: string, description?: string): TextField => ({
  name,
  type: 'text',
  defaultValue,
  ...(description ? { admin: { description } } : {}),
})

export const group = (name: string, label: string, fields: Field[], description?: string): Field => ({
  name,
  label,
  type: 'group',
  fields,
  ...(description ? { admin: { description } } : {}),
})

export const toggle = (name: string, label: string, defaultValue = true, description?: string): CheckboxField => ({
  name,
  type: 'checkbox',
  label,
  defaultValue,
  ...(description ? { admin: { description } } : {}),
})

export const pastel: Field = {
  name: 'color',
  type: 'select',
  required: true,
  options: ['hero', 'peach', 'mint', 'butter', 'lilac', 'aqua', 'rose', 'sage'],
}

export const tone = (required = false): Field => ({
  name: 'tone',
  type: 'text',
  required,
  admin: { description: 'Hex colour, e.g. #CDEBDD' },
})
