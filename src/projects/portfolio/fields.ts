import type { Field } from 'payload'

export const publicRead = { read: () => true }

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
