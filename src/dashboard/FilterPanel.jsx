import { useState } from 'react'
import { REGIONS } from '../data/thailand.js'
import { ALL_PROVINCES, ROUNDS } from './data.js'

function Group({ title, children, action }) {
  return (
    <div className="rounded-xl border border-line bg-bg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        {action}
      </div>
      {children}
    </div>
  )
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-muted hover:text-fg">
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${checked ? 'border-accent bg-accent' : 'border-faint'}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#07090d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="truncate">{children}</span>
    </label>
  )
}

const toggle = (set, v) => { const s = new Set(set); s.has(v) ? s.delete(v) : s.add(v); return s }

export default function FilterPanel({ filters, setFilters }) {
  const [q, setQ] = useState('')
  const { regions, provinces, rounds } = filters
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))
  const clear = (k) => <button onClick={() => set(k, new Set())} className="mono text-[10px] uppercase tracking-wider text-faint hover:text-accent">clear</button>

  const provinceList = ALL_PROVINCES
    .filter((p) => !regions.size || (p.region && regions.has(p.region)))
    .filter((p) => !q || p.th.includes(q) || p.id.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="flex flex-col gap-3">
      <Group title="ภาค" action={regions.size ? clear('regions') : null}>
        {REGIONS.map((r) => (
          <Check key={r.id} checked={regions.has(r.id)} onChange={() => set('regions', toggle(regions, r.id))}>{r.th}</Check>
        ))}
      </Group>

      <Group title="จังหวัด" action={provinces.size ? clear('provinces') : null}>
        <div className="mb-2 flex items-center gap-2 border-b border-line pb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-faint"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent text-sm outline-none placeholder:text-faint" />
        </div>
        <div className="max-h-40 overflow-y-auto pr-1">
          {provinceList.map((p) => (
            <Check key={p.id} checked={provinces.has(p.id)} onChange={() => set('provinces', toggle(provinces, p.id))}>{p.th}</Check>
          ))}
          {!provinceList.length && <p className="py-2 text-xs text-faint">ไม่พบจังหวัด</p>}
        </div>
      </Group>

      <Group title="งวด" action={rounds.size ? clear('rounds') : null}>
        {[...ROUNDS].reverse().map((r) => (
          <Check key={r} checked={rounds.has(r)} onChange={() => set('rounds', toggle(rounds, r))}><span className="mono">{r}</span></Check>
        ))}
      </Group>
    </div>
  )
}
