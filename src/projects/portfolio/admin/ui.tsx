import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import React, { type ReactNode } from 'react'

import type { Ranked } from '../monitoring/insights'
import './insights.css'

export const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const seconds = (s: number) => {
  if (!s) return '0s'
  const m = Math.floor(s / 60)
  const r = Math.round(s % 60)
  return m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`
}

export const ago = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const h = Math.round(mins / 60)
  if (h < 36) return `${h} h ago`
  return `${Math.round(h / 24)} days ago`
}

export const Page = ({ props, children }: { props: AdminViewServerProps; children: ReactNode }) => {
  const { initPageResult, params, searchParams } = props
  const { req, permissions, locale, visibleEntities } = initPageResult
  if (!req.user) redirect('/admin/login')
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <div className="pi">{children}</div>
      </Gutter>
    </DefaultTemplate>
  )
}

export const Delta = ({ now, before, period, lowerIsBetter = false }: { now: number; before: number; period: string; lowerIsBetter?: boolean }) => {
  if (!before) return <div className="d">{now ? `nothing in the previous ${period}` : ' '}</div>
  const change = Math.round(((now - before) / before) * 100)
  if (change === 0) return <div className="d">same as the previous {period}</div>
  const good = lowerIsBetter ? change < 0 : change > 0
  return (
    <div className="d">
      <span className={good ? 'up' : 'down'}>
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
      </span>{' '}
      vs previous {period}
    </div>
  )
}

export const Tile = ({ label, value, children }: { label: string; value: ReactNode; children?: ReactNode }) => (
  <div className="pi-tile">
    <div className="k">{label}</div>
    <div className="v">{value}</div>
    {children}
  </div>
)

export const Card = ({ title, note, wide, children }: { title: string; note?: string; wide?: boolean; children: ReactNode }) => (
  <section className={`pi-card${wide ? ' wide' : ''}`}>
    <h2>{title}</h2>
    {note && <p className="pi-note">{note}</p>}
    {children}
  </section>
)

export const Empty = ({ children = 'Nothing yet in this period.' }: { children?: ReactNode }) => <div className="pi-empty">{children}</div>

export const Bars = ({ items, total, unit = 'visits' }: { items: Ranked[]; total?: number; unit?: string }) => {
  if (!items.length) return <Empty />
  const max = Math.max(...items.map((i) => i.n))
  return (
    <ul className="pi-bars">
      {items.map((i) => (
        <li key={`${i.name}-${i.label}`} title={i.label}>
          <span className="name">{i.label}</span>
          <span className="num">
            {i.n.toLocaleString('en')}
            {total ? <small>{Math.round((i.n / total) * 100)}%</small> : <small>{unit}</small>}
          </span>
          <span className="track" aria-hidden="true">
            <span className="fill" style={{ display: 'block', width: `${(i.n / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

export const Stats = ({ items }: { items: { label: string; value: ReactNode }[] }) => (
  <div className="pi-stats">
    {items.map((s) => (
      <div className="pi-stat" key={s.label}>
        <div className="v">{s.value}</div>
        <div className="k">{s.label}</div>
      </div>
    ))}
  </div>
)
