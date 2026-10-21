import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { portfolioUrl } from '../fields'
import { loadInsights, RANGES, rangeOf, TIMEZONE, type Insights as Data, type RangeKey } from '../monitoring/insights'
import { Columns, type Point } from './charts'
import { ago, Bars, Card, compact, Delta, Empty, Page, seconds, Stats, Tile } from './ui'

const HOUR = 3_600_000
const DAY = 24 * HOUR

const buckets = (data: Data, range: RangeKey): Point[] => {
  const byKey = new Map(data.series.map((s) => [s.at, s.visits]))
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, ...opts }).format(d)
  const keyOf = (d: Date, hourly: boolean) => {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
        .formatToParts(d)
        .map((p) => [p.type, p.value]),
    )
    return `${parts.year}-${parts.month}-${parts.day}T${hourly ? parts.hour : '00'}:00`
  }
  if (range === 'today') {
    const out: Point[] = []
    for (let t = data.from.getTime(); t <= Date.now(); t += HOUR) {
      const d = new Date(t)
      out.push({ value: byKey.get(keyOf(d, true)) ?? 0, tick: fmt(d, { hour: 'numeric', hour12: true }), label: fmt(d, { hour: 'numeric', minute: '2-digit', hour12: true }) })
    }
    return out
  }
  const out: Point[] = []
  for (let t = data.from.getTime(); t <= Date.now(); t += DAY) {
    const d = new Date(t)
    out.push({ value: byKey.get(keyOf(d, false)) ?? 0, tick: fmt(d, { day: 'numeric', month: 'short' }), label: fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }) })
  }
  return out
}

const VITALS: { key: string; name: string; unit: 'ms' | ''; good: number; poor: number; what: string }[] = [
  { key: 'LCP', name: 'Largest paint', unit: 'ms', good: 2500, poor: 4000, what: 'when the main content shows' },
  { key: 'INP', name: 'Response to taps', unit: 'ms', good: 200, poor: 500, what: 'delay after a click or tap' },
  { key: 'CLS', name: 'Layout shift', unit: '', good: 0.1, poor: 0.25, what: 'how much things jump around' },
  { key: 'FCP', name: 'First paint', unit: 'ms', good: 1800, poor: 3000, what: 'first pixels on screen' },
  { key: 'TTFB', name: 'Server answer', unit: 'ms', good: 800, poor: 1800, what: 'time to the first byte' },
]

const Vitals = ({ vitals }: { vitals: Data['vitals'] }) => (
  <div className="pi-vitals">
    {VITALS.map((v) => {
      const m = vitals[v.key]
      const state = !m ? 'none' : m.p75 <= v.good ? 'good' : m.p75 <= v.poor ? 'warn' : 'bad'
      const text = { none: 'No data yet', good: 'Good', warn: 'Needs work', bad: 'Poor' }[state]
      const icon = { none: '–', good: '✓', warn: '!', bad: '✕' }[state]
      const value = !m ? '–' : v.unit === 'ms' ? (m.p75 >= 1000 ? `${(m.p75 / 1000).toFixed(1)} s` : `${Math.round(m.p75)} ms`) : m.p75.toFixed(2)
      return (
        <div className="pi-vital" key={v.key} title={`${v.key}: ${v.what}. 75% of visits were at or under this.`}>
          <div className="k">{v.name}</div>
          <div className="v">{value}</div>
          <div className={`pi-badge ${state}`}>
            <i aria-hidden="true">{icon}</i>
            {text}
          </div>
        </div>
      )
    })}
  </div>
)

const Funnel = ({ game }: { game: Data['game'] }) => {
  const steps = [
    { label: 'Started the game', n: game.start },
    { label: 'Befriended a project creature', n: game.befriend },
    { label: 'Fixed a bug', n: game.bug },
    { label: 'Won a battle', n: game.win },
    { label: 'Helped Moss grow', n: game.grow },
    { label: 'Finished the island', n: game.finish },
  ]
  if (!game.start) return <Empty>No island games played in this period.</Empty>
  return (
    <>
      <Bars items={steps.map((s) => ({ name: s.label, label: s.label, n: s.n, visits: s.n }))} total={game.start} />
      {game.takeAlong > 0 && <p className="pi-note" style={{ marginTop: 10 }}>{game.takeAlong} took Moss along in a floating window.</p>}
    </>
  )
}

