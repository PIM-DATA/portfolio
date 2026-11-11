// กราฟประกอบการ์ดผลงาน — ทุกตัวเลขเป็นค่าจำลอง (illustrative) ไม่ใช่ข้อมูลจริง
import { useState } from 'react'
import { C, useTip, Tip, Legend, DataTable, fmt, useReveal, grow, fade } from './shared.jsx'
import { PROVINCES, MAP_W, MAP_H } from '../data/thailand.js'

const MONO = 'var(--font-mono)'
const W = 320, H = 170

/* ── Genie: ถาม-ตอบด้วยภาษาธรรมชาติ → SQL → คำตอบ ── */
export function GenieMock() {
  const [ref, on] = useReveal()
  return (
    <div ref={ref} className="mono flex h-[170px] flex-col justify-between text-[10px] leading-relaxed">
      <div style={fade(on, 0)} className="self-end rounded-lg rounded-br-sm bg-surface-2 px-3 py-1.5 text-fg">ลูกค้าที่ซื้อครบทุกงวดตั้งแต่ต้นปี มีกี่คน?</div>
      <div style={fade(on, 0.6)} className="rounded-lg rounded-bl-sm border border-line bg-bg px-3 py-2 text-muted">
        <span className="text-accent">SELECT</span> user_id, COUNT(DISTINCT round) <span className="text-accent">AS</span> rounds<br />
        <span className="text-accent">FROM</span> sales.orders<br />
        <span className="text-accent">WHERE</span> order_date &gt;= '2026-01-01'<br />
        <span className="text-accent">GROUP BY</span> 1 <span className="text-accent">HAVING</span> rounds = 12
      </div>
      <div style={fade(on, 1.2)} className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5">
        <span className="stat-num text-xl text-fg">1,250</span>
        <span className="text-muted">customers · every round (illustrative)</span>
      </div>
    </div>
  )
}

/* ── Funnel: ผู้ใช้ฟีเจอร์ → ใบที่ฝากตรวจ → ถูกรางวัล ── */
const SCAN_FUNNEL = [['Users', 1], ['Scanned', 0.78], ['Repeat', 0.42], ['Winners', 0.09]]
export const GA4_FUNNEL = [['Sessions', 1], ['View item', 0.61], ['Add to cart', 0.16], ['Checkout', 0.06], ['Purchase', 0.022]]

