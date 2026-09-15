import { useMemo, useState } from 'react'
import { fmt } from './data.js'

// ─── Line OA Block — ข้อมูลจำลอง (synthetic) ───────────────────────────
// รายเดือน Jul 2023 → Sep 2026: ผู้ใช้ใหม่ (New) และผู้ที่บล็อก (Block) ; รายงวด 11 งวดล่าสุด
const NEW = 'var(--color-series-1)'
const BLOCK = 'var(--color-div-neg)'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

function buildData() {
  const rnd = mulberry32(20260916)
  const monthly = []
  let y = 2023, m = 6 // Jul 2023
  for (let i = 0; i < 39; i++) {
    // แนวโน้ม: สูงช่วงเปิดตัว → ลดลง → พีคอีกครั้งกลางปี 2024 → ค่อยๆ ลดลง
    const base = 0.12 + 0.34 * Math.exp(-i / 9) + 0.28 * Math.exp(-((i - 13) ** 2) / 18) + 0.1 * Math.exp(-((i - 24) ** 2) / 30)
    const newU = Math.round((base * (0.85 + rnd() * 0.3)) * 1e6)
    const block = Math.round(newU * (0.06 + rnd() * 0.18) * (i > 30 ? 0.35 : 1))
    monthly.push({ y, m, label: `${MONTHS[m]} ${y}`, newU, block })
    m++; if (m === 12) { m = 0; y++ }
  }
  const rounds = ['2026-04-16', '2026-05-02', '2026-05-16', '2026-06-01', '2026-06-16', '2026-07-01', '2026-07-16', '2026-08-01', '2026-08-16', '2026-09-01', '2026-09-16']
    .map((d) => ({ date: d, block: Math.round(2000 + rnd() * 16000), newU: Math.round(25000 + rnd() * 55000) }))
  for (let i = 0; i < rounds.length; i++) {
    const p = rounds[i - 1]
    rounds[i].blockPct = p ? (rounds[i].block - p.block) / p.block : null
    rounds[i].newPct = p ? (rounds[i].newU - p.newU) / p.newU : null
  }
  const totalNew = monthly.reduce((s, d) => s + d.newU, 0)
  const totalBlock = monthly.reduce((s, d) => s + d.block, 0)
  return { monthly, rounds: rounds.reverse(), totalNew, totalBlock, active: totalNew - totalBlock }
}

const M = (n) => `${(n / 1e6).toFixed(2)}M`
const pct = (v) => (v === null ? '—' : `${v > 0 ? '+' : ''}${(v * 100).toFixed(1)}%`)

