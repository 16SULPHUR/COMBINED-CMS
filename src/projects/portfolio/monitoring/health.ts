import type { Payload } from 'payload'

import { portfolioUrl } from '../fields'
import { num, rows, sql, tables } from './db'

export type Check = { name: string; state: 'up' | 'warn' | 'down'; detail: string; ms?: number; href?: string }

const timed = async <T>(fn: () => Promise<T>) => {
  const t0 = Date.now()
  const value = await fn()
  return { value, ms: Date.now() - t0 }
}

const ping = async (name: string, url: string, expect: (status: number) => boolean = (s) => s < 400): Promise<Check> => {
  try {
    const { value: res, ms } = await timed(() => fetch(url, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(8000) }))
    const up = expect(res.status)
    return { name, state: up ? (ms > 3000 ? 'warn' : 'up') : 'down', detail: up ? `Answered ${res.status} in ${ms} ms` : `Answered ${res.status}`, ms, href: url }
  } catch (err) {
    return { name, state: 'down', detail: err instanceof Error && err.name === 'TimeoutError' ? 'No answer in 8 s' : 'Could not reach it', href: url }
  }
}

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

export const databaseCheck = async (payload: Payload): Promise<Check> => {
  try {
    const { value, ms } = await timed(() => rows<{ size: string }>(payload, sql`SELECT pg_database_size(current_database()) AS size`))
    const size = num(value[0]?.size)
    const state = size > 450 * 1024 * 1024 ? 'warn' : ms > 1500 ? 'warn' : 'up'
    return { name: 'CMS database', state, detail: `Answered in ${ms} ms · ${mb(size)} used of the 500 MB free plan`, ms }
  } catch {
    return { name: 'CMS database', state: 'down', detail: 'Query failed' }
  }
}

const storageCheck = async (payload: Payload): Promise<Check> => {
  const { docs } = await payload.find({ collection: 'media', limit: 1, sort: '-createdAt', depth: 0 })
  const url = docs[0]?.url
  if (!url) return { name: 'Media storage', state: 'up', detail: 'No files uploaded yet' }
  const absolute = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${url}`
  return ping('Media storage', absolute)
}

const trackingCheck = async (payload: Payload): Promise<Check> => {
  const [last] = await rows<{ at: string | null; today: string }>(
    payload,
    sql`SELECT max(last_seen_at) AS at, count(*) FILTER (WHERE started_at > now() - interval '1 day') AS today FROM ${tables.visits}`,
  )
  if (!last?.at) return { name: 'Visit tracking', state: 'warn', detail: 'No visits recorded yet' }
  const hours = (Date.now() - new Date(last.at).getTime()) / 3_600_000
  const ago = hours < 1 ? `${Math.max(1, Math.round(hours * 60))} min ago` : hours < 48 ? `${Math.round(hours)} h ago` : `${Math.round(hours / 24)} days ago`
  return {
    name: 'Visit tracking',
    state: hours > 72 ? 'warn' : 'up',
    detail: `Last visit ${ago} · ${num(last.today)} in the last 24 h`,
  }
}

export const healthChecks = async (payload: Payload): Promise<Check[]> => {
  const site = portfolioUrl()
  const settled = await Promise.allSettled([
    ping('Portfolio site', site),
    ping('Content through the site', `${site}/cms/globals/portfolio-profile?depth=0`),
    databaseCheck(payload),
    storageCheck(payload),
    trackingCheck(payload),
    ping('Old Cloudflare tracker', 'https://portfolio-worker.varietyheaven.in/', (s) => s < 500),
  ])
  return settled.map((r) =>
    r.status === 'fulfilled' ? r.value : { name: 'Check', state: 'down', detail: String(r.reason) },
  )
}

export const tableSizes = (payload: Payload) =>
  rows<{ name: string; rows: string; bytes: string }>(
    payload,
    sql`SELECT c.relname AS name, coalesce(s.n_live_tup, greatest(c.reltuples, 0)::bigint) AS rows, pg_total_relation_size(c.oid) AS bytes
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
      WHERE n.nspname = 'payload' AND c.relkind = 'r' AND c.relname IN ('portfolio_visits', 'portfolio_events', 'portfolio_errors', 'media')`,
  )