export function FunnelChart({ data = SCAN_FUNNEL, base = 4800, label = 'Feature adoption funnel' }) {
  const { tip, show, hide } = useTip()
  const steps = data.map(([l, r]) => ({ l, v: Math.round(base * r) }))
  const PL = 78, rowH = (H - 16) / steps.length, barH = Math.min(16, rowH * 0.6)
  const x = (v) => PL + (v / steps[0].v) * (W - PL - 46)
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} (illustrative)`}>
        {steps.map((s, i) => {
          const y = 8 + i * rowH + (rowH - barH) / 2
          const pct = Math.round((s.v / steps[0].v) * 100)
          return (
            <g key={s.l} onMouseMove={(e) => { const r = e.currentTarget.closest('svg').getBoundingClientRect(); show({ x: e.clientX - r.left, y: e.clientY - r.top, label: s.l, value: `${fmt(s.v)} · ${pct}%` }) }} onMouseLeave={hide}>
              <text x={PL - 8} y={y + barH / 2} dy="0.35em" textAnchor="end" fontSize="10" fill={C.text} fontFamily={MONO}>{s.l}</text>
              <rect x={PL} y={y} width={x(s.v) - PL} height={barH} rx="4" fill={C.s1} opacity={1 - i * 0.18} style={grow(on, 'x', i * 0.15)} />
              <rect x={PL} y={y} width="4" height={barH} fill={C.s1} opacity={1 - i * 0.18} />
              <text x={x(s.v) + 8} y={y + barH / 2} dy="0.35em" fontSize="10" fill={C.textStrong} fontFamily={MONO} style={fade(on, i * 0.15 + 0.5)}>{pct}%</text>
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
      <DataTable caption={label} head={['Step', 'Users', 'Share']} rows={steps.map((s) => [s.l, fmt(s.v), `${Math.round((s.v / steps[0].v) * 100)}%`])} />
    </div>
  )
}

/* ── Dot map: ตำแหน่งลูกค้าที่ถูกรางวัล ── */
export function DotMap() {
  const [hover, setHover] = useState(null)
  // เลือกจังหวัดจำลองด้วย seed คงที่
  const picks = PROVINCES.filter((_, i) => (i * 7) % 5 === 0).slice(0, 18)
  const [ref, on] = useReveal()
  return (
    <div ref={ref} className="relative flex h-[170px] items-center justify-center">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-auto" role="img" aria-label="Prize-winner locations (illustrative)">
        {PROVINCES.map((p) => <path key={p.id} d={p.d} fill="var(--color-surface-2)" stroke="var(--color-bg)" strokeWidth="0.8" />)}
        {picks.map((p, i) => {
          const r = 5 + ((i * 13) % 4) * 3
          return (
            <g key={p.id} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: on ? 'none' : 'scale(0)', transition: `transform .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.06}s` }} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}>
              <circle cx={p.cx} cy={p.cy} r={r + 6} fill={C.s1} opacity="0.15" />
              <circle cx={p.cx} cy={p.cy} r={r} fill={C.s1} stroke={C.surface} strokeWidth="2" />
            </g>
          )
        })}
      </svg>
      {hover && <div className="viz-tip" style={{ left: '50%', top: 12 }}><span className="text-muted">{hover.th}</span><span className="ml-2">● winners</span></div>}
      <span className="mono absolute bottom-1 right-1 text-[10px] text-faint">size = prize amount</span>
    </div>
  )
}

/* ── Donut: ส่วนแบ่งช่องทางจำหน่าย ── */
export function DonutChart() {
  const { tip, show, hide } = useTip()
  const parts = [
    { l: 'Paper (retail)', v: 65, c: C.mid },
    { l: 'Digital (Pao Tang)', v: 28, c: C.s1 },
    { l: 'Online platform', v: 7, c: C.s2 },
  ]
  const cx = 80, cy = 85, R = 62, r = 40
  let a0 = -Math.PI / 2
  const arcs = parts.map((p) => {
    const a1 = a0 + (p.v / 100) * Math.PI * 2
    const gap = 0.03
    const s = a0 + gap, e = a1 - gap
    const d = `M${cx + R * Math.cos(s)},${cy + R * Math.sin(s)} A${R},${R} 0 ${e - s > Math.PI ? 1 : 0} 1 ${cx + R * Math.cos(e)},${cy + R * Math.sin(e)} L${cx + r * Math.cos(e)},${cy + r * Math.sin(e)} A${r},${r} 0 ${e - s > Math.PI ? 1 : 0} 0 ${cx + r * Math.cos(s)},${cy + r * Math.sin(s)}Z`
    a0 = a1
    return { ...p, d }
  })
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Market share by channel (illustrative)">
        {arcs.map((a) => (
          <path key={a.l} d={a.d} fill={a.c} onMouseMove={(e) => { const rr = e.currentTarget.closest('svg').getBoundingClientRect(); show({ x: e.clientX - rr.left, y: e.clientY - rr.top, label: a.l, value: `${a.v}%` }) }} onMouseLeave={hide} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">~100M</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill={C.text} fontFamily={MONO}>tickets / round</text>
        {parts.map((p, i) => (
          <g key={p.l} transform={`translate(170, ${40 + i * 34})`}>
            <rect width="10" height="10" rx="2" fill={p.c} />
            <text x="16" y="9" fontSize="10" fill={C.textStrong} fontFamily={MONO}>{p.l}</text>
            <text x="16" y="22" fontSize="10" fill={C.text} fontFamily={MONO}>{p.v}% of market</text>
          </g>
        ))}
      </svg>
      <Tip tip={tip} />
    </div>
  )
}

/* ── KPI tiles: ภาพรวมแต่ละ BU ── */
export function KpiTiles() {
  const bus = [
    { n: 'Media app', k: [['Users', '14.7K'], ['MAU', '11.6K'], ['DAU', '2.4K'], ['Stick.', '0.20']] },
    { n: 'Marketplace', k: [['Users', '19.8K'], ['MAU', '3.3K'], ['Orders', '1.5K'], ['30d', '+4%']] },
    { n: 'Hotel check-in', k: [['Hotels', '399'], ['Active', '103'], ['Bookings', '40.5K'], ['30d', '+14%']] },
  ]
  return (
    <div className="grid h-[170px] grid-cols-3 gap-2">
      {bus.map((b, i) => (
        <div key={b.n} className="flex flex-col rounded-lg border border-line bg-bg p-2" style={{ borderTopColor: [C.s1, C.s2, C.s3][i], borderTopWidth: 2 }}>
          <p className="mono mb-1 truncate text-[9px] uppercase tracking-wider text-muted">{b.n}</p>
          {b.k.map(([l, v]) => (
            <div key={l} className="flex items-baseline justify-between border-t border-line/60 py-1">
              <span className="mono text-[9px] text-faint">{l}</span>
              <span className="text-xs font-medium text-fg">{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Sparkline + KPI: social media ── */
const SOCIAL_KPIS = [['Followers', '30.5K'], ['Views', '671K'], ['Engagement', '50.4K'], ['Eng. rate', '1.45%']]
const SOCIAL_SERIES = [12, 14, 13, 18, 16, 22, 21, 26, 24, 31, 29, 34, 33, 40]
export const ADS_KPIS = [['Impressions', '230M'], ['Cost', '฿2.7M'], ['Cost / sub', '฿2.08'], ['Subscribers', '1.3M']]
export const ADS_SERIES = [30, 14, 23, 25, 23, 25, 25, 21, 19, 17, 17, 17, 20, 22]

export function SocialSpark({ kpis = SOCIAL_KPIS, series = SOCIAL_SERIES, label = 'Daily engagement trend', unit = '' }) {
  const { tip, show, hide } = useTip()
  const data = series.map((v, i) => ({ d: `D${i + 1}`, v: v * 100 }))
  const PL = 8, PR = 8, PT = 56, PB = 10
  const max = Math.max(...data.map((d) => d.v)) * 1.08
  const x = (i) => PL + (i / (data.length - 1)) * (W - PL - PR)
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.v)}`).join(' ')
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} (illustrative)`}
           onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const i = Math.round(((e.clientX - r.left) / r.width * W - PL) / (W - PL - PR) * (data.length - 1)); const d = data[Math.max(0, Math.min(data.length - 1, i))]; show({ x: e.clientX - r.left, y: e.clientY - r.top, label: d.d, value: fmt(d.v) + unit }) }} onMouseLeave={hide}>
        {kpis.map(([l, v], i) => (
          <g key={l} transform={`translate(${8 + i * 78}, 8)`}>
            <text y="10" fontSize="8" fill={C.text} fontFamily={MONO}>{l.toUpperCase()}</text>
            <text y="32" fontSize="17" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">{v}</text>
          </g>
        ))}
        <path d={`${path} L${x(data.length - 1)},${H - PB} L${x(0)},${H - PB}Z`} fill={C.s1} opacity="0.12" style={grow(on, 'y', 0.2, 0.9)} />
        <path d={path} fill="none" stroke={C.s1} strokeWidth="2" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={on ? 0 : 1} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)' }} />
        <circle cx={x(data.length - 1)} cy={y(data.at(-1).v)} r="4" fill={C.s1} stroke={C.surface} strokeWidth="2" style={fade(on, 1.3)} />
      </svg>
      <Tip tip={tip} />
    </div>
  )
}

/* ── Order status bars: e-commerce ── */
export function OrderStatus() {
  const { tip, show, hide } = useTip()
  const rows = [['Complete', 152], ['Delivered', 49], ['Prepare', 7], ['Shipped', 5], ['Pending', 1]]
  const max = 152, PL = 74, rowH = (H - 40) / rows.length, barH = 12
  const x = (v) => PL + (v / max) * (W - PL - 40)
  const head = [['Orders', '441'], ['GMV', '230K'], ['Register', '17.2K']]
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Orders by status (illustrative)">
        {head.map(([l, v], i) => (
          <g key={l} transform={`translate(${8 + i * 104}, 6)`}>
            <text y="9" fontSize="8" fill={C.text} fontFamily={MONO}>{l.toUpperCase()}</text>
            <text y="28" fontSize="16" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">{v}</text>
          </g>
        ))}
        {rows.map(([l, v], i) => {
          const y = 44 + i * rowH + (rowH - barH) / 2
          return (
            <g key={l} onMouseMove={(e) => { const r = e.currentTarget.closest('svg').getBoundingClientRect(); show({ x: e.clientX - r.left, y: e.clientY - r.top, label: l, value: `${v} orders` }) }} onMouseLeave={hide}>
              <text x={PL - 8} y={y + barH / 2} dy="0.35em" textAnchor="end" fontSize="9" fill={C.text} fontFamily={MONO}>{l}</text>
              <rect x={PL} y={y} width={Math.max(4, x(v) - PL)} height={barH} rx="4" fill={C.s1} style={grow(on, 'x', i * 0.12)} />
              <rect x={PL} y={y} width="4" height={barH} fill={C.s1} />
              {i === 0 && <text x={x(v) + 8} y={y + barH / 2} dy="0.35em" fontSize="10" fill={C.textStrong} fontFamily={MONO}>{v}</text>}
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
    </div>
  )
}

/* ── Pipeline: Bronze → Silver → Gold → Dashboard ── */
export function PipelineDiagram() {
  const nodes = [
    { l: 'Bronze', s: 'raw', c: C.mid },
    { l: 'Silver', s: 'clean · join', c: C.s1 },
    { l: 'Gold', s: 'profiles', c: C.s1 },
    { l: 'BI', s: 'Power BI', c: C.s2 },
  ]
  const gap = (W - 16) / nodes.length
  const [ref, on] = useReveal()
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Databricks medallion pipeline">
      {nodes.map((n, i) => {
        const x = 8 + i * gap, w = gap - 12, y = 40, h = 62
        return (
          <g key={n.l} style={fade(on, i * 0.3)}>
            <rect x={x} y={y} width={w} height={h} rx="8" fill="var(--color-bg)" stroke={n.c} strokeWidth="1.5" />
            <rect x={x} y={y} width={w} height="4" rx="2" fill={n.c} />
            <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.textStrong} fontFamily="var(--font-sans)">{n.l}</text>
            <text x={x + w / 2} y={y + 47} textAnchor="middle" fontSize="8" fill={C.text} fontFamily={MONO}>{n.s}</text>
            {i < nodes.length - 1 && <path d={`M${x + w + 2},${y + h / 2} l8,0 m-3,-3 l3,3 l-3,3`} stroke={C.text} strokeWidth="1.5" fill="none" strokeLinecap="round" />}
          </g>
        )
      })}
      <g transform="translate(8, 118)">
        {['scheduled job runs', 'null / duplicate checks', 'TZ +7 normalisation', 'location cleaning'].map((t, i) => (
          <g key={t} transform={`translate(${(i % 2) * 156}, ${Math.floor(i / 2) * 20})`}>
            <circle cx="4" cy="6" r="3" fill={C.s1} />
            <text x="12" y="9" fontSize="9" fill={C.text} fontFamily={MONO}>{t}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export function Ga4Funnel() {
  return <FunnelChart data={GA4_FUNNEL} base={120000} label="GA4 purchase funnel" />
}

export function AdsSpark() {
  return <SocialSpark kpis={ADS_KPIS} series={ADS_SERIES} label="Daily new subscribers" />
}

/* ── Hourly pulse: ยอดขายรายชั่วโมงเทียบเป้า + รายงานส่งเองตรง :05 ── */
const PULSE = [['06', 12, 11], ['07', 18, 19], ['08', 25, 27], ['09', 31, 30], ['10', 38, 40], ['11', 36, 39], ['12', 41, 44], ['13', 35, 33], ['14', 20, null]]
export function HourlyPulse() {
  const { tip, show, hide } = useTip()
  const PL = 8, PT = 50, PB = 18, max = 48, bw = (W - PL * 2) / PULSE.length
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  const head = [['Sold vs target', '103%'], ['Next report', '14:05'], ['Checks', '6 / 6 ✓']]
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Hourly sales versus target (illustrative)">
        {head.map(([l, v], i) => (
          <g key={l} transform={`translate(${8 + i * 104}, 6)`}>
            <text y="9" fontSize="8" fill={C.text} fontFamily={MONO}>{l.toUpperCase()}</text>
            <text y="28" fontSize="16" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">{v}</text>
          </g>
        ))}
        {PULSE.map(([h, t, a], i) => {
          const x = PL + i * bw
          return (
            <g key={h} onMouseMove={(e) => { const r = e.currentTarget.closest('svg').getBoundingClientRect(); show({ x: e.clientX - r.left, y: e.clientY - r.top, label: `${h}:00`, value: a == null ? `target ${t}K · in progress` : `${a}K sold · target ${t}K` }) }} onMouseLeave={hide}>
              {a != null && <rect x={x + 4} y={y(a)} width={bw - 8} height={H - PB - y(a)} rx="3" fill={a >= t ? C.s1 : C.neg} opacity="0.9" style={grow(on, 'y', i * 0.12)} />}
              {a == null && <rect className={on ? 'pulse-live' : ''} x={x + 4} y={y(t)} width={bw - 8} height={H - PB - y(t)} rx="3" fill="none" stroke={C.s1} strokeDasharray="3 3" style={fade(on, i * 0.12)} />}
              <line x1={x + 2} x2={x + bw - 2} y1={y(t)} y2={y(t)} stroke={C.s2} strokeWidth="2" style={fade(on, i * 0.12 + 0.3)} />
              <text x={x + bw / 2} y={H - 5} textAnchor="middle" fontSize="9" fill={C.text} fontFamily={MONO}>{h}</text>
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
      <Legend items={[{ label: 'Sold (above target)', color: C.s1 }, { label: 'Below target', color: C.neg }, { label: 'Hourly target', color: C.s2 }]} />
    </div>
  )
}

/* ── Broadcast → sales: ส่งถึงคนเยอะ ≠ ได้ผู้ซื้อเยอะ ── */
const SENDS = [['Send 1', 1.1, 260], ['Send 2', 0.7, 290], ['Send 3', 5.8, 120], ['Send 4', 2.3, 210], ['Send 5', 5.9, 55]]
export function BroadcastSales() {
  const { tip, show, hide } = useTip()
  const PL = 50, mid = 182, rowH = (H - 30) / SENDS.length, barH = 10
  const xr = (v) => PL + (v / 6) * (mid - PL - 14), xb = (v) => mid + (v / 300) * (W - mid - 30)
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Broadcast reach versus buyers per send (illustrative)">
        <text x={PL} y="10" fontSize="8" fill={C.text} fontFamily={MONO}>REACH (M)</text>
        <text x={mid} y="10" fontSize="8" fill={C.text} fontFamily={MONO}>BUYERS WITHIN 30 MIN</text>
        {SENDS.map(([l, r, b], i) => {
          const y = 22 + i * rowH + (rowH - barH) / 2
          return (
            <g key={l} onMouseMove={(e) => { const s = e.currentTarget.closest('svg').getBoundingClientRect(); show({ x: e.clientX - s.left, y: e.clientY - s.top, label: l, value: `${r}M reached · ${b} buyers` }) }} onMouseLeave={hide}>
              <text x={PL - 8} y={y + barH / 2} dy="0.35em" textAnchor="end" fontSize="9" fill={C.text} fontFamily={MONO}>{l}</text>
              <rect x={PL} y={y} width={xr(r) - PL} height={barH} rx="3" fill={C.mid} style={grow(on, 'x', i * 0.1)} />
              <rect x={mid} y={y} width={xb(b) - mid} height={barH} rx="3" fill={C.s1} style={grow(on, 'x', 0.8 + i * 0.1)} />
              <text x={xb(b) + 6} y={y + barH / 2} dy="0.35em" fontSize="9" fill={C.textStrong} fontFamily={MONO} style={fade(on, 1.3 + i * 0.1)}>{b}</text>
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
      <DataTable caption="Reach and buyers per broadcast" head={['Send', 'Reach', 'Buyers ≤30 min']} rows={SENDS.map(([l, r, b]) => [l, `${r}M`, b])} />
    </div>
  )
}

/* ── Quality gate: ตรวจความครบก่อนส่งรายงาน ── */
export function QualityGate() {
  const rows = [
    [true, 'Sales closed at 24:00, every day'],
    [true, 'GA4 full-day pull · date verified'],
    [true, 'Funnel 6/6 steps · 150+ search terms'],
    [false, 'GA4 ÷ real buyers = 0.31 (want 0.4–1)'],
  ]
  const [ref, on] = useReveal()
  return (
    <div ref={ref} className="mono flex h-[170px] flex-col justify-between text-[10px] leading-relaxed">
      <div className="rounded-lg border border-line bg-bg px-3 py-2">
        <span className="text-accent">$</span> <span className="text-fg">check.py</span> <span className="text-muted">--day 12</span>
        {rows.map(([ok, t], i) => (
          <div key={t} className="flex gap-2" style={fade(on, 0.3 + i * 0.45)}><span style={{ color: ok ? C.s1 : C.neg }}>{ok ? '✓' : '✗'}</span><span className="text-muted">{t}</span></div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-lg px-3 py-1.5" style={{ ...fade(on, 2.3), border: `1px solid ${C.neg}`, background: 'color-mix(in srgb, var(--color-div-neg) 8%, transparent)' }}>
        <span className="whitespace-nowrap text-fg">Report held</span>
        <span className="text-muted">re-pull → checks pass → sent</span>
      </div>
    </div>
  )
}

/* ── Job runs: job พังหลัง schema ต้นทางเปลี่ยน → แก้ → ตรวจตรง 100% ── */
export function JobRuns() {
  const tasks = ['orders', 'spending', 'prize']
  const days = 14, fail = 9 // วันที่ 10–11 พัง, วันที่ 12 แก้แล้ว
  const PL = 58, cw = (W - PL - 8) / days, PT = 46
  const state = (t, d) => d < fail ? 'ok' : d === fail || d === fail + 1 ? (t === 0 ? 'ok' : t === 1 ? 'fail' : 'skip') : 'ok'
  const col = { ok: C.s1, fail: C.neg, skip: C.mid }
  const [ref, on] = useReveal()
  return (
    <div className="relative" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Scheduled job runs before and after a fix (illustrative)">
        {[['Failed task', 'spending'], ['Root cause', 'dropped col'], ['Rewrite check', '100% match']].map(([l, v], i) => (
          <g key={l} transform={`translate(${8 + i * 104}, 6)`}>
            <text y="9" fontSize="8" fill={C.text} fontFamily={MONO}>{l.toUpperCase()}</text>
            <text y="27" fontSize="12" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">{v}</text>
          </g>
        ))}
        {tasks.map((t, ti) => (
          <g key={t}>
            <text x={PL - 8} y={PT + ti * 26 + 9} dy="0.35em" textAnchor="end" fontSize="9" fill={C.text} fontFamily={MONO}>{t}</text>
            {[...Array(days)].map((_, d) => <rect key={d} x={PL + d * cw + 1.5} y={PT + ti * 26} width={cw - 3} height="18" rx="3" fill={col[state(ti, d)]} opacity={state(ti, d) === 'ok' ? 0.85 : 1} style={fade(on, d * 0.08 + ti * 0.03, 0.3)} />)}
          </g>
        ))}
        <g style={fade(on, (fail + 2) * 0.08 + 0.2)}><line x1={PL + (fail + 2) * cw} x2={PL + (fail + 2) * cw} y1={PT - 4} y2={PT + 76} stroke={C.textStrong} strokeDasharray="2 3" />
        <text x={PL + (fail + 2) * cw - 4} y={PT + 92} textAnchor="end" fontSize="9" fill={C.textStrong} fontFamily={MONO}>fix deployed →</text></g>
      </svg>
      <Legend items={[{ label: 'Succeeded', color: C.s1 }, { label: 'Failed', color: C.neg }, { label: 'Skipped (upstream failed)', color: C.mid }]} />
    </div>
  )
}
