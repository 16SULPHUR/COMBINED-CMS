import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { portfolioUrl } from '../fields'
import { deployHookConfigured } from '../monitoring/endpoints'
import { healthChecks, tableSizes, type Check } from '../monitoring/health'
import { num } from '../monitoring/db'
import { LinkCheck, Rebuild } from './HealthTools'
import { Card, compact, Page } from './ui'

const badge = { up: 'good', warn: 'warn', down: 'bad' }
const icons = { up: '✓', warn: '!', down: '✕' }
const words = { up: 'Up', warn: 'Slow or odd', down: 'Down' }

const Checks = ({ checks }: { checks: Check[] }) => (
  <ul className="pi-checks">
    {checks.map((c) => (
      <li key={c.name}>
        <span className={`pi-badge st ${badge[c.state]}`}>
          <i aria-hidden="true">{icons[c.state]}</i>
          {words[c.state]}
        </span>
        <span className="nm">{c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.name}</a> : c.name}</span>
        <span className="dt">{c.detail}</span>
      </li>
    ))}
  </ul>
)

export const Health = async (props: AdminViewServerProps) => {
  const payload = props.initPageResult.req.payload
  const [checks, sizes, errors] = props.initPageResult.req.user
    ? await Promise.all([
        healthChecks(payload),
        tableSizes(payload).catch(() => []),
        payload.count({ collection: 'portfolio-errors', where: { resolved: { not_equals: true } } }),
      ])
    : [[], [], { totalDocs: 0 }]
  const down = checks.filter((c) => c.state === 'down').length
  const names: Record<string, string> = { portfolio_visits: 'Visits', portfolio_events: 'Events', portfolio_errors: 'Site errors', media: 'Media' }

  return (
    <Page props={props}>
      <div className="pi-head">
        <div>
          <h1>Portfolio health</h1>
          <p className="pi-sub">
            {down ? `${down} of ${checks.length} checks are failing.` : `All ${checks.length} checks pass.`} Checked when this page loads.
          </p>
        </div>
        <div className="pi-actions">
          <Link href="/admin/portfolio/health" prefetch={false}>
            Check again
          </Link>
          <Link href="/admin/portfolio/insights" prefetch={false}>
            Insights
          </Link>
        </div>
      </div>

      <div className="pi-grid two">
        <Card title="Status" note={`The site is ${portfolioUrl()}.`}>
          <Checks checks={checks} />
        </Card>

        <Card title="Site errors" note="Errors visitors hit in their browser, grouped by message.">
          <div className="pi-stats">
            <div className="pi-stat">
              <div className="v">{errors.totalDocs}</div>
              <div className="k">open</div>
            </div>
          </div>
          <div className="pi-actions" style={{ marginTop: 12 }}>
            <Link href="/admin/collections/portfolio-errors?where[resolved][not_equals]=true" prefetch={false}>
              See open errors
            </Link>
          </div>
          <div className="pi-section">
            <h2>Stored data</h2>
            <table className="pi-table">
              <tbody>
                {sizes.map((s) => (
                  <tr key={s.name}>
                    <td>{names[s.name] ?? s.name}</td>
                    <td className="n">{compact(Math.max(0, num(s.rows)))} rows</td>
                    <td className="n">{(num(s.bytes) / 1024 / 1024).toFixed(1)} MB</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pi-note" style={{ marginTop: 8 }}>
              Old visits are removed after the number of days set in Site settings → Tracking.
            </p>
          </div>
        </Card>

        <Card title="Links on the portfolio" note="Every link in the profile, projects, articles, contact and resume, opened one by one." wide>
          <LinkCheck />
        </Card>

        <Card title="Rebuild" note="The first paint and the link previews are baked in when the site is built. Content changes show up without a rebuild; SEO changes need one." wide>
          <Rebuild ready={deployHookConfigured()} />
          {!deployHookConfigured() && (
            <p className="pi-note" style={{ marginTop: 10 }}>
              To turn this on, create a Deploy Hook for the portfolio in Vercel (Project → Settings → Git → Deploy Hooks) and add it to this CMS as the
              PORTFOLIO_DEPLOY_HOOK environment variable.
            </p>
          )}
        </Card>
      </div>
    </Page>
  )
}
