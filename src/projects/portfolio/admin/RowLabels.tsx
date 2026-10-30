'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

const names: Record<string, string> = {
  intro: 'Intro',
  work: 'Work',
  internships: 'Internships',
  projects: 'Projects bundle',
  stack: 'Stack',
  writing: 'Writing',
  education: 'Education',
  contact: 'Contact letter',
}

type Named = { name?: string; label?: string; move?: string; line?: string; key?: string; off?: boolean }

export const NamedRow = () => {
  const { data, rowNumber } = useRowLabel<Named>()
  const name = data?.name || data?.label || data?.move || data?.line || data?.key || `Row ${(rowNumber ?? 0) + 1}`
  return (
    <span>
      {name.length > 70 ? `${name.slice(0, 67)}…` : name}
      {data?.off ? ' (taken off)' : ''}
    </span>
  )
}

export const MainLineRow = () => {
  const { data, rowNumber } = useRowLabel<{ card?: string; label?: string; show?: boolean }>()
  const name = data?.card ? names[data.card] ?? data.card : `Card ${(rowNumber ?? 0) + 1}`
  return (
    <span>
      {name}
      {data?.label && data.label !== name ? ` · "${data.label}"` : ''}
      {data?.show === false ? ' (taken down)' : ''}
    </span>
  )
}
