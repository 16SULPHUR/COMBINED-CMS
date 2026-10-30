import Link from 'next/link'
import type { Payload } from 'payload'
import React from 'react'

import { pulse } from '../monitoring/insights'
import { Spark } from './charts'
import './insights.css'

export const Pulse = async ({ payload }: { payload: Payload }) => {
  const data = await pulse(payload).catch(() => null)
  if (!data) return null
  return (
    <div className="pi pi-pulse">
      <div className="pi-head">
        <div>
          <h2 style={{ fontSize: 18 }}>Portfolio</h2>
          <p className="pi-sub" style={{ marginTop: 0 }}>
            Visits are counted without cookies.
          </p>
        </div>
        <div className="pi-actions">
          <Link href="/admin/portfolio/insights" prefetch={false}>
            Insights
          </Link>
          <Link href="/admin/portfolio/health" prefetch={false}>
            Health
          </Link>
          <Link href="/admin/globals/portfolio-site" prefetch={false}>
            Site settings
          </Link>
        </div>
      </div>
      <div className="pi-kpis">
        <div className="pi-tile">
          <div className="k">Visitors today</div>
          <div className="v">{data.today}</div>
        </div>
        <div className="pi-tile">
          <div className="k">On the site now</div>
          <div className="v">
            {data.live > 0 && <span className="pi-live" aria-hidden="true" />}
            {data.live}
          </div>
        </div>
        <div className="pi-tile">
          <div className="k">Visits in 7 days</div>
          <div className="v">{data.week}</div>
          <Spark values={data.days.map((d) => d.n)} label="Visits per day over the last two weeks" />
        </div>
        <div className="pi-tile">
          <div className="k">Open site errors</div>
          <div className="v">{data.errors}</div>
          {data.errors > 0 && (
            <div className="d">
              <Link href="/admin/collections/portfolio-errors?where[resolved][not_equals]=true" prefetch={false}>
                Look at them
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