const StyleSplit = ({ styles, switches }: { styles: Data['styles']; switches: number }) => {
  const total = styles.reduce((s, x) => s + x.n, 0)
  if (!total) return <Empty />
  const colors: Record<string, string> = { cards: 'var(--pi-s1)', island: 'var(--pi-s2)' }
  const names: Record<string, string> = { cards: 'Cards', island: 'Island' }
  return (
    <>
      <div className="pi-split" role="img" aria-label={styles.map((s) => `${names[s.name] ?? s.name} ${Math.round((s.n / total) * 100)}%`).join(', ')}>
        {styles.map((s) => (
          <span key={s.name} style={{ width: `${(s.n / total) * 100}%`, background: colors[s.name] ?? 'var(--pi-axis)' }} />
        ))}
      </div>
      <ul className="pi-legend">
        {styles.map((s) => (
          <li key={s.name}>
            <i style={{ background: colors[s.name] ?? 'var(--pi-axis)' }} />
            {names[s.name] ?? s.name} · {s.n.toLocaleString('en')} visits ({Math.round((s.n / total) * 100)}%)
          </li>
        ))}
      </ul>
      <p className="pi-note" style={{ marginTop: 10 }}>
        {switches ? `${switches.toLocaleString('en')} switches between the two styles.` : 'Nobody switched styles yet.'}
      </p>
    </>
  )
}

