import { useMemo, useState } from 'react'
import { fmt } from './data.js'

// ─── Looker Studio · GA4 E-commerce — ข้อมูลจำลอง (synthetic) ───────────
const C1 = 'var(--color-series-1)', C2 = 'var(--color-series-2)', C3 = 'var(--color-series-3)', MID = 'var(--color-div-mid)'
const GOOD = 'var(--color-good)', BAD = 'var(--color-bad)'

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

function buildPeriod(rnd, days, level, campaignDay) {
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1
    const camp = campaignDay && Math.abs(d - campaignDay) <= 1 ? 2.6 : 1
    const users = Math.round(level * (0.8 + rnd() * 0.5) * camp)
    const sessions = Math.round(users * (1.25 + rnd() * 0.2))
    const viewItem = Math.round(sessions * (0.55 + rnd() * 0.1))
    const addToCart = Math.round(sessions * (0.14 + rnd() * 0.05))
    const checkout = Math.round(addToCart * (0.35 + rnd() * 0.1))
    const purchases = Math.round(checkout * (0.3 + rnd() * 0.12))
    const revenue = Math.round(purchases * (620 + rnd() * 260))
    return { d, users, sessions, viewItem, addToCart, checkout, purchases, revenue }
  })
}

function buildData() {
  const rnd = mulberry32(20260918)
  const cur = buildPeriod(rnd, 30, 11500, 14)   // Sep 2026 (แคมเปญกลางเดือน)
  const prev = buildPeriod(rnd, 30, 7200, null) // Aug 2026
  const sum = (arr, k) => arr.reduce((s, r) => s + r[k], 0)
  const tot = (arr) => {
    const t = Object.fromEntries(['users', 'sessions', 'viewItem', 'addToCart', 'checkout', 'purchases', 'revenue'].map((k) => [k, sum(arr, k)]))
    t.purchasers = Math.round(t.purchases * 0.59)
    t.atcRate = t.addToCart / t.sessions
    t.purchaserRate = t.purchasers / t.users
    t.rpc = t.revenue / t.purchasers
    return t
  }
  const countries = [['Thailand', 0.86], ['Laos', 0.04], ['Myanmar', 0.03], ['Cambodia', 0.025], ['Malaysia', 0.02], ['Other', 0.025]]
  const devices = [['Mobile', 0.78], ['Desktop', 0.17], ['Tablet', 0.05]]
  const products = [
    ['Rice 5 kg · jasmine', 0.16], ['Cooking oil 1 L', 0.11], ['Instant noodle · 30 pack', 0.1], ['Dish soap 3.8 L', 0.08],
    ['Drinking water · 12 pack', 0.075], ['Fish sauce 700 ml', 0.06], ['Sugar 1 kg', 0.055], ['Laundry detergent 3 kg', 0.05],
  ].map(([name, share]) => ({ name, share, views: Math.round(180000 * share * (1.5 + rnd())), atc: 0.12 + rnd() * 0.12, conv: 0.02 + rnd() * 0.03 }))
  return { cur, prev, tc: tot(cur), tp: tot(prev), countries, devices, products }
}

const M = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : fmt(n))
const baht = (n) => `฿${fmt(Math.round(n))}`
const pctv = (v, d = 1) => `${(v * 100).toFixed(d)}%`

