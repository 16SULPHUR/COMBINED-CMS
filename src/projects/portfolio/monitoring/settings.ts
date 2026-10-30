import type { Payload } from 'payload'

export type TrackingSettings = {
  enabled: boolean
  clicks: boolean
  game: boolean
  vitals: boolean
  errors: boolean
  retention: number
  origins: string[]
}

export const defaultOrigins = ['https://ankit.varietyheaven.in', 'https://ankit.ninja', 'http://localhost:5173', 'http://localhost:8080']

let cache: { at: number; value: TrackingSettings } | undefined

export const trackingSettings = async (payload: Payload): Promise<TrackingSettings> => {
  if (cache && Date.now() - cache.at < 60_000) return cache.value
  const site = await payload.findGlobal({ slug: 'portfolio-site', depth: 0 }).catch(() => undefined)
  const t = site?.tracking ?? {}
  const value: TrackingSettings = {
    enabled: t.enabled ?? true,
    clicks: t.clicks ?? true,
    game: t.game ?? true,
    vitals: t.vitals ?? true,
    errors: t.errors ?? true,
    retention: t.retention ?? 365,
    origins: (t.origins?.length ? t.origins : defaultOrigins).map((o) => o.trim().replace(/\/+$/, '').toLowerCase()),
  }
  cache = { at: Date.now(), value }
  return value
}
