import { motion } from 'framer-motion'
import { PROVINCES, MAP_W, MAP_H } from '../data/thailand.js'
import { dashboardCase } from '../data/profile.js'

const RAMP = ['#143c4d', '#10586f', '#0b7a9a', '#0b9ec8', '#4fd1ff']

export default function DashboardTeaser() {
  return (
    <motion.a
      href="#/dashboard"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="card group relative mt-6 grid overflow-hidden md:grid-cols-[1fr_260px]"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="eyebrow">Interactive dashboards</span>
          <span className="chip">Power BI · Looker → Web</span>
          <span className="chip !border-accent/40 !text-accent">synthetic data</span>
        </div>
        <h3 className="display text-3xl leading-tight sm:text-4xl">4 BI reports, rebuilt for the web</h3>
        <p className="mt-3 max-w-xl text-base leading-[1.65] text-muted">{dashboardCase.teaser}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg/90">
          {['Power BI · new customers by province', 'Power BI · Line OA block & broadcast', 'Looker Studio · GA4 e-commerce', 'Filters, tooltips & sortable tables'].map((t) => (
            <li key={t} className="flex items-center gap-2 text-[15px]"><span className="h-1 w-1 rounded-full bg-accent" />{t}</li>
          ))}
        </ul>
        <span className="btn-primary mt-7 inline-flex group-hover:brightness-110">
          Open dashboards
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </div>

      {/* map silhouette preview */}
      <div className="relative hidden items-center justify-center border-l border-line bg-bg md:flex">
        <div className="pointer-events-none absolute inset-0 bg-accent/5 opacity-0 transition group-hover:opacity-100" />
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-[260px] w-auto" aria-hidden="true">
          {PROVINCES.map((p, i) => (
            <path key={p.id} d={p.d} fill={RAMP[Math.min(4, Math.floor(Math.sqrt(p.w / 55) * 5))]} stroke="var(--color-bg)" strokeWidth="0.6" />
          ))}
        </svg>
      </div>
    </motion.a>
  )
}
