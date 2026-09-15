import { useState } from 'react'
import { PROVINCES, MAP_W, MAP_H } from '../data/thailand.js'
import { sum, fmt } from './data.js'

// sequential ramp — one hue (cyan), low → high, stepped for the dark surface
const RAMP = ['var(--ramp-1)', 'var(--ramp-2)', 'var(--ramp-3)', 'var(--ramp-4)', 'var(--ramp-5)']

export default function ThailandMap({ byProvince, filters, onPick }) {
  const [tip, setTip] = useState(null)
  const values = PROVINCES.map((p) => sum(byProvince.get(p.id) ?? { F: 0, M: 0, U: 0 }))
  const max = Math.max(1, ...values)
  const step = (v) => (v <= 0 ? null : RAMP[Math.min(RAMP.length - 1, Math.floor(Math.sqrt(v / max) * RAMP.length))])

  return (
    <div className="relative h-full min-h-[360px]">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" role="img" aria-label="New customers by province (synthetic data)"
           onMouseLeave={() => setTip(null)}>
        {PROVINCES.map((p, i) => {
          const v = values[i]
          const fill = step(v)
          const picked = filters.provinces.has(p.id)
          return (
            <path
              key={p.id}
              d={p.d}
              fill={fill ?? 'var(--color-surface-2)'}
              stroke={picked ? 'var(--color-fg)' : 'var(--color-bg)'}
              strokeWidth={picked ? 1.5 : 0.6}
              className="cursor-pointer transition-[opacity] hover:opacity-80"
              onMouseMove={(e) => {
                const r = e.currentTarget.closest('svg').getBoundingClientRect()
                setTip({ x: e.clientX - r.left, y: e.clientY - r.top, name: p.th, v })
              }}
              onClick={() => onPick(p.id)}
            />
          )
        })}
      </svg>
      {tip && (
        <div className="viz-tip" style={{ left: tip.x, top: tip.y }}>
          <span className="text-muted">{tip.name}</span>
          <span className="ml-2 font-medium">{fmt(tip.v)}</span>
        </div>
      )}
      <div className="mono absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-muted">
        <span>0</span>
        {RAMP.map((c) => <span key={c} className="h-2 w-5 first:rounded-l last:rounded-r" style={{ background: c }} />)}
        <span>{fmt(max)}</span>
      </div>
    </div>
  )
}
