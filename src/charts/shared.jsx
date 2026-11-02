import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { NO_ANIM } from '../components/Section.jsx'

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

// ── motion: กราฟค่อย ๆ ขึ้นเมื่อเลื่อนมาถึง (ปิดเองเมื่อ ?noanim หรือผู้ใช้ตั้งลดการเคลื่อนไหว) ──
export function useReveal(amount = 0.45) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount })
  const reduce = useReducedMotion()
  return [ref, NO_ANIM || reduce || seen]
}

const EASE = 'cubic-bezier(.22,1,.36,1)'
// แท่ง SVG โตจากฐาน: axis 'y' = โตขึ้นจากล่าง, 'x' = ยืดจากซ้าย
export const grow = (on, axis = 'y', delay = 0, dur = 0.7) => ({
  transformBox: 'fill-box',
  transformOrigin: axis === 'y' ? 'bottom' : 'left',
  transform: on ? 'none' : axis === 'y' ? 'scaleY(0)' : 'scaleX(0)',
  transition: `transform ${dur}s ${EASE} ${delay}s`,
})
export const fade = (on, delay = 0, dur = 0.45) => ({
  opacity: on ? 1 : 0,
  transform: on ? 'none' : 'translateY(4px)',
  transition: `opacity ${dur}s ease ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
})

// ตัวเลขนับขึ้น: '4+' '10+' ':05' '40%' → นับเฉพาะส่วนที่เป็นตัวเลข (เติม 0 นำหน้าเฉพาะค่าที่ขึ้นต้นด้วย 0 เช่น :05)
export function CountUp({ value, dur = 1200 }) {
  const [ref, on] = useReveal(0.6)
  const m = String(value).match(/^(\D*)(\d+)(.*)$/)
  const [n, setN] = useState(m && !NO_ANIM ? 0 : null)
  useEffect(() => {
    if (!m || !on || NO_ANIM) return
    const to = +m[2], t0 = performance.now()
    let raf
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on])
  if (!m || n === null) return <span ref={ref}>{value}</span>
  return <span ref={ref}>{m[1]}{String(n).padStart(m[2].startsWith('0') ? m[2].length : 1, '0')}{m[3]}</span>
}
