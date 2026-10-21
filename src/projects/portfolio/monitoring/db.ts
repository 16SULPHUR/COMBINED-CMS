import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { sql, type SQL } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'

export { sql }

export const tables = {
  visits: sql.raw('"payload"."portfolio_visits"'),
  events: sql.raw('"payload"."portfolio_events"'),
  errors: sql.raw('"payload"."portfolio_errors"'),
}

export const rows = async <T = Record<string, unknown>>(payload: Payload, query: SQL): Promise<T[]> => {
  const res = await (payload.db as unknown as PostgresAdapter).drizzle.execute(query)
  return res.rows as T[]
}

export const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v))
