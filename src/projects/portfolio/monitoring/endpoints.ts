import type { Endpoint, PayloadHandler } from 'payload'

import { databaseCheck } from './health'
import { checkLinks } from './links'
import { postcard } from './postcard'

const noStore = { 'cache-control': 'no-store' }

const adminOnly =
  (handler: PayloadHandler): PayloadHandler =>
  async (req) =>
    req.user ? handler(req) : Response.json({ error: 'Log in to the CMS first' }, { status: 401, headers: noStore })

export const deployHookConfigured = () => Boolean(process.env.PORTFOLIO_DEPLOY_HOOK)

export const endpoints: Endpoint[] = [
  { path: '/portfolio/postcard', method: 'post', handler: postcard },
  {
    path: '/portfolio/status',
    method: 'get',
    handler: async (req) => {
      const db = await databaseCheck(req.payload)
      return Response.json({ ok: db.state !== 'down', db: db.ms ?? null }, { status: db.state === 'down' ? 503 : 200, headers: noStore })
    },
  },
  {
    path: '/portfolio/links',
    method: 'get',
    handler: adminOnly(async (req) => Response.json({ checkedAt: new Date().toISOString(), links: await checkLinks(req.payload) }, { headers: noStore })),
  },
  {
    path: '/portfolio/rebuild',
    method: 'post',
    handler: adminOnly(async () => {
      const hook = process.env.PORTFOLIO_DEPLOY_HOOK
      if (!hook) return Response.json({ ok: false, error: 'PORTFOLIO_DEPLOY_HOOK is not set' }, { status: 400, headers: noStore })
      const res = await fetch(hook, { method: 'POST' })
      return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502, headers: noStore })
    }),
  },
]
