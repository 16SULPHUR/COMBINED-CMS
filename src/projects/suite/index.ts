import { defineProject } from '../types'
import { Copy } from './globals/Copy'

export const suite = defineProject({
  slug: 'suite',
  label: 'Suite',
  collections: [],
  globals: [Copy],
})