export default function LookerGa4() {
  const data = useMemo(buildData, [])
  const [range, setRange] = useState('30d')
  const slice = (arr) => (range === '30d' ? arr : arr.slice(-7))
  const cur = slice(data.cur), prev = slice(data.prev)
  const sumK = (arr, k) => arr.reduce((s, r) => s + r[k], 0)
  const kpi = (k, f, ratio) => {
    const a = ratio ? ratio(cur) : sumK(cur, k), b = ratio ? ratio(prev) : sumK(prev, k)
    return { value: f(a), raw: a, delta: a / b - 1, spark: cur.map((r) => (ratio ? ratio([r]) : r[k])) }
  }
  const kpis = [
    { label: 'Active users', ...kpi('users', M) },
    { label: 'Transactions', ...kpi('purchases', fmt) },
    { label: 'Total purchasers', ...kpi(null, (v) => fmt(Math.round(v)), (a) => sumK(a, 'purchases') * 0.59) },
    { label: 'Add-to-cart rate', ...kpi(null, (v) => pctv(v, 2), (a) => sumK(a, 'addToCart') / sumK(a, 'sessions')) },
    { label: 'Purchaser rate', ...kpi(null, (v) => pctv(v, 2), (a) => (sumK(a, 'purchases') * 0.59) / sumK(a, 'users')) },
    { label: 'Revenue / customer', ...kpi(null, (v) => baht(v), (a) => sumK(a, 'revenue') / (sumK(a, 'purchases') * 0.59)) },
  ]
  const funnel = ['sessions', 'viewItem', 'addToCart', 'checkout', 'purchases'].map((k, i) => ({
    l: ['Sessions', 'View item', 'Add to cart', 'Begin checkout', 'Purchase'][i], v: sumK(cur, k),
  }))
  const revenue = sumK(cur, 'revenue')

  const PAGES = [['overview', 'GA4_Overview'], ['product', 'GA4_Product Analysis'], ['funnel', 'GA4_Purchase Funnel'], ['customer', 'GA4_Customer Analysis']]
  const [page, setPage] = useState('overview')
  const countryRows = data.countries.map(([l, s]) => [l, revenue * s])
  const deviceRows = data.devices.map(([l, s]) => [l, revenue * s])

  return (
    <div className="card overflow-hidden">
      {/* Layout แบบ Looker Studio: sidebar หน้าแต่ละหน้า + พื้นที่รายงาน */}
      <div className="grid gap-3 p-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-3">
          <div className="rounded-xl border border-line bg-bg px-4 py-5">
            <h3 className="display text-3xl leading-[1.05]">Report<br /><span className="text-accent">GA4</span></h3>
            <span className="chip mt-3 !border-accent/40 !text-accent">synthetic data</span>
          </div>
          <div className="flex-1 rounded-xl border border-line bg-bg p-2">
            <p className="mono px-2 pb-1 pt-1 text-[10px] uppercase tracking-[0.08em] text-faint">Pages</p>
            {PAGES.map(([id, label]) => (
              <button key={id} onClick={() => setPage(id)} aria-current={page === id ? 'page' : undefined}
                      className={`mono block w-full rounded-lg px-3 py-2 text-left text-xs transition ${page === id ? 'bg-accent text-accent-ink' : 'text-muted hover:bg-surface-2 hover:text-fg'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-line bg-bg p-3">
            <p className="mono mb-2 text-[10px] uppercase tracking-[0.08em] text-faint">Date range</p>
            {[['30d', '1 Sep – 30 Sep 2026'], ['7d', 'Last 7 days']].map(([k, l]) => (
              <button key={k} onClick={() => setRange(k)} aria-pressed={range === k}
                      className={`mono mb-1 block w-full rounded-lg border px-3 py-1.5 text-left text-xs transition ${range === k ? 'border-accent text-accent' : 'border-line text-muted hover:text-fg'}`}>{l}</button>
            ))}
            <p className="mono mt-1 text-[10px] text-faint">vs previous period</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-3">
          {page === 'overview' && (<>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {kpis.map((k) => (
                <div key={k.label} className="rounded-xl border border-line bg-bg px-4 py-3">
                  <p className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{k.label}</p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div><p className="stat-num text-2xl text-fg">{k.value}</p><Delta v={k.delta} /></div>
                    <Spark values={k.spark} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-line bg-bg">
              <h4 className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-2.5 text-sm font-semibold">
                Total revenue <span className="mono text-[11px] font-normal text-muted">{baht(revenue)} this period</span>
              </h4>
              <div className="p-3"><Trend cur={cur} prev={prev} /></div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-line bg-bg"><h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Performance by country</h4><div className="p-3"><HBars rows={countryRows} f={baht} /></div></div>
              <div className="rounded-xl border border-line bg-bg"><h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Performance by device category</h4><div className="p-3"><HBars rows={deviceRows} f={baht} /></div></div>
            </div>
          </>)}

          {page === 'product' && (
            <div className="rounded-xl border border-line bg-bg">
              <h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Product analysis — top items</h4>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-sm">
                  <thead>
                    <tr className="mono text-[11px] uppercase tracking-wider text-accent">
                      <th className="px-3 py-2 text-left font-medium">Item</th>
                      <th className="px-3 py-2 text-right font-medium">Item views</th>
                      <th className="px-3 py-2 text-right font-medium">Add-to-cart rate</th>
                      <th className="px-3 py-2 text-right font-medium">Conversion</th>
                      <th className="px-3 py-2 text-right font-medium">Revenue</th>
                      <th className="px-3 py-2 text-left font-medium">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((p) => (
                      <tr key={p.name} className="border-t border-line/60">
                        <td className="px-3 py-1.5 text-fg">{p.name}</td>
                        <td className="mono px-3 py-1.5 text-right text-muted">{fmt(p.views)}</td>
                        <td className="mono px-3 py-1.5 text-right text-muted">{pctv(p.atc)}</td>
                        <td className="mono px-3 py-1.5 text-right text-muted">{pctv(p.conv, 2)}</td>
                        <td className="mono px-3 py-1.5 text-right text-fg">{baht(revenue * p.share)}</td>
                        <td className="px-3 py-1.5"><span className="inline-block h-2.5 rounded-sm align-middle" style={{ width: p.share * 600, background: C1 }} /><span className="mono ml-2 text-xs text-muted">{pctv(p.share, 0)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {page === 'funnel' && (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
              <div className="rounded-xl border border-line bg-bg"><h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Purchase funnel</h4><div className="p-3"><Funnel steps={funnel} /></div></div>
              <div className="rounded-xl border border-line bg-bg">
                <h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Step conversion</h4>
                <ul className="divide-y divide-line/60 p-2">
                  {funnel.slice(1).map((st, i) => (
                    <li key={st.l} className="flex items-center justify-between px-2 py-2 text-sm">
                      <span className="text-muted">{funnel[i].l} → {st.l}</span>
                      <span className="stat-num text-fg">{pctv(st.v / funnel[i].v)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {page === 'customer' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-line bg-bg"><h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Revenue by country</h4><div className="p-3"><HBars rows={countryRows} f={baht} /></div></div>
              <div className="rounded-xl border border-line bg-bg"><h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">Revenue by device</h4><div className="p-3"><HBars rows={deviceRows} f={baht} /></div></div>
              <div className="rounded-xl border border-line bg-bg md:col-span-2">
                <h4 className="border-b border-line px-4 py-2.5 text-sm font-semibold">New vs returning purchasers</h4>
                <div className="p-3"><HBars rows={[['New purchasers', kpis[2].raw * 0.62], ['Returning purchasers', kpis[2].raw * 0.38]]} f={(v) => fmt(Math.round(v))} /></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Delta({ v }) {
  const good = v >= 0
  return (
    <span className="mono inline-flex items-center gap-1 text-xs" style={{ color: good ? GOOD : BAD }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={good ? 'up' : 'down'}>
        {good ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M5 12l7 7 7-7" />}
      </svg>
      {`${good ? '+' : ''}${(v * 100).toFixed(1)}%`}
    </span>
  )
}

function Spark({ values }) {
  const W = 72, H = 24, n = values.length, max = Math.max(...values), min = Math.min(...values)
  const y = (v) => H - 2 - ((v - min) / (max - min || 1)) * (H - 4)
  const x = (i) => (i / (n - 1)) * W
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {values.map((v, i) => <rect key={i} x={x(i) - 1} y={y(v)} width={Math.max(1.5, W / n - 1)} height={H - y(v)} rx="1" fill={C1} opacity="0.85" />)}
    </svg>
  )
}

function Trend({ cur, prev }) {
  const [hover, setHover] = useState(null)
  const W = 900, H = 220, PL = 56, PR = 16, PT = 20, PB = 28
  const n = cur.length
  const max = Math.ceil(Math.max(...cur.map((d) => d.revenue), ...prev.map((d) => d.revenue)) / 1e5) * 1e5
  const x = (i) => PL + (i / (n - 1)) * (W - PL - PR)
  const y = (v) => PT + (1 - v / max) * (H - PT - PB)
  const path = (arr) => arr.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.revenue)}`).join(' ')
  const maxI = cur.reduce((a, d, i) => (d.revenue > cur[a].revenue ? i : a), 0)
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left) / r.width * W - PL) / (W - PL - PR) * (n - 1))
    const c = Math.max(0, Math.min(n - 1, i))
    setHover({ i: c, left: (x(c) / W) * 100, top: (y(cur[c].revenue) / H) * 100 })
  }
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Daily revenue, current vs previous period (synthetic)" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={y(max * t)} y2={y(max * t)} stroke="var(--color-line)" strokeDasharray={t ? '3 4' : ''} />
            <text x={PL - 8} y={y(max * t)} dy="0.35em" textAnchor="end" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{max * t >= 1e6 ? `${(max * t / 1e6).toFixed(1)}M` : `${max * t / 1e3}K`}</text>
          </g>
        ))}
        {cur.map((d, i) => (i % Math.ceil(n / 10) === 0 || i === n - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{d.d}</text>
        ))}
        <path d={`${path(cur)} L${x(n - 1)},${y(0)} L${x(0)},${y(0)}Z`} fill={C1} opacity="0.1" />
        <path d={path(prev)} fill="none" stroke={MID} strokeWidth="2" strokeDasharray="4 4" strokeLinejoin="round" />
        <path d={path(cur)} fill="none" stroke={C1} strokeWidth="2" strokeLinejoin="round" />
        <circle cx={x(maxI)} cy={y(cur[maxI].revenue)} r="4" fill={C1} stroke="var(--color-bg)" strokeWidth="2" />
        <text x={x(maxI)} y={y(cur[maxI].revenue) - 10} textAnchor="middle" fontSize="10" fill="var(--color-fg)" fontFamily="var(--font-mono)">{baht(cur[maxI].revenue)}</text>
        {hover && <>
          <line x1={x(hover.i)} x2={x(hover.i)} y1={PT} y2={H - PB} stroke="var(--color-muted)" strokeDasharray="3 3" />
          <circle cx={x(hover.i)} cy={y(cur[hover.i].revenue)} r="4" fill={C1} stroke="var(--color-bg)" strokeWidth="2" />
          <circle cx={x(hover.i)} cy={y(prev[hover.i].revenue)} r="3.5" fill={MID} stroke="var(--color-bg)" strokeWidth="2" />
        </>}
      </svg>
      {hover && (
        <div className="viz-tip" style={{ left: `${hover.left}%`, top: `${hover.top}%` }}>
          <span className="text-muted">Day {cur[hover.i].d}</span>
          <span className="ml-2">{baht(cur[hover.i].revenue)}</span>
          <span className="ml-2 text-muted">prev {baht(prev[hover.i].revenue)}</span>
        </div>
      )}
      <ul className="mono mt-2 flex gap-4 text-[11px] text-muted" aria-label="Legend">
        <li className="flex items-center gap-1.5"><span className="h-0.5 w-4" style={{ background: C1 }} />Current period</li>
        <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed" style={{ borderColor: 'var(--color-div-mid)' }} />Previous period</li>
      </ul>
    </div>
  )
}

