const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|preview|facebookexternalhit|embedly|curl|wget|python|axios|node-fetch|go-http|java\//i

export const isBot = (ua: string) => !ua || BOT.test(ua)

const version = (ua: string, re: RegExp) => ua.match(re)?.[1]?.split('.')[0]

const browserOf = (ua: string) => {
  const checks: [string, RegExp][] = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /(?:OPR|Opera)\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/],
  ]
  for (const [name, re] of checks) {
    const v = version(ua, re)
    if (v) return `${name} ${v}`
  }
  return 'Other'
}

const osOf = (ua: string) => {
  if (/iPad/.test(ua)) return 'iPadOS'
  if (/iPhone|iPod/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/CrOS/.test(ua)) return 'ChromeOS'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Mac OS X|Macintosh/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Other'
}

export const parseAgent = (ua: string, screen?: string) => {
  const os = osOf(ua)
  const width = Number(screen?.split('x')[0]) || 0
  const tablet = os === 'iPadOS' || (/Android/.test(ua) && !/Mobile/.test(ua)) || /Tablet/.test(ua)
  const mobile = !tablet && (/Mobi|iPhone|Android/.test(ua) || (width > 0 && width < 600))
  return { browser: browserOf(ua), os, device: tablet ? 'tablet' : mobile ? 'mobile' : 'desktop' }
}
