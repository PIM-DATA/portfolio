import { useMemo, useState } from 'react'
import FilterPanel from '../dashboard/FilterPanel.jsx'
import ThailandMap from '../dashboard/ThailandMap.jsx'
import AgeGenderChart from '../dashboard/AgeGenderChart.jsx'
import ProvinceTable from '../dashboard/ProvinceTable.jsx'
import { aggregate, sum, fmt, ROUNDS } from '../dashboard/data.js'

const EMPTY = { regions: new Set(), provinces: new Set(), rounds: new Set() }

function Panel({ title, children, className = '', right }) {
  return (
    <div className={`flex flex-col rounded-xl border border-line bg-bg ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <h4 className="text-sm font-semibold">{title}</h4>
          {right}
        </div>
      )}
      <div className="min-h-0 flex-1 p-3">{children}</div>
    </div>
  )
}

// Layout ตามหน้า Power BI ต้นฉบับ: ซ้าย = ชื่อ + ตัวกรอง, ขวา = แผนที่เต็มแถว แล้วกราฟอายุ-เพศ + ตาราง
export default function Dashboard() {
  const [filters, setFilters] = useState(EMPTY)
  const agg = useMemo(() => aggregate(null, filters), [filters])
  const total = sum(agg.total)
  const active = filters.regions.size + filters.provinces.size + filters.rounds.size
  const pick = (id) => setFilters((f) => { const s = new Set(f.provinces); s.has(id) ? s.delete(id) : s.add(id); return { ...f, provinces: s } })

  return (
    <div className="card overflow-hidden">
      <div className="grid items-stretch gap-3 p-3 lg:grid-cols-[230px_1fr]">
        <aside className="flex flex-col gap-3">
          {/* กล่องชื่อรายงาน (แบบต้นฉบับ) */}
          <div className="rounded-xl border border-line bg-bg px-4 py-5">
            <h3 className="display text-3xl leading-[1.05] text-accent">ลูกค้าใหม่<br />รายจังหวัด</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip !border-accent/40 !text-accent">synthetic data</span>
              <button onClick={() => setFilters(EMPTY)} disabled={!active}
                      className="mono rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-wider text-muted transition hover:border-accent hover:text-accent disabled:opacity-40">Reset</button>
            </div>
          </div>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        <div className="flex min-w-0 flex-col gap-3">
          <Panel title="แผนที่รายจังหวัด" className="min-h-[420px] flex-1"
                 right={<span className="mono text-[11px] text-muted">{fmt(total)} new customers · {filters.rounds.size || ROUNDS.length} rounds</span>}>
            <ThailandMap byProvince={agg.byProvince} filters={filters} onPick={pick} />
          </Panel>
          <div className="grid gap-3 md:grid-cols-2">
            <Panel title="ช่วงอายุและเพศ">
              <AgeGenderChart byAge={agg.byAge} />
            </Panel>
            <Panel title="ลูกค้าใหม่รายจังหวัด" className="h-[300px]">
              <ProvinceTable byProvince={agg.byProvince} total={agg.total} filters={filters} onPick={pick} />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
