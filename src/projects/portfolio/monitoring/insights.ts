import type { Payload } from 'payload'

import { num, rows, sql, tables } from './db'

export const TIMEZONE = process.env.INSIGHTS_TIMEZONE || 'Asia/Kolkata'

export const RANGES = {
  today: { label: 'Today', days: 1 },
  '7d': { label: '7 days', days: 7 },
  '30d': { label: '30 days', days: 30 },
  '90d': { label: '90 days', days: 90 },
} as const

export type RangeKey = keyof typeof RANGES

export const rangeOf = (v: unknown): RangeKey => (typeof v === 'string' && v in RANGES ? (v as RangeKey) : '7d')

type Row = { name: string | null; n: string; visits?: string; label?: string | null }
export type Ranked = { name: string; label: string; n: number; visits: number }

const ranked = (list: Row[]): Ranked[] =>
  list.map((r) => ({ name: r.name ?? '', label: r.label || r.name || '(none)', n: num(r.n), visits: num(r.visits ?? r.n) }))

export const countryName = (code: string | null | undefined) => {
  if (!code) return 'Unknown'
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

const DAY = 86_400_000

const tzOffset = (d: Date) =>
  new Date(d.toLocaleString('en-US', { timeZone: TIMEZONE })).getTime() - new Date(d.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()

// Calendar days in TIMEZONE, ending today; the previous period stops at the same time of day so partial days compare fairly.
const window = (range: RangeKey) => {
  const now = Date.now()
  const off = tzOffset(new Date(now))
  const today = Math.floor((now + off) / DAY) * DAY - off
  const ms = RANGES[range].days * DAY
  const from = today - ms + DAY
  return { from: new Date(from), prev: new Date(from - ms), prevEnd: new Date(now - ms) }
}

export const loadInsights = async (payload: Payload, range: RangeKey) => {
  const { from, prev, prevEnd } = window(range)
  const f = from.toISOString()
  const p = prev.toISOString()
  const pe = prevEnd.toISOString()
  const v = tables.visits
  const e = tables.events
  const unit = range === 'today' ? sql.raw(`'hour'`) : sql.raw(`'day'`)
  const tz = TIMEZONE

  const top = (column: string, limit = 8) =>
    rows<Row>(
      payload,
      sql`SELECT ${sql.raw(column)} AS name, count(*) AS n FROM ${v} WHERE started_at >= ${f} GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT ${limit}`,
    )

  const eventsOf = (type: string, limit = 10) =>
    rows<Row>(
      payload,
      sql`SELECT target AS name, max(label) AS label, count(*) AS n, count(DISTINCT visit_id) AS visits
        FROM ${e} WHERE type = ${type} AND created_at >= ${f} GROUP BY target ORDER BY 3 DESC, 1 LIMIT ${limit}`,
    )

  const [kpi, live, series, sources, countries, cities, devices, browsers, systems, pages, opened, links, resume, contact, styles, switches, game, music, clock, vitals, errors, recent] =
    await Promise.all([
      rows<Record<string, string | null>>(
        payload,
        sql`SELECT
          count(*) FILTER (WHERE started_at >= ${f}) AS visits,
          count(DISTINCT visitor) FILTER (WHERE started_at >= ${f}) AS visitors,
          coalesce(sum(views) FILTER (WHERE started_at >= ${f}), 0) AS views,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY duration) FILTER (WHERE started_at >= ${f}) AS median,
          count(*) FILTER (WHERE started_at >= ${f} AND actions = 0) AS quiet,
          count(*) FILTER (WHERE started_at >= ${f} AND "returning") AS returning_visits,
          count(*) FILTER (WHERE started_at < ${pe}) AS prev_visits,
          count(DISTINCT visitor) FILTER (WHERE started_at < ${pe}) AS prev_visitors,
          coalesce(sum(views) FILTER (WHERE started_at < ${pe}), 0) AS prev_views,
          percentile_cont(0.5) WITHIN GROUP (ORDER BY duration) FILTER (WHERE started_at < ${pe}) AS prev_median
        FROM ${v} WHERE started_at >= ${p}`,
      ),
      rows<{ n: string }>(payload, sql`SELECT count(*) AS n FROM ${v} WHERE last_seen_at > now() - interval '5 minutes'`),
      rows<{ at: string; visits: string; visitors: string }>(
        payload,
        sql`SELECT to_char(date_trunc(${unit}, started_at AT TIME ZONE ${tz}), 'YYYY-MM-DD"T"HH24:MI') AS at,
          count(*) AS visits, count(DISTINCT visitor) AS visitors
        FROM ${v} WHERE started_at >= ${f} GROUP BY 1 ORDER BY 1`,
      ),
      top(`coalesce(source, 'Direct')`),
      top('country'),
      top(`concat_ws(', ', city, country)`),
      top('device', 3),
      top(`split_part(browser, ' ', 1)`, 6),
      top('os', 6),
      top('landing', 6),
      eventsOf('open', 12),
      eventsOf('link', 10),
      eventsOf('resume', 6),
      eventsOf('contact', 6),
      top(`coalesce(style, 'cards')`, 4),
      rows<{ n: string }>(payload, sql`SELECT count(*) AS n FROM ${e} WHERE type = 'style' AND created_at >= ${f}`),
      rows<Record<string, string>>(
        payload,
        sql`SELECT
          count(DISTINCT visit_id) FILTER (WHERE target = 'start') AS start,
          count(DISTINCT visit_id) FILTER (WHERE target LIKE 'befriend:%') AS befriend,
          count(DISTINCT visit_id) FILTER (WHERE target LIKE 'bug:%') AS bug,
          count(DISTINCT visit_id) FILTER (WHERE target LIKE 'win:%') AS win,
          count(DISTINCT visit_id) FILTER (WHERE target LIKE 'grow:%') AS grow,
          count(DISTINCT visit_id) FILTER (WHERE target = 'finish') AS finish,
          count(DISTINCT visit_id) FILTER (WHERE target = 'take-along') AS take_along
        FROM ${e} WHERE type = 'game' AND created_at >= ${f}`,
      ),
      rows<{ muted: string; visits: string }>(
        payload,
        sql`SELECT count(DISTINCT visit_id) FILTER (WHERE target = 'mute') AS muted,
          (SELECT count(*) FROM ${v} WHERE started_at >= ${f}) AS visits
        FROM ${e} WHERE type = 'music' AND created_at >= ${f}`,
      ),
      eventsOf('clock', 8),
      rows<{ name: string; p75: string; n: string }>(
        payload,
        sql`SELECT target AS name, percentile_cont(0.75) WITHIN GROUP (ORDER BY value) AS p75, count(*) AS n
        FROM ${e} WHERE type = 'vital' AND created_at >= ${f} AND value IS NOT NULL GROUP BY target`,
      ),
      rows<{ id: number; message: string; count: string; last_seen: string; kind: string | null }>(
        payload,
        sql`SELECT id, message, count, last_seen, kind FROM ${tables.errors} WHERE NOT coalesce(resolved, false) ORDER BY last_seen DESC LIMIT 5`,
      ),
      rows<{
        id: number
        label: string | null
        started_at: string
        duration: string | null
        landing: string | null
        style: string | null
        returning: boolean | null
        trail: string | null
      }>(
        payload,
        sql`SELECT x.id, x.label, x.started_at, x.duration, x.landing, x.style, x."returning",
          (SELECT string_agg(t.what, ' → ') FROM (
            SELECT coalesce(ev.label, ev.target) AS what FROM ${e} ev
            WHERE ev.visit_id = x.id AND ev.type NOT IN ('view', 'vital', 'music', 'clock')
            ORDER BY ev.created_at LIMIT 8) t) AS trail
        FROM ${v} x ORDER BY x.started_at DESC LIMIT 12`,
      ),
    ])

  const k = kpi[0] ?? {}
  const gameRow = game[0] ?? {}
  const visits = num(k.visits)

  return {
    from,
    kpi: {
      visitors: { now: num(k.visitors), before: num(k.prev_visitors) },
      visits: { now: visits, before: num(k.prev_visits) },
      views: { now: num(k.views), before: num(k.prev_views) },
      median: { now: num(k.median), before: num(k.prev_median) },
      quiet: num(k.quiet),
      returning: num(k.returning_visits),
      live: num(live[0]?.n),
    },
    series: series.map((s) => ({ at: s.at, visits: num(s.visits), visitors: num(s.visitors) })),
    sources: ranked(sources),
    countries: ranked(countries).map((c) => ({ ...c, label: countryName(c.name || null) })),
    cities: ranked(cities).map((c) => {
      const [city, code] = c.name.includes(', ') ? c.name.split(', ') : ['', c.name]
      return { ...c, label: [city, countryName(code || null)].filter(Boolean).join(', ') }
    }),
    devices: ranked(devices),
    browsers: ranked(browsers),
    systems: ranked(systems),
    pages: ranked(pages),
    opened: ranked(opened),
    links: ranked(links),
    resume: ranked(resume),
    contact: ranked(contact),
    styles: ranked(styles),
    switches: num(switches[0]?.n),
    game: {
      start: num(gameRow.start),
      befriend: num(gameRow.befriend),
      bug: num(gameRow.bug),
      win: num(gameRow.win),
      grow: num(gameRow.grow),
      finish: num(gameRow.finish),
      takeAlong: num(gameRow.take_along),
    },
    music: { muted: num(music[0]?.muted), visits: num(music[0]?.visits) },
    clock: ranked(clock),
    vitals: Object.fromEntries(vitals.map((x) => [x.name, { p75: num(x.p75), n: num(x.n) }])) as Record<string, { p75: number; n: number }>,
    errors: errors.map((x) => ({ id: x.id, message: x.message, count: num(x.count), lastSeen: x.last_seen, kind: x.kind })),
    recent: recent.map((r) => ({
      id: r.id,
      label: r.label ?? 'Visit',
      startedAt: r.started_at,
      duration: num(r.duration),
      landing: r.landing,
      style: r.style,
      returning: Boolean(r.returning),
      trail: r.trail,
    })),
  }
}

export type Insights = Awaited<ReturnType<typeof loadInsights>>

export const pulse = async (payload: Payload) => {
  const [counts, days, open] = await Promise.all([
    rows<Record<string, string>>(
      payload,
      sql`SELECT
        count(DISTINCT visitor) FILTER (WHERE started_at >= date_trunc('day', now() AT TIME ZONE ${TIMEZONE}) AT TIME ZONE ${TIMEZONE}) AS today,
        count(*) FILTER (WHERE last_seen_at > now() - interval '5 minutes') AS live,
        count(*) FILTER (WHERE started_at >= now() - interval '7 days') AS week
      FROM ${tables.visits} WHERE started_at >= now() - interval '8 days' OR last_seen_at > now() - interval '5 minutes'`,
    ),
    rows<{ at: string; n: string }>(
      payload,
      sql`SELECT to_char(date_trunc('day', started_at AT TIME ZONE ${TIMEZONE}), 'YYYY-MM-DD') AS at, count(*) AS n
      FROM ${tables.visits} WHERE started_at >= now() - interval '14 days' GROUP BY 1 ORDER BY 1`,
    ),
    rows<{ n: string }>(payload, sql`SELECT count(*) AS n FROM ${tables.errors} WHERE NOT coalesce(resolved, false)`),
  ])
  const c = counts[0] ?? {}
  return {
    today: num(c.today),
    live: num(c.live),
    week: num(c.week),
    days: days.map((d) => ({ at: d.at, n: num(d.n) })),
    errors: num(open[0]?.n),
  }
}
