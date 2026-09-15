import { useState } from 'react'
import { AGES, GENDERS, sum, fmt } from './data.js'

const COLORS = { F: 'var(--color-series-1)', M: 'var(--color-series-2)', U: 'var(--color-series-3)' }
const W = 520, H = 230, PL = 40, PR = 10, PT = 26, PB = 26

// แกน Y ปัดขึ้นเป็นเลขสวย (1, 2, 4, 5, 8 × 10^n) ที่หารเป็น 4 ช่วงได้ลงตัว
function niceCeil(v) {
  if (v <= 0) return 4
  const mag = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 2, 4, 5, 8, 10]) if (m * mag >= v) return m * mag
  return 10 * mag
}
const tickLabel = (t) => (t >= 1000 ? `${+(t / 1000).toFixed(2)}K` : Math.round(t))

export default function AgeGenderChart({ byAge }) {
  const [tip, setTip] = useState(null)
  const totals = AGES.map((a) => sum(byAge[a]))
  const max = Math.max(1, ...totals)
  const niceMax = niceCeil(max)
  const slot = (W - PL - PR) / AGES.length
  const barW = Math.min(46, slot * 0.62)
  const y = (v) => PT + (1 - v / niceMax) * (H - PT - PB)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t)
  const maxIdx = totals.indexOf(max)

  const enter = (e, label, v) => {
    const r = e.currentTarget.closest('svg').getBoundingClientRect()
    setTip({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, label, v })
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="New customers by age band and gender (synthetic data)" onMouseLeave={() => setTip(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" />
            <text x={PL - 6} y={y(t)} dy="0.35em" textAnchor="end" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{tickLabel(t)}</text>
          </g>
        ))}
        {AGES.map((a, i) => {
          const cx = PL + slot * i + slot / 2
          let acc = 0
          return (
            <g key={a}>
              {GENDERS.map((g, j) => {
                const v = byAge[a][g.key]
                const y0 = y(acc + v), y1 = y(acc)
                acc += v
                const h = Math.max(0, y1 - y0 - (j < GENDERS.length - 1 ? 2 : 0))
                const top = acc === totals[i]
                return (
                  <rect key={g.key} x={cx - barW / 2} y={y0} width={barW} height={h} rx={top ? 4 : 0} fill={COLORS[g.key]}
                        onMouseMove={(e) => enter(e, `${a} · ${g.label}`, v)} />
                )
              })}
              {/* direct label on the tallest band only; the rest are on hover */}
              {i === maxIdx && totals[i] > 0 && (
                <text x={cx} y={y(totals[i]) - 8} textAnchor="middle" fontSize="11" fill="var(--color-fg)" fontFamily="var(--font-mono)">{fmt(totals[i])}</text>
              )}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{a}</text>
            </g>
          )
        })}
      </svg>
      {tip && (
        <div className="viz-tip" style={{ left: `${tip.x}%`, top: `${tip.y}%` }}>
          <span className="text-muted">{tip.label}</span><span className="ml-2 font-medium">{fmt(tip.v)}</span>
        </div>
      )}
      <ul className="mono mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted" aria-label="Legend">
        {GENDERS.map((g) => (
          <li key={g.key} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[g.key] }} />{g.label}</li>
        ))}
      </ul>
    </div>
  )
}
