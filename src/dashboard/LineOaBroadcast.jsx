import { useMemo, useState } from 'react'
import { fmt } from './data.js'

// ─── Line OA Broadcast — ข้อมูลจำลอง (synthetic) ───────────────────────
const SENT = 'var(--color-series-1)'
const OPEN = 'var(--color-series-2)'
const CLICK = 'var(--color-series-3)'
const GOOD = 'var(--color-good)', BAD = 'var(--color-bad)'

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const ROUND_DATES = ['2025-09-01', '2025-09-16', '2025-10-01', '2025-10-16', '2025-11-01', '2025-11-16', '2025-12-01', '2025-12-16', '2026-01-02', '2026-01-17', '2026-02-01', '2026-02-16', '2026-03-01', '2026-03-16', '2026-04-01', '2026-04-16', '2026-05-02', '2026-05-16', '2026-06-01', '2026-06-16', '2026-07-01', '2026-07-16', '2026-08-01', '2026-08-16', '2026-09-01', '2026-09-16']

function buildData() {
  const rnd = mulberry32(20260917)
  const rounds = ROUND_DATES.map((date, i) => {
    // ปริมาณส่งสูงช่วงปลายปี 2025 แล้วลดลงหลังปรับกลยุทธ์
    const scale = i < 8 ? 1 : 0.11
    const sent = Math.round((600e6 + rnd() * 400e6) * scale * (i === 25 ? 0.5 : 1))
    const openRate = 0.16 + rnd() * 0.09
    const opened = Math.round(sent * openRate)
    const clicked = Math.round(opened * (0.02 + rnd() * 0.03))
    const video = i < 8 ? Math.round(clicked * (0.02 + rnd() * 0.06)) : null
    return { date, sent, opened, clicked, video, openRate, clickRate: clicked / opened }
  })
  for (let i = 0; i < rounds.length; i++) {
    const p = rounds[i - 1]
    rounds[i].dOpen = p ? rounds[i].openRate / p.openRate - 1 : null
    rounds[i].dClick = p ? rounds[i].clickRate / p.clickRate - 1 : null
    rounds[i].dVideo = p && p.video && rounds[i].video ? rounds[i].video / p.video - 1 : null
  }
  // รายวัน 1 Jul → 16 Sep 2026 : ส่งมากวันงวด (1 และ 16) และวันก่อนหน้า
  const daily = []
  const d0 = new Date('2026-07-01')
  for (let i = 0; i < 78; i++) {
    const d = new Date(d0); d.setDate(d0.getDate() + i)
    const day = d.getDate()
    const spike = day === 1 || day === 16 ? 6 : day === 15 || day === 31 || day === 30 ? 2.2 : 1
    const sent = Math.round((2.6e6 + rnd() * 0.8e6) * spike)
    const opened = Math.round(sent * (0.14 + rnd() * 0.08))
    daily.push({ date: d.toISOString().slice(0, 10), label: `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`, sent, opened })
  }
  // รายชั่วโมง: พีค 14:00–15:00 (ผลรางวัล) และ 22:00
  const hourly = Array.from({ length: 24 }, (_, h) => {
    const base = h < 8 ? 0.02 : 0.35
    const peak = 1 + 6 * Math.exp(-((h - 14.5) ** 2) / 1.2) + 5 * Math.exp(-((h - 22) ** 2) / 1.5)
    const sent = Math.round(1.6e8 * base * peak * (0.85 + rnd() * 0.3))
    return { h, label: `${String(h).padStart(2, '0')}:00`, sent, opened: Math.round(sent * (0.15 + rnd() * 0.06)) }
  })
  const channels = [{ name: 'NOK', sent: Math.round(rounds.reduce((s, r) => s + r.sent, 0) * 0.7) }, { name: 'KSL', sent: Math.round(rounds.reduce((s, r) => s + r.sent, 0) * 0.3) }]
  return { rounds: [...rounds].reverse(), daily, hourly, channels }
}

