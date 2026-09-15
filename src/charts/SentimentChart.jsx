import { C, useTip, Tip, Legend, DataTable } from './shared.jsx'

// ข้อมูลตัวอย่าง (illustrative) — สัดส่วน sentiment รายสัปดาห์ (%)
const data = [
  { w: 'W1', pos: 48, neu: 40, neg: 12 },
  { w: 'W2', pos: 51, neu: 38, neg: 11 },
  { w: 'W3', pos: 44, neu: 41, neg: 15 },
  { w: 'W4', pos: 31, neu: 39, neg: 30 },
  { w: 'W5', pos: 37, neu: 41, neg: 22 },
  { w: 'W6', pos: 46, neu: 40, neg: 14 },
  { w: 'W7', pos: 52, neu: 37, neg: 11 },
  { w: 'W8', pos: 55, neu: 35, neg: 10 },
]
const series = [
  { key: 'pos', label: 'Positive', color: C.s1 },
  { key: 'neu', label: 'Neutral', color: C.mid },
  { key: 'neg', label: 'Negative', color: C.neg },
]

const W = 320, H = 170, PL = 30, PR = 8, PT = 8, PB = 22
const slot = (W - PL - PR) / data.length
const barW = Math.min(18, slot * 0.6)
const y = (v) => PT + (1 - v / 100) * (H - PT - PB)

export default function SentimentChart() {
  const { tip, show, hide } = useTip()
  const enter = (e, d, s) => {
    const r = e.currentTarget.closest('svg').getBoundingClientRect()
    show({ x: e.clientX - r.left, y: e.clientY - r.top, label: `${d.w} · ${s.label}`, value: `${d[s.key]}%` })
  }
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Weekly sentiment share (sample data)">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke={C.grid} strokeWidth="1" />
            <text x={PL - 6} y={y(v)} dy="0.35em" textAnchor="end" fontSize="9" fill={C.text} fontFamily="var(--font-mono)">{v}%</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PL + slot * i + slot / 2
          let acc = 0
          return (
            <g key={d.w}>
              {series.map((s, j) => {
                const v = d[s.key]
                const y0 = y(acc + v), y1 = y(acc)
                acc += v
                const isTop = j === series.length - 1
                return (
                  <rect key={s.key} x={cx - barW / 2} y={y0} width={barW} height={Math.max(0, y1 - y0 - 2)}
                        rx={isTop ? 4 : 0} fill={s.color}
                        onMouseEnter={(e) => enter(e, d, s)} onMouseMove={(e) => enter(e, d, s)} onMouseLeave={hide} />
                )
              })}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="9" fill={C.text} fontFamily="var(--font-mono)">{d.w}</text>
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
      <Legend items={series} />
      <DataTable caption="Weekly sentiment share" head={['Week', 'Positive', 'Neutral', 'Negative']}
                 rows={data.map((d) => [d.w, `${d.pos}%`, `${d.neu}%`, `${d.neg}%`])} />
    </div>
  )
}
