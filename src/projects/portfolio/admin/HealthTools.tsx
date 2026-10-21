'use client'

import React, { useState } from 'react'

import type { LinkResult } from '../monitoring/links'

const icons = { ok: '✓', warn: '!', broken: '✕' }
const badge = { ok: 'good', warn: 'warn', broken: 'bad' }
const words = { ok: 'Works', warn: 'Check', broken: 'Broken' }

export const LinkCheck = () => {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'failed'>('idle')
  const [links, setLinks] = useState<LinkResult[]>([])

  const run = async () => {
    setState('running')
    try {
      const res = await fetch('/api/portfolio/links', { credentials: 'include' })
      if (!res.ok) throw new Error(String(res.status))
      setLinks(((await res.json()) as { links: LinkResult[] }).links)
      setState('done')
    } catch {
      setState('failed')
    }
  }

  const broken = links.filter((l) => l.state === 'broken').length
  const warn = links.filter((l) => l.state === 'warn').length

  return (
    <>
      <div className="pi-actions">
        <button type="button" className="pi-btn solid" onClick={run} disabled={state === 'running'}>
          {state === 'running' ? 'Checking every link…' : state === 'done' ? 'Check again' : 'Check all links'}
        </button>
      </div>
      {state === 'failed' && <p className="pi-note" style={{ marginTop: 10 }}>The check could not run. Try again in a minute.</p>}
      {state === 'done' && (
        <>
          <p className="pi-note" style={{ marginTop: 10 }}>
            {links.length} links checked · {broken ? `${broken} broken` : 'none broken'}
            {warn ? ` · ${warn} to look at` : ''}
          </p>
          <ul className="pi-checks">
            {links.map((l) => (
              <li key={l.href}>
                <span className={`pi-badge st ${badge[l.state]}`}>
                  <i aria-hidden="true">{icons[l.state]}</i>
                  {words[l.state]}
                </span>
                <span className="nm">
                  <a href={l.href.startsWith('/') ? undefined : l.href} target="_blank" rel="noreferrer">
                    {l.href}
                  </a>
                </span>
                <span className="dt">
                  {l.note}
                  {l.status ? ` · ${l.status}` : ''} · {l.where.join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export const Rebuild = ({ ready }: { ready: boolean }) => {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'failed'>('idle')
  const go = async () => {
    setState('busy')
    try {
      const res = await fetch('/api/portfolio/rebuild', { method: 'POST', credentials: 'include' })
      setState(res.ok ? 'done' : 'failed')
    } catch {
      setState('failed')
    }
  }
  return (
    <div className="pi-actions">
      <button type="button" className="pi-btn" onClick={go} disabled={!ready || state === 'busy'}>
        {state === 'busy' ? 'Starting…' : 'Rebuild the portfolio'}
      </button>
      {state === 'done' && <span className="pi-note" style={{ margin: 0, alignSelf: 'center' }}>Started. The new build is live in about a minute.</span>}
      {state === 'failed' && <span className="pi-note" style={{ margin: 0, alignSelf: 'center' }}>Vercel did not accept the request.</span>}
    </div>
  )
}