const M = (n) => n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)}M` : fmt(n)
const pct = (v) => (v === null ? '—' : `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`)

export default function LineOaBroadcast() {
  const data = useMemo(buildData, [])
  const [sel, setSel] = useState(new Set())
  const rows = sel.size ? data.rounds.filter((r) => sel.has(r.date)) : data.rounds
  const tot = (k) => rows.reduce((s, r) => s + (r[k] || 0), 0)
  const sent = tot('sent'), opened = tot('opened'), clicked = tot('clicked'), video = tot('video')
  const cost = sent * 0.01 // ค่าส่งจำลอง 0.01 บาท/ข้อความ
  const toggle = (d) => setSel((s) => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n })

  return (
    <div className="card overflow-hidden">
      <div className="grid items-stretch gap-3 p-3 xl:grid-cols-[250px_minmax(0,1fr)]">
        {/* คอลัมน์ซ้าย (แบบต้นฉบับ) */}
        <div className="grid content-start gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-xl border border-line bg-bg px-4 py-5">
            <h3 className="display text-3xl leading-[1.05]">Line OA<br /><span className="text-accent">Broadcast</span></h3>
            <span className="chip mt-3 !border-accent/40 !text-accent">synthetic data</span>
          </div>

          <div className="rounded-xl border border-line bg-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">งวด / วันที่</h4>
              {sel.size > 0 && <button onClick={() => setSel(new Set())} className="mono text-[10px] uppercase tracking-wider text-faint hover:text-accent">clear</button>}
            </div>
            <div className="max-h-44 overflow-y-auto pr-1">
              {data.rounds.map((r) => (
                <label key={r.date} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-muted hover:text-fg">
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${sel.has(r.date) ? 'border-accent bg-accent' : 'border-faint'}`}>
                    {sel.has(r.date) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#07090d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>}
                  </span>
                  <input type="checkbox" className="sr-only" checked={sel.has(r.date)} onChange={() => toggle(r.date)} />
                  <span className="mono">{r.date}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-bg p-4">
            <h4 className="mb-2 text-sm font-semibold">ช่องทางการส่ง</h4>
            <Channels channels={data.channels} />
          </div>

          <Kpi label="จำนวนการส่ง Broadcast" value={M(sent)} color={SENT} big />
          <div className="grid grid-cols-2 gap-3">
            <Kpi label="จำนวนที่เปิด" value={M(opened)} color={OPEN} center />
            <Kpi label="จำนวนที่คลิก" value={M(clicked)} color={CLICK} center />
            <Kpi label="เปิดดูวิดีโอ" value={video ? M(video * 14) : '—'} center />
            <Kpi label="ดูวิดีโอจบ" value={video ? M(video) : '—'} center />
          </div>
          <Kpi label="Open Rate" value={`${((opened / sent) * 100).toFixed(2)}%`} note={`click rate ${((clicked / opened) * 100).toFixed(2)}%`} center />
          <Kpi label="จำนวนเงินค่า Broadcast (บาท)" value={`฿${fmt(Math.round(cost))}`} note="illustrative rate" center />
        </div>

        {/* คอลัมน์ขวา: ตาราง → รายวัน → รายชั่วโมง */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-h-0 flex-col rounded-xl border border-line bg-bg">
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full whitespace-nowrap text-sm">
                <thead className="sticky top-0 bg-bg">
                  <tr className="mono text-[11px] uppercase tracking-wider text-accent">
                    {['งวด', 'จำนวนการส่ง', 'จำนวนที่เปิด', 'Open %', 'จำนวนที่คลิก', 'Click %', 'ดูวิดีโอจบ', 'Video %'].map((h, i) => (
                      <th key={h} className={`px-3 py-2 font-medium ${i ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rounds.map((r) => (
                    <tr key={r.date} onClick={() => toggle(r.date)} className={`cursor-pointer border-t border-line/60 hover:bg-surface-2 ${sel.has(r.date) ? 'bg-accent/10' : ''}`}>
                      <td className="mono px-3 py-1.5 text-fg">{r.date}</td>
                      <td className="mono px-3 py-1.5 text-right text-muted">{fmt(r.sent)}</td>
                      <td className="mono px-3 py-1.5 text-right text-muted">{fmt(r.opened)}</td>
                      <td className="px-3 py-1.5 text-right"><Delta v={r.dOpen} /></td>
                      <td className="mono px-3 py-1.5 text-right text-muted">{fmt(r.clicked)}</td>
                      <td className="px-3 py-1.5 text-right"><Delta v={r.dClick} /></td>
                      <td className="mono px-3 py-1.5 text-right text-muted">{r.video ? fmt(r.video) : ''}</td>
                      <td className="px-3 py-1.5 text-right">{r.video ? <Delta v={r.dVideo} /> : ''}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-surface-2">
                  <tr className="mono border-t border-line">
                    <td className="px-3 py-2 font-semibold">Total</td>
                    <td className="px-3 py-2 text-right font-semibold text-accent">{fmt(sent)}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmt(opened)}</td>
                    <td />
                    <td className="px-3 py-2 text-right font-semibold">{fmt(clicked)}</td>
                    <td /><td /><td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-bg">
            <div className="grid gap-2 p-3">
              <Bars data={data.daily} k="sent" color={SENT} label="Messages sent per day · Jul – Sep 2026" fmtV={M} height={150} />
              <Bars data={data.daily} k="rate" color={OPEN} label="Open rate per day" fmtV={(v) => `${(v * 100).toFixed(1)}%`} height={110} line />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-bg">
            <div className="p-3">
              <Bars data={data.hourly} k="sent" color={SENT} label="Messages sent by hour of day" fmtV={M} height={190} showX />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kpi({ label, value, color, note, big, center }) {
  return (
    <div className={`flex flex-col justify-center rounded-xl border border-line bg-bg px-4 ${big ? 'py-7 text-center' : center ? 'py-4 text-center' : 'py-3'}`} style={color ? { borderTopColor: color, borderTopWidth: 2 } : undefined}>
      <p className={`stat-num truncate ${big ? 'text-4xl' : 'text-2xl'}`} style={{ color: color || 'var(--color-fg)' }}>{value}</p>
      <p className="mt-1 text-sm text-fg">{label}</p>
      {note && <p className="mono mt-0.5 text-[11px] text-faint">{note}</p>}
    </div>
  )
}

function Delta({ v }) {
  if (v === null || v === undefined) return <span className="mono text-xs text-faint">—</span>
  const good = v > 0
  return (
    <span className="mono inline-flex items-center gap-1 text-xs" style={{ color: good ? GOOD : BAD }}>
      {pct(v)}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={good ? 'up' : 'down'}>
        {good ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
      </svg>
    </span>
  )
}

function Channels({ channels }) {
  const W = 220, H = 130, PL = 40, PB = 22, PT = 18
  const max = Math.max(...channels.map((c) => c.sent))
  const slot = (W - PL - 10) / channels.length, bw = Math.min(56, slot * 0.6)
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Messages sent by channel (synthetic)">
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={PL} x2={W - 10} y1={y(max * t)} y2={y(max * t)} stroke="var(--color-line)" strokeDasharray={t ? '3 4' : ''} />
          <text x={PL - 6} y={y(max * t)} dy="0.35em" textAnchor="end" fontSize="9" fill="var(--color-muted)" fontFamily="var(--font-mono)">{M(max * t)}</text>
        </g>
      ))}
      {channels.map((c, i) => {
        const cx = PL + slot * i + slot / 2
        return (
          <g key={c.name}>
            <rect x={cx - bw / 2} y={y(c.sent)} width={bw} height={y(0) - y(c.sent)} rx="4" fill={i ? CLICK : SENT} />
            <text x={cx} y={y(c.sent) - 6} textAnchor="middle" fontSize="10" fill="var(--color-fg)" fontFamily="var(--font-mono)">{M(c.sent)}</text>
            <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{c.name}</text>
          </g>
        )
      })}
    </svg>
  )
}

// กราฟแท่ง/เส้นแกนเดียว พร้อม crosshair tooltip
function Bars({ data, k, color, label, fmtV, height = 150, line = false, showX = false }) {
  const [hover, setHover] = useState(null)
  const W = 720, H = height, PL = 46, PR = 10, PT = 16, PB = showX ? 26 : 8
  const vals = data.map((d) => (k === 'rate' ? d.opened / d.sent : d[k]))
  const max = Math.max(...vals) * 1.1
  const n = data.length, slot = (W - PL - PR) / n
  const x = (i) => PL + slot * i + slot / 2
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  const maxI = vals.indexOf(Math.max(...vals))
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.max(0, Math.min(n - 1, Math.floor((px - PL) / slot)))
    setHover({ i, left: (x(i) / W) * 100, top: (y(vals[i]) / H) * 100 })
  }
  return (
    <div className="relative">
      <p className="mono mb-1 text-[11px] uppercase tracking-[0.08em] text-muted">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} (synthetic)`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={y(max * t)} y2={y(max * t)} stroke="var(--color-line)" strokeDasharray={t ? '3 4' : ''} />
            <text x={PL - 6} y={y(max * t)} dy="0.35em" textAnchor="end" fontSize="9" fill="var(--color-muted)" fontFamily="var(--font-mono)">{fmtV(max * t)}</text>
          </g>
        ))}
        {line ? (
          <path d={vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        ) : (
          vals.map((v, i) => <rect key={i} x={x(i) - Math.min(14, slot * 0.7) / 2} y={y(v)} width={Math.min(14, slot * 0.7)} height={Math.max(0, y(0) - y(v))} rx="2" fill={color} opacity={hover && hover.i !== i ? 0.6 : 1} />)
        )}
        {showX && data.map((d, i) => i % 2 === 0 && <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-muted)" fontFamily="var(--font-mono)">{d.label}</text>)}
        {!showX && data.map((d, i) => (i === 0 || d.date?.endsWith('-01')) && <text key={i} x={x(i)} y={H - 1} textAnchor="start" fontSize="9" fill="var(--color-muted)" fontFamily="var(--font-mono)">{d.label}</text>)}
        <circle cx={x(maxI)} cy={y(vals[maxI])} r="3.5" fill={color} stroke="var(--color-bg)" strokeWidth="2" />
        <text x={x(maxI)} y={y(vals[maxI]) - 8} textAnchor="middle" fontSize="10" fill="var(--color-fg)" fontFamily="var(--font-mono)">{fmtV(vals[maxI])}</text>
        {hover && <line x1={x(hover.i)} x2={x(hover.i)} y1={PT} y2={H - PB} stroke="var(--color-muted)" strokeDasharray="3 3" />}
      </svg>
      {hover && (
        <div className="viz-tip" style={{ left: `${hover.left}%`, top: `${hover.top}%` }}>
          <span className="text-muted">{data[hover.i].label}</span>
          <span className="ml-2">{fmtV(vals[hover.i])}</span>
          {k === 'sent' && <span className="ml-2 text-muted">opened {M(data[hover.i].opened)}</span>}
        </div>
      )}
    </div>
  )
}
