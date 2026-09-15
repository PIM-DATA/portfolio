import { useState } from 'react'

export const C = {
  s1: 'var(--color-series-1)',
  s2: 'var(--color-series-2)',
  s3: 'var(--color-series-3)',
  neg: 'var(--color-div-neg)',
  mid: 'var(--color-div-mid)',
  grid: 'var(--color-line)',
  text: 'var(--color-muted)',
  textStrong: 'var(--color-fg)',
  surface: 'var(--color-bg)',
}

export function useTip() {
  const [tip, setTip] = useState(null) // { x, y, label, value }
  return { tip, show: setTip, hide: () => setTip(null) }
}

export function Tip({ tip }) {
  if (!tip) return null
  return (
    <div className="viz-tip" style={{ left: tip.x, top: tip.y }} role="status">
      <span className="text-muted">{tip.label}</span>
      <span className="ml-2 font-medium">{tip.value}</span>
    </div>
  )
}

export function Legend({ items }) {
  return (
    <ul className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted" aria-label="Legend">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  )
}

export function DataTable({ caption, head, rows }) {
  return (
    <details className="mt-3">
      <summary className="mono cursor-pointer text-[11px] uppercase tracking-wider text-faint hover:text-accent">
        View data table
      </summary>
      <div className="mt-2 overflow-x-auto">
        <table className="mono w-full text-left text-[11px] text-muted">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>{head.map((h) => <th key={h} className="border-b border-line py-1 pr-4 font-medium text-fg">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j} className="border-b border-line/60 py-1 pr-4">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export const fmt = (n) => n.toLocaleString('en-US')