export default function LineOaBlock() {
  const data = useMemo(buildData, [])
  const [year, setYear] = useState('All')
  const years = ['All', ...new Set(data.monthly.map((d) => d.y))]
  const series = year === 'All' ? data.monthly : data.monthly.filter((d) => d.y === year)
  const tNew = series.reduce((s, d) => s + d.newU, 0), tBlock = series.reduce((s, d) => s + d.block, 0)
  const blockShare = tBlock / tNew

  return (
    <div className="card overflow-hidden">
      <div className="grid items-stretch gap-3 p-3 xl:grid-cols-[220px_240px_minmax(0,1fr)]">
        {/* คอลัมน์ 1: กล่องชื่อ + KPI 2 ก้อน (แบบต้นฉบับ) */}
        <div className="grid gap-3 sm:grid-cols-3 xl:flex xl:flex-col">
          <div className="rounded-xl border border-line bg-bg px-4 py-5">
            <h3 className="display text-3xl leading-[1.05]">Line OA<br /><span className="text-accent">Block</span></h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip !border-accent/40 !text-accent">synthetic data</span>
            </div>
            <div className="mono mt-3 flex flex-wrap gap-1 text-[11px]">
              {years.map((yv) => (
                <button key={yv} onClick={() => setYear(yv)} aria-pressed={year === yv}
                        className={`rounded-full border px-2.5 py-0.5 transition ${year === yv ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:text-fg'}`}>{yv}</button>
              ))}
            </div>
          </div>
          <Kpi label="Active users" value={M(tNew - tBlock)} color={NEW} note="new − blocked" big />
          <Kpi label="Blocked users" value={M(tBlock)} color={BLOCK} note={`${(blockShare * 100).toFixed(1)}% of new`} big />
        </div>

        {/* คอลัมน์ 2: pie */}
        <div className="flex flex-col rounded-xl border border-line bg-bg p-4">
          <p className="mono mb-3 text-[11px] uppercase tracking-[0.08em] text-muted">Active vs blocked</p>
          <div className="flex flex-1 items-center"><Donut a={tNew - tBlock} b={tBlock} /></div>
        </div>

        {/* คอลัมน์ 3: ตารางรายงวด */}
        <div className="flex min-h-0 flex-col rounded-xl border border-line bg-bg">
          <h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">By purchase round</h4>
          <div className="min-h-0 flex-1 overflow-auto max-h-[360px] xl:max-h-none">
            <table className="w-full whitespace-nowrap text-sm">
              <thead className="sticky top-0 bg-bg">
                <tr className="mono text-[11px] uppercase tracking-wider text-accent">
                  <th className="px-3 py-2 text-left font-medium">Round</th>
                  <th className="px-3 py-2 text-right font-medium">Blocked</th>
                  <th className="px-3 py-2 text-right font-medium">Block %</th>
                  <th className="px-3 py-2 text-right font-medium">New users</th>
                  <th className="px-3 py-2 text-right font-medium">% New</th>
                </tr>
              </thead>
              <tbody>
                {data.rounds.map((r) => (
                  <tr key={r.date} className="border-t border-line/60">
                    <td className="mono px-3 py-1.5 text-fg">{r.date}</td>
                    <td className="mono px-3 py-1.5 text-right text-muted"><Bar v={r.block} max={20000} color={BLOCK} />{fmt(r.block)}</td>
                    <td className="px-3 py-1.5 text-right"><Delta v={r.blockPct} invert /></td>
                    <td className="mono px-3 py-1.5 text-right text-muted"><Bar v={r.newU} max={90000} color={NEW} />{fmt(r.newU)}</td>
                    <td className="px-3 py-1.5 text-right"><Delta v={r.newPct} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-surface-2">
                <tr className="mono border-t border-line">
                  <td className="px-3 py-2 font-semibold">Total</td>
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: BLOCK }}>{fmt(data.rounds.reduce((s, r) => s + r.block, 0))}</td>
                  <td />
                  <td className="px-3 py-2 text-right font-semibold text-accent">{fmt(data.rounds.reduce((s, r) => s + r.newU, 0))}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* แถวล่าง: กราฟรายเดือนเต็มความกว้าง */}
        <div className="rounded-xl border border-line bg-bg xl:col-span-3">
          <div className="p-3"><Combo series={series} /></div>
        </div>
      </div>
    </div>
  )
}

function Kpi({ label, value, color, note, big }) {
  return (
    <div className={`flex flex-1 flex-col justify-center rounded-xl border border-line bg-bg px-4 ${big ? 'py-5 text-center' : 'py-3'}`} style={{ borderTopColor: color, borderTopWidth: 2 }}>
      <p className={`stat-num text-fg ${big ? 'text-4xl' : 'text-3xl'}`} style={{ color }}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-fg">{label}</p>
      <p className="mono mt-0.5 text-[11px] text-faint">{note}</p>
    </div>
  )
}

function Bar({ v, max, color }) {
  return <span className="mr-2 inline-block h-2.5 rounded-sm align-middle" style={{ width: Math.max(2, (v / max) * 40), background: color }} />
}

// สถานะขึ้น/ลง: ไอคอน + ตัวเลข ไม่ใช้สีอย่างเดียว ; invert = สำหรับ block (ลดลง = ดี)
function Delta({ v, invert = false }) {
  if (v === null) return <span className="mono text-xs text-faint">—</span>
  const good = invert ? v < 0 : v > 0
  return (
    <span className="mono inline-flex items-center gap-1 text-xs" style={{ color: good ? 'var(--color-good)' : 'var(--color-bad)' }}>
      {pct(v)}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={v > 0 ? 'up' : 'down'}>
        {v > 0 ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
      </svg>
    </span>
  )
}

function Donut({ a, b }) {
  const total = a + b, R = 44, r = 30, cx = 52, cy = 52
  const arc = (from, to, color) => {
    const s = from * Math.PI * 2 - Math.PI / 2 + 0.03, e = to * Math.PI * 2 - Math.PI / 2 - 0.03
    const big = e - s > Math.PI ? 1 : 0
    return <path d={`M${cx + R * Math.cos(s)},${cy + R * Math.sin(s)} A${R},${R} 0 ${big} 1 ${cx + R * Math.cos(e)},${cy + R * Math.sin(e)} L${cx + r * Math.cos(e)},${cy + r * Math.sin(e)} A${r},${r} 0 ${big} 0 ${cx + r * Math.cos(s)},${cy + r * Math.sin(s)}Z`} fill={color} />
  }
  const pa = a / total
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 104 104" className="h-24 w-24 shrink-0" role="img" aria-label={`Active ${(pa * 100).toFixed(1)}%, blocked ${((1 - pa) * 100).toFixed(1)}%`}>
        {arc(0, pa, NEW)}{arc(pa, 1, BLOCK)}
        <text x={cx} y={cy + 1} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-fg)" fontFamily="var(--font-sans)">{(pa * 100).toFixed(0)}%</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize="7" fill="var(--color-muted)" fontFamily="var(--font-mono)">active</text>
      </svg>
      <ul className="mono space-y-2 text-xs">
        <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: NEW }} /><span><span className="block text-fg">Active</span><span className="text-muted">{M(a)} · {(pa * 100).toFixed(1)}%</span></span></li>
        <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: BLOCK }} /><span><span className="block text-fg">Blocked</span><span className="text-muted">{M(b)} · {((1 - pa) * 100).toFixed(1)}%</span></span></li>
      </ul>
    </div>
  )
}