export const Insights = async (props: AdminViewServerProps) => {
  const { initPageResult, searchParams } = props
  const range = rangeOf(searchParams?.range)
  const period = range === 'today' ? 'day' : RANGES[range].label
  const user = initPageResult.req.user
  const data = user ? await loadInsights(initPageResult.req.payload, range) : null

  return (
    <Page props={props}>
      <div className="pi-head">
        <div>
          <h1>Portfolio insights</h1>
          <p className="pi-sub">
            Visits to {portfolioUrl().replace(/^https?:\/\//, '')}, times in {TIMEZONE}. No cookies or IP addresses are stored.
          </p>
        </div>
        <nav className="pi-ranges" aria-label="Time range">
          {(Object.keys(RANGES) as RangeKey[]).map((key) => (
            <Link key={key} href={`?range=${key}`} aria-current={key === range ? 'page' : undefined} prefetch={false}>
              {RANGES[key].label}
            </Link>
          ))}
        </nav>
      </div>

      {data && (
        <>
          <div className="pi-kpis">
            <Tile label="Visitors" value={compact(data.kpi.visitors.now)}>
              <Delta {...data.kpi.visitors} period={period} />
            </Tile>
            <Tile label="Visits" value={compact(data.kpi.visits.now)}>
              <Delta {...data.kpi.visits} period={period} />
              {data.kpi.returning > 0 && <div className="d">{data.kpi.returning} came back later the same day</div>}
            </Tile>
            <Tile label="Page views" value={compact(data.kpi.views.now)}>
              <Delta {...data.kpi.views} period={period} />
            </Tile>
            <Tile label="Typical visit" value={seconds(data.kpi.median.now)}>
              <Delta {...data.kpi.median} period={period} />
              {data.kpi.quiet > 0 && <div className="d">{data.kpi.quiet} left without opening anything</div>}
            </Tile>
            <Tile
              label="On the site now"
              value={
                <>
                  {data.kpi.live > 0 && <span className="pi-live" aria-hidden="true" />}
                  {data.kpi.live}
                </>
              }
            >
              <div className="d">active in the last 5 minutes</div>
            </Tile>
          </div>

          <div className="pi-grid">
            <Card title={range === 'today' ? 'Visits by hour' : 'Visits per day'} wide>
              <Columns points={buckets(data, range)} unit="visits" />
              <details>
                <summary>Show as a table</summary>
                <div className="pi-scroll">
                  <table className="pi-table">
                    <thead>
                      <tr>
                        <th>{range === 'today' ? 'Hour' : 'Day'}</th>
                        <th>Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buckets(data, range).map((p) => (
                        <tr key={p.label}>
                          <td>{p.label}</td>
                          <td className="n">{p.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </Card>

            <Card title="Where they came from" note="Links with ?ref= or ?utm_source= are named after that tag.">
              <Bars items={data.sources} total={data.kpi.visits.now} />
            </Card>
            <Card title="Countries">
              <Bars items={data.countries} total={data.kpi.visits.now} />
            </Card>
            <Card title="Cities">
              <Bars items={data.cities} total={data.kpi.visits.now} />
            </Card>
            <Card title="What they opened" note="Cards, projects and the projects line.">
              <Bars items={data.opened} unit="times" />
            </Card>
            <Card title="Links they followed">
              <Bars items={data.links} unit="clicks" />
            </Card>
            <Card title="Resume and contact">
              <Stats
                items={[
                  ...['open', 'share', 'download'].map((t) => ({
                    label: { open: 'Resume opened', share: 'Resume shared', download: 'Resume downloaded' }[t]!,
                    value: (data.resume.find((r) => r.name === t)?.n ?? 0).toLocaleString('en'),
                  })),
                  { label: 'Email copied', value: (data.contact.find((c) => c.name === 'copy-email')?.n ?? 0).toLocaleString('en') },
                ]}
              />
            </Card>
            <Card title="Cards or island" note="Which style visits ended up in.">
              <StyleSplit styles={data.styles} switches={data.switches} />
            </Card>
            <Card title="Island game">
              <Funnel game={data.game} />
            </Card>
            <Card title="Devices">
              <Bars items={data.devices} total={data.kpi.visits.now} />
              <div className="pi-section">
                <h2>Browsers</h2>
                <Bars items={data.browsers} total={data.kpi.visits.now} />
              </div>
            </Card>
            <Card title="Operating systems">
              <Bars items={data.systems} total={data.kpi.visits.now} />
              <div className="pi-section">
                <h2>Landing pages</h2>
                <Bars items={data.pages} total={data.kpi.visits.now} />
              </div>
            </Card>
            <Card title="Sound and sky">
              <Stats
                items={[
                  {
                    label: 'of visits muted the music',
                    value: data.music.visits ? `${Math.round((data.music.muted / data.music.visits) * 100)}%` : '–',
                  },
                  { label: 'clock changes', value: data.clock.reduce((s, c) => s + c.n, 0).toLocaleString('en') },
                ]}
              />
              {data.clock.length > 0 && (
                <div className="pi-section">
                  <Bars items={data.clock} unit="picks" />
                </div>
              )}
            </Card>
            <Card title="Page speed" note="75% of visits were at or under these numbers.">
              <Vitals vitals={data.vitals} />
            </Card>

            <Card title="Latest visits" wide>
              {data.recent.length ? (
                <div className="pi-scroll">
                  <table className="pi-table">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Who</th>
                        <th>Stayed</th>
                        <th>What they did</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((r) => (
                        <tr key={r.id}>
                          <td className="n">
                            <Link href={`/admin/collections/portfolio-visits/${r.id}`} prefetch={false}>
                              {ago(r.startedAt)}
                            </Link>
                          </td>
                          <td>
                            {r.label}
                            {r.returning ? ' · came back' : ''}
                          </td>
                          <td className="n">{seconds(r.duration)}</td>
                          <td className="trail">{r.trail || `Looked at ${r.landing ?? '/'}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty>No visits recorded yet. They show up here a few seconds after someone opens the site.</Empty>
              )}
            </Card>

            <Card title="Site errors" wide>
              {data.errors.length ? (
                <table className="pi-table">
                  <tbody>
                    {data.errors.map((e) => (
                      <tr key={e.id}>
                        <td>
                          <Link href={`/admin/collections/portfolio-errors/${e.id}`} prefetch={false}>
                            {e.message}
                          </Link>
                        </td>
                        <td className="n">{e.count}×</td>
                        <td className="n">{ago(e.lastSeen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty>No open errors. Nice.</Empty>
              )}
            </Card>
          </div>
        </>
      )}
    </Page>
  )
}
