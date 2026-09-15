import { useState } from 'react'
import { ALL_PROVINCES, sum, fmt } from './data.js'

const COLS = [
  { key: 'F', label: 'Female' },
  { key: 'M', label: 'Male' },
  { key: 'U', label: 'Unspec.' },
  { key: 'T', label: 'Total' },
]

export default function ProvinceTable({ byProvince, total, filters, onPick }) {
  const [sort, setSort] = useState({ key: 'T', dir: -1 })
  const rows = ALL_PROVINCES
    .map((p) => { const v = byProvince.get(p.id); return v ? { p, ...v, T: sum(v) } : null })
    .filter(Boolean)
    .sort((a, b) => (a[sort.key] - b[sort.key]) * sort.dir)

  const th = (c) => (
    <th key={c.key} className="cursor-pointer select-none whitespace-nowrap px-2 py-2 text-right font-medium text-accent hover:text-fg"
        onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? -s.dir : -1 }))}>
      {c.label}{sort.key === c.key && <span className="ml-1 text-faint">{sort.dir < 0 ? '▼' : '▲'}</span>}
    </th>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0 bg-bg">
            <tr className="mono text-[11px] uppercase tracking-wider">
              <th className="px-2 py-2 text-left font-medium text-accent">Province</th>
              {COLS.map(th)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.p.id} onClick={() => r.p.region && onPick(r.p.id)}
                  className={`cursor-pointer border-t border-line/60 hover:bg-surface-2 ${filters.provinces.has(r.p.id) ? 'bg-accent/10' : ''}`}>
                <td className="px-2 py-1.5 text-fg">{r.p.th}</td>
                {COLS.map((c) => (
                  <td key={c.key} className={`mono px-2 py-1.5 text-right ${c.key === 'T' ? 'font-medium text-fg' : 'text-muted'}`}>{fmt(r[c.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-surface-2">
            <tr className="mono border-t border-line">
              <td className="px-2 py-2 font-semibold">Total</td>
              {['F', 'M', 'U'].map((k) => <td key={k} className="px-2 py-2 text-right text-muted">{fmt(total[k])}</td>)}
              <td className="px-2 py-2 text-right font-semibold text-accent">{fmt(sum(total))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
