'use client'

import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react'

export type Point = { label: string; tick: string; value: number }

const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const niceMax = (max: number) => {
  if (max <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(max))
  const n = max / pow
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

const useWidth = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}

const columnPath = (x: number, y: number, w: number, base: number) => {
  const r = Math.min(4, w / 2, base - y)
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`
}

export const Columns = ({ points, unit, height = 180 }: { points: Point[]; unit: string; height?: number }) => {
  const { ref, width } = useWidth()
  const [active, setActive] = useState<number | null>(null)
  const left = 34
  const axis = 22
  const top = 8
  const plot = height - axis - top
  const max = niceMax(Math.max(0, ...points.map((p) => p.value)))
  const band = width > left ? (width - left) / Math.max(1, points.length) : 0
  const bw = Math.max(2, Math.min(24, band * 0.62))
  const yOf = (v: number) => top + plot - (v / max) * plot
  const every = Math.max(1, Math.ceil(points.length / 7))
  const base = top + plot

  const key = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    setActive((a) => Math.max(0, Math.min(points.length - 1, (a ?? points.length) + (e.key === 'ArrowLeft' ? -1 : 1))))
  }

  const tip = active !== null ? points[active] : null

  return (
    <div
      ref={ref}
      className="pi-chart"
      tabIndex={0}
      role="img"
      aria-label={`Column chart of ${unit}. Use the arrow keys to read each value.`}
      onKeyDown={key}
      onFocus={() => setActive((a) => a ?? points.length - 1)}
      onBlur={() => setActive(null)}
      onPointerLeave={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={height}>
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              {t > 0 && <line className="grid" x1={left} x2={width} y1={yOf(max * t)} y2={yOf(max * t)} />}
              <text className="tick" x={left - 8} y={yOf(max * t) + 4} textAnchor="end">
                {compact(max * t)}
              </text>
            </g>
          ))}
          <line className="base" x1={left} x2={width} y1={base} y2={base} />
          {points.map((p, i) => {
            const x = left + i * band + (band - bw) / 2
            const y = yOf(p.value)
            return (
              <g key={i} onPointerEnter={() => setActive(i)}>
                <rect x={left + i * band} y={top} width={band} height={plot + axis} fill="transparent" />
                {p.value > 0 && <path className={`bar${active === i ? ' on' : ''}`} d={columnPath(x, y, bw, base)} />}
                {i % every === 0 && (
                  <text className="tick" x={x + bw / 2} y={height - 6} textAnchor="middle">
                    {p.tick}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      )}
      {tip && active !== null && (
        <div className="pi-tip" style={{ left: left + active * band + band / 2, top: yOf(tip.value) }} aria-live="polite">
          <strong>
            {tip.value.toLocaleString('en')} {unit}
          </strong>
          {tip.label}
        </div>
      )}
    </div>
  )
}

export const Spark = ({ values, label }: { values: number[]; label: string }) => {
  const w = 120
  const h = 32
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? (w - 8) / (values.length - 1) : 0
  const pts = values.map((v, i) => [4 + i * step, h - 4 - (v / max) * (h - 8)] as const)
  const last = pts[pts.length - 1]
  return (
    <div className="pi-chart" role="img" aria-label={label} style={{ marginTop: 6 }}>
      <svg width={w} height={h}>
        {pts.length > 1 && <path className="spark" d={`M${pts.map(([x, y]) => `${x},${y}`).join('L')}`} />}
        {last && <circle cx={last[0]} cy={last[1]} r={4} fill="var(--pi-s1)" stroke="var(--pi-surface)" strokeWidth={2} />}
      </svg>
    </div>
  )
}
