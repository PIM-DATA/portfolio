import { useState } from 'react'
import { C, useTip, Tip, DataTable, fmt } from './shared.jsx'

// ข้อมูลตัวอย่าง (illustrative) — จำนวนออเดอร์ต่องวด
const data = [8200, 8900, 8600, 9700, 10400, 9900, 11200, 11800, 11500, 12900, 13600, 14100].map((n, i) => ({
  round: `R${i + 1}`, n,
}))

const W = 320, H = 170, PL = 40, PR = 50, PT = 12, PB = 24
const max = 15000, min = 6000
const x = (i) => PL + (i / (data.length - 1)) * (W - PL - PR)
const y = (v) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB)
const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.n)}`).join(' ')
const last = data[data.length - 1]

export default function RoundsChart() {
  const { tip, show, hide } = useTip()
  const [active, setActive] = useState(null)

  const onMove = (e) => {
    const svg = e.currentTarget
    const r = svg.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.max(0, Math.min(data.length - 1, Math.round(((px - PL) / (W - PL - PR)) * (data.length - 1))))
    setActive(i)
    show({ x: (x(i) / W) * r.width, y: (y(data[i].n) / H) * r.height, label: data[i].round, value: `${fmt(data[i].n)} orders` })
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Orders per purchase round (sample data)"
           onMouseMove={onMove} onMouseLeave={() => { hide(); setActive(null) }}>
        {[8000, 10000, 12000, 14000].map((v) => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke={C.grid} strokeWidth="1" />
            <text x={PL - 6} y={y(v)} dy="0.35em" textAnchor="end" fontSize="9" fill={C.text} fontFamily="var(--font-mono)">{v / 1000}k</text>
          </g>
        ))}
        {data.map((d, i) => (i % 3 === 0 || i === data.length - 1) && (
          <text key={d.round} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill={C.text} fontFamily="var(--font-mono)">{d.round}</text>
        ))}
        {active !== null && <line x1={x(active)} x2={x(active)} y1={PT} y2={H - PB} stroke={C.text} strokeWidth="1" strokeDasharray="3 3" />}
        <path d={path} fill="none" stroke={C.s1} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {active !== null && (
          <circle cx={x(active)} cy={y(data[active].n)} r="4" fill={C.s1} stroke={C.surface} strokeWidth="2" />
        )}
        <circle cx={x(data.length - 1)} cy={y(last.n)} r="4" fill={C.s1} stroke={C.surface} strokeWidth="2" />
        <text x={x(data.length - 1) + 8} y={y(last.n)} dy="0.35em" fontSize="10" fill={C.textStrong} fontFamily="var(--font-mono)">{fmt(last.n)}</text>
      </svg>
      <Tip tip={tip} />
      <DataTable caption="Orders per purchase round" head={['Round', 'Orders']} rows={data.map((d) => [d.round, fmt(d.n)])} />
    </div>
  )
}