function Combo({ series }) {
  const [hover, setHover] = useState(null)
  const W = 1000, H = 280, PL = 44, PR = 16, PT = 22, PB = 46
  const max = Math.ceil(Math.max(...series.map((d) => d.newU)) / 1e5) * 1e5
  const n = series.length
  const slot = (W - PL - PR) / n
  const x = (i) => PL + slot * i + slot / 2
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  const barW = Math.min(18, slot * 0.6)
  const line = series.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.newU)}`).join(' ')
  const maxI = series.reduce((a, d, i) => (d.newU > series[a].newU ? i : a), 0)
  const ticks = Array.from({ length: Math.round(max / 1e5) + 1 }, (_, i) => i * 1e5)
  // ป้ายปี ที่ขอบเขตปี
  const yearMarks = series.map((d, i) => (i === 0 || d.m === 0 ? { i, y: d.y } : null)).filter(Boolean)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.max(0, Math.min(n - 1, Math.floor((px - PL) / slot)))
    setHover({ i, left: (x(i) / W) * 100, top: (y(series[i].newU) / H) * 100 })
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Monthly new users (line) and blocked users (bars), synthetic"
           onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray={t ? '3 4' : ''} />
            <text x={PL - 8} y={y(t)} dy="0.35em" textAnchor="end" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{(t / 1e6).toFixed(1)}M</text>
          </g>
        ))}
        {yearMarks.map((m) => (
          <g key={m.i}>
            <line x1={PL + slot * m.i} x2={PL + slot * m.i} y1={PT} y2={H - PB + 6} stroke="var(--color-line)" />
            <text x={PL + slot * m.i + 6} y={H - 8} fontSize="10" fontWeight="600" fill="var(--color-fg)" fontFamily="var(--font-mono)">{m.y}</text>
          </g>
        ))}
        {series.map((d, i) => (
          <rect key={i} x={x(i) - barW / 2} y={y(d.block)} width={barW} height={Math.max(0, y(0) - y(d.block))} rx="3" fill={BLOCK} opacity={hover && hover.i !== i ? 0.55 : 1} />
        ))}
        {series.map((d, i) => (
          <text key={i} x={x(i)} y={H - PB + 16} textAnchor="middle" fontSize={n > 20 ? 8 : 9} fill="var(--color-muted)" fontFamily="var(--font-mono)">{n > 20 ? MONTHS[d.m][0] : MONTHS[d.m]}</text>
        ))}
        {hover && <line x1={x(hover.i)} x2={x(hover.i)} y1={PT} y2={H - PB} stroke="var(--color-muted)" strokeDasharray="3 3" />}
        <path d={line} fill="none" stroke={NEW} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {[maxI, n - 1].map((i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(series[i].newU)} r="4" fill={NEW} stroke="var(--color-bg)" strokeWidth="2" />
            <text x={x(i)} y={y(series[i].newU) - 10} textAnchor="middle" fontSize="10" fill="var(--color-fg)" fontFamily="var(--font-mono)">{M(series[i].newU)}</text>
          </g>
        ))}
        {hover && <circle cx={x(hover.i)} cy={y(series[hover.i].newU)} r="4" fill={NEW} stroke="var(--color-bg)" strokeWidth="2" />}
      </svg>
      {hover && (
        <div className="viz-tip" style={{ left: `${hover.left}%`, top: `${hover.top}%` }}>
          <span className="text-muted">{series[hover.i].label}</span>
          <span className="ml-2">new {M(series[hover.i].newU)}</span>
          <span className="ml-2" style={{ color: BLOCK }}>blocked {M(series[hover.i].block)}</span>
        </div>
      )}
      <ul className="mono mt-2 flex gap-4 text-[11px] text-muted" aria-label="Legend">
        <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: NEW }} />New users (line)</li>
        <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: BLOCK }} />Blocked users (bars)</li>
      </ul>
    </div>
  )
}
