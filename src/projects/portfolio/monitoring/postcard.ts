import { createHash } from 'crypto'
import type { PayloadHandler, PayloadRequest } from 'payload'

import { isBot, parseAgent } from './agent'
import { rows, sql, tables } from './db'
import { trackingSettings, type TrackingSettings } from './settings'

type Json = Record<string, unknown>

const MAX_BODY = 64_000
const MAX_EVENTS = 60
const done = () => new Response(null, { status: 204 })

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null)
const int = (v: unknown, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(max, Math.round(v))) : 0)
const hash = (...parts: string[]) => createHash('sha256').update(parts.join('|')).digest('hex')

const hits = new Map<string, { n: number; reset: number }>()
const limited = (ip: string) => {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || h.reset < now) {
    if (hits.size > 5000) hits.clear()
    hits.set(ip, { n: 1, reset: now + 60_000 })
    return false
  }
  return ++h.n > 90
}

const originOf = (req: PayloadRequest) => {
  const origin = req.headers.get('origin')
  if (origin && origin !== 'null') return origin.toLowerCase()
  try {
    return new URL(req.headers.get('referer') || '').origin.toLowerCase()
  } catch {
    return ''
  }
}

const header = (req: PayloadRequest, name: string) => {
  const v = req.headers.get(name)
  if (!v) return null
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

const allowed = (type: string, s: TrackingSettings) => {
  if (type === 'view') return true
  if (type === 'vital') return s.vitals
  if (type === 'game') return s.game
  return s.clicks
}

const placeOf = (city: string | null, country: string | null) => {
  let name = country
  try {
    if (country) name = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) ?? country
  } catch {}
  return [city, name].filter(Boolean).join(', ') || 'Somewhere'
}

const sweep = async (req: PayloadRequest, days: number) => {
  const cutoff = new Date(Date.now() - days * 86_400_000).toISOString()
  await rows(req.payload, sql`DELETE FROM ${tables.events} WHERE created_at < ${cutoff}`)
  await rows(req.payload, sql`DELETE FROM ${tables.visits} WHERE last_seen_at < ${cutoff}`)
  await rows(req.payload, sql`DELETE FROM ${tables.errors} WHERE last_seen < ${cutoff}`)
}

// Receives batched beacons from the portfolio. Always answers 204 so the site never waits on it or sees errors.
export const postcard: PayloadHandler = async (req) => {
  try {
    const settings = await trackingSettings(req.payload)
    if (!settings.enabled || !settings.origins.includes(originOf(req))) return done()

    const ua = req.headers.get('user-agent') || ''
    if (isBot(ua)) return done()

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
    if (limited(ip)) return done()

    const raw = (await req.text?.()) ?? ''
    if (!raw || raw.length > MAX_BODY) return done()
    const body = JSON.parse(raw) as Json
    const sid = str(body.sid, 64)
    if (!sid || !/^[\w-]{8,64}$/.test(sid)) return done()

    const start = (body.start ?? {}) as Json
    const now = Date.now()
    const events = (Array.isArray(body.events) ? body.events : [])
      .slice(0, MAX_EVENTS)
      .map((e: Json) => ({
        type: str(e.type, 24),
        target: str(e.target, 200),
        label: str(e.label, 200),
        path: str(e.path, 300),
        value: typeof e.value === 'number' && Number.isFinite(e.value) ? e.value : null,
        meta: e.meta && typeof e.meta === 'object' && JSON.stringify(e.meta).length <= 2000 ? JSON.stringify(e.meta) : null,
        at: new Date(now - int(e.ago, 600_000)).toISOString(),
      }))
      .filter((e) => e.type && /^[a-z][a-z0-9-]*$/.test(e.type) && allowed(e.type, settings))

    const views = events.filter((e) => e.type === 'view').length
    const actions = events.filter((e) => e.type !== 'view' && e.type !== 'vital').length
    const switched = [...events].reverse().find((e) => e.type === 'style')?.target ?? null

    const screen = str(start.screen, 20)
    const agent = parseAgent(ua, screen ?? undefined)
    const country = header(req, 'x-vercel-ip-country')
    const city = header(req, 'x-vercel-ip-city')
    const source = str(start.source, 120)
    const label = `${placeOf(city, country)} · ${source ?? 'direct'} · ${agent.device}`
    const day = new Date().toISOString().slice(0, 10)
    const visitor = hash(process.env.PAYLOAD_SECRET || '', day, ip, ua).slice(0, 16)
    const duration = int(body.duration, 86_400)

    const [visit] = await rows<{ id: number }>(
      req.payload,
      sql`INSERT INTO ${tables.visits} AS v
        (sid, visitor, label, started_at, last_seen_at, duration, views, actions, "returning", landing, source, referrer,
         country, region, city, device, browser, os, screen, language, timezone, style, updated_at, created_at)
      VALUES (${sid}, ${visitor}, ${label}, now(), now(), ${duration}, ${views}, ${actions},
         EXISTS (SELECT 1 FROM ${tables.visits} p WHERE p.visitor = ${visitor} AND p.sid <> ${sid}),
         ${str(start.path, 300)}, ${source}, ${str(start.referrer, 300)}, ${country}, ${header(req, 'x-vercel-ip-country-region')}, ${city},
         ${agent.device}, ${agent.browser}, ${agent.os}, ${screen}, ${str(start.language, 20)}, ${str(start.timezone, 60)}, ${switched ?? str(start.style, 20)},
         now(), now())
      ON CONFLICT (sid) DO UPDATE SET
        last_seen_at = now(),
        updated_at = now(),
        duration = GREATEST(COALESCE(v.duration, 0), EXCLUDED.duration),
        views = COALESCE(v.views, 0) + EXCLUDED.views,
        actions = COALESCE(v.actions, 0) + EXCLUDED.actions,
        style = COALESCE(${switched}, v.style)
      RETURNING id`,
    )

    if (visit && events.length) {
      const values = events.map(
        (e) =>
          sql`(${visit.id}, ${e.type}, ${e.target}, ${e.label}, ${e.path}, ${e.value}, ${e.meta}::jsonb, ${e.at}, ${e.at})`,
      )
      await rows(
        req.payload,
        sql`INSERT INTO ${tables.events} (visit_id, type, target, label, path, value, meta, created_at, updated_at) VALUES ${sql.join(values, sql`, `)}`,
      )
    }

    if (settings.errors && Array.isArray(body.errors)) {
      for (const e of body.errors.slice(0, 10) as Json[]) {
        const message = str(e.message, 500)
        if (!message) continue
        const kind = str(e.kind, 20) ?? 'js'
        const stack = str(e.stack, 4000)
        const fingerprint = hash(kind, message, (stack ?? '').split('\n')[1] ?? '').slice(0, 32)
        await rows(
          req.payload,
          sql`INSERT INTO ${tables.errors} AS x (fingerprint, message, kind, count, first_seen, last_seen, path, browser, stack, resolved, updated_at, created_at)
          VALUES (${fingerprint}, ${message}, ${kind}, 1, now(), now(), ${str(e.path, 300)}, ${agent.browser}, ${stack}, false, now(), now())
          ON CONFLICT (fingerprint) DO UPDATE SET
            count = COALESCE(x.count, 0) + 1, last_seen = now(), updated_at = now(), resolved = false,
            path = EXCLUDED.path, browser = EXCLUDED.browser, stack = COALESCE(EXCLUDED.stack, x.stack)`,
        )
      }
    }

    if (Math.random() < 0.01) await sweep(req, settings.retention)
  } catch (err) {
    req.payload.logger.warn({ err, msg: 'portfolio postcard dropped' })
  }
  return done()
}
