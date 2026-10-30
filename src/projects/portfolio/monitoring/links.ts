import type { Payload } from 'payload'

const SITE_PATHS = ['/', '/resume', '/cards', '/island']

export type LinkResult = {
  href: string
  where: string[]
  state: 'ok' | 'warn' | 'broken'
  status: number | null
  note: string
  ms: number
}

type Href = string | null | undefined
type Link = { label?: Href; href?: Href } | null | undefined

export const collectLinks = async (payload: Payload) => {
  const found = new Map<string, Set<string>>()
  const add = (href: Href, where: string) => {
    const h = href?.trim()
    if (!h) return
    if (!found.has(h)) found.set(h, new Set())
    found.get(h)!.add(where)
  }
  const each = (list: Link[] | null | undefined, where: string) => list?.forEach((l) => add(l?.href, `${where} · ${l?.label ?? 'link'}`))

  const [profile, contact, resume, site, projects, articles] = await Promise.all([
    payload.findGlobal({ slug: 'portfolio-profile', depth: 0 }),
    payload.findGlobal({ slug: 'portfolio-contact', depth: 0 }),
    payload.findGlobal({ slug: 'portfolio-resume', depth: 0 }),
    payload.findGlobal({ slug: 'portfolio-site', depth: 0 }),
    payload.find({ collection: 'portfolio-projects', depth: 0, limit: 500, pagination: false }),
    payload.find({ collection: 'portfolio-articles', depth: 0, limit: 500, pagination: false }),
  ])

  each(profile.links, 'Profile')
  profile.now?.forEach((n) => add(n.href, `Profile · now · ${n.label}`))
  each(contact.links, 'Contact')
  if (contact.email) add(`mailto:${contact.email}`, 'Contact · email')
  each(resume.contact, 'Resume · contact')
  resume.experience?.forEach((e) => {
    add(e.href, `Resume · ${e.org}`)
    e.points?.forEach((p) => add(p.link?.href, `Resume · ${e.org} · bullet`))
  })
  resume.projects?.forEach((p) => {
    add(p.link?.href, `Resume · ${p.name}`)
    p.points?.forEach((pt) => add(pt.link?.href, `Resume · ${p.name} · bullet`))
  })
  if (site.banner?.show) add(site.banner.linkHref, 'Site settings · banner')
  projects.docs.forEach((p) => each(p.links, `Project · ${p.name}${p.hidden ? ' (hidden)' : ''}`))
  articles.docs.forEach((a) => add(a.href, `Article · ${a.title}${a.hidden ? ' (hidden)' : ''}`))

  return [...found].map(([href, where]) => ({ href, where: [...where] }))
}

const fetchWithTimeout = async (url: string, method: 'GET' | 'HEAD') => {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; AnkitCMS link check)', accept: 'text/html,*/*' },
    })
  } finally {
    clearTimeout(timer)
  }
}

const check = async (href: string): Promise<Omit<LinkResult, 'where'>> => {
  const t0 = Date.now()
  const result = (state: LinkResult['state'], status: number | null, note: string) => ({ href, state, status, note, ms: Date.now() - t0 })

  if (href.startsWith('mailto:')) {
    return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href) ? result('ok', null, 'Email address looks right') : result('broken', null, 'Email address looks wrong')
  }
  if (href.startsWith('/')) {
    return SITE_PATHS.includes(href.split(/[?#]/)[0]) ? result('ok', null, 'Page on the portfolio') : result('warn', null, 'Not a page the portfolio knows')
  }
  if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) return result('broken', null, 'Missing https:// at the start')
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return result('broken', null, 'Not a valid address')
  }
  if (!/^https?:$/.test(url.protocol)) return result('warn', null, `${url.protocol} link, not checked`)
  const bad = url.hostname.match(/[^a-z0-9.-]/i)
  if (bad) return result('broken', null, `Typo in the address: "${bad[0]}" in ${url.hostname}`)
  if (!url.hostname.includes('.') && url.hostname !== 'localhost') return result('broken', null, 'Address has no domain')

  try {
    let res = await fetchWithTimeout(url.href, 'HEAD')
    if ([400, 403, 405, 501].includes(res.status)) res = await fetchWithTimeout(url.href, 'GET')
    const moved = res.url && res.url !== url.href ? ` → ${res.url}` : ''
    if (res.status === 999) return result('warn', res.status, 'LinkedIn blocks automatic checks')
    if (res.ok) return result(url.protocol === 'http:' ? 'warn' : 'ok', res.status, url.protocol === 'http:' ? `Works, but not https${moved}` : `OK${moved}`)
    if (res.status === 403 || res.status === 429) return result('warn', res.status, 'The site refused the check; open it to be sure')
    return result('broken', res.status, `${res.status} ${res.statusText}`.trim())
  } catch (err) {
    const reason = err instanceof Error && err.name === 'AbortError' ? 'Timed out after 8s' : 'Could not reach the site'
    return result('broken', null, reason)
  }
}

export const checkLinks = async (payload: Payload): Promise<LinkResult[]> => {
  const links = await collectLinks(payload)
  const out: LinkResult[] = []
  for (let i = 0; i < links.length; i += 6) {
    const batch = await Promise.all(links.slice(i, i + 6).map(async (l) => ({ ...(await check(l.href)), where: l.where })))
    out.push(...batch)
  }
  const order = { broken: 0, warn: 1, ok: 2 }
  return out.sort((a, b) => order[a.state] - order[b.state])
}