function Funnel({ steps }) {
  const W = 320, H = 170, PL = 96, rowH = (H - 10) / steps.length, barH = 14
  const x = (v) => PL + (v / steps[0].v) * (W - PL - 48)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Purchase funnel (synthetic)">
      {steps.map((s, i) => {
        const yy = 5 + i * rowH + (rowH - barH) / 2, p = s.v / steps[0].v
        return (
          <g key={s.l}>
            <text x={PL - 8} y={yy + barH / 2} dy="0.35em" textAnchor="end" fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)">{s.l}</text>
            <rect x={PL} y={yy} width={Math.max(4, x(s.v) - PL)} height={barH} rx="4" fill={C1} opacity={1 - i * 0.15} />
            <rect x={PL} y={yy} width="4" height={barH} fill={C1} opacity={1 - i * 0.15} />
            <text x={x(s.v) + 8} y={yy + barH / 2} dy="0.35em" fontSize="10" fill="var(--color-fg)" fontFamily="var(--font-mono)">{pctv(p, p < 0.1 ? 1 : 0)}</text>
          </g>
        )
      })}
    </svg>
  )
}

function HBars({ rows, f }) {
  const max = Math.max(...rows.map((r) => r[1]))
  return (
    <ul className="space-y-2.5">
      {rows.map(([l, v], i) => (
        <li key={l}>
          <div className="mono mb-1 flex justify-between text-xs"><span className="text-fg">{l}</span><span className="text-muted">{f(v)}</span></div>
          <div className="h-2.5 rounded-full bg-surface-2"><div className="h-2.5 rounded-full" style={{ width: `${(v / max) * 100}%`, background: i === 0 ? C1 : C1, opacity: 1 - i * 0.12 }} /></div>
        </li>
      ))}
    </ul>
  )
}
