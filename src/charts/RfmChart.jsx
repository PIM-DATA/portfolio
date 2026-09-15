import { C, useTip, Tip, DataTable, fmt } from './shared.jsx'

// ข้อมูลตัวอย่าง (illustrative) — จำนวนลูกค้าต่อ segment
const data = [
  { seg: 'Champions', n: 1240 },
  { seg: 'Loyal', n: 2860 },
  { seg: 'Potential', n: 3410 },
  { seg: 'At risk', n: 1920 },
  { seg: 'Hibernating', n: 2570 },
]

const W = 320, H = 170, PL = 84, PR = 44, PT = 8, PB = 8
const max = Math.max(...data.map((d) => d.n))
const rowH = (H - PT - PB) / data.length
const barH = Math.min(14, rowH * 0.55)
const x = (v) => PL + (v / max) * (W - PL - PR)
const top = data.reduce((a, b) => (a.n > b.n ? a : b))

export default function RfmChart() {
  const { tip, show, hide } = useTip()
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Customers per RFM segment (sample data)">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={x(max * t)} x2={x(max * t)} y1={PT} y2={H - PB} stroke={C.grid} strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const y = PT + i * rowH + (rowH - barH) / 2
          return (
            <g key={d.seg}>
              <text x={PL - 10} y={y + barH / 2} dy="0.35em" textAnchor="end" fontSize="10" fill={C.text} fontFamily="var(--font-mono)">
                {d.seg}
              </text>
              <rect x={PL} y={y} width={x(d.n) - PL} height={barH} rx="4" fill={C.s1} />
              <rect x={PL} y={y} width="4" height={barH} fill={C.s1} />
              {d === top && (
                <text x={x(d.n) + 8} y={y + barH / 2} dy="0.35em" fontSize="10" fill={C.textStrong} fontFamily="var(--font-mono)">
                  {fmt(d.n)}
                </text>
              )}
              {/* hit target larger than the mark */}
              <rect x={PL} y={PT + i * rowH} width={W - PL} height={rowH} fill="transparent"
                onMouseEnter={(e) => onEnter(e, d, show)} onMouseMove={(e) => onEnter(e, d, show)} onMouseLeave={hide} />
            </g>
          )
        })}
        <line x1={PL} x2={PL} y1={PT} y2={H - PB} stroke={C.grid} strokeWidth="1" />
      </svg>
      <Tip tip={tip} />
      <DataTable caption="Customers per RFM segment" head={['Segment', 'Customers']} rows={data.map((d) => [d.seg, fmt(d.n)])} />
    </div>
  )
}

function onEnter(e, d, show) {
  const r = e.currentTarget.closest('svg').getBoundingClientRect()
  show({ x: e.clientX - r.left, y: e.clientY - r.top, label: d.seg, value: `${fmt(d.n)} customers` })
}
