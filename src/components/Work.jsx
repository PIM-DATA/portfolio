import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section, { Reveal } from './Section.jsx'
import { projects } from '../data/profile.js'
import { charts } from '../charts/index.js'
import DashboardTeaser from './DashboardTeaser.jsx'

const categories = ['All', ...new Set(projects.map((p) => p.category))]
const featured = projects.filter((p) => p.featured)

export default function Work() {
  const [showAll, setShowAll] = useState(false)
  const [cat, setCat] = useState('All')
  const pool = showAll ? projects : featured
  const shown = cat === 'All' ? pool : pool.filter((p) => p.category === cat)

  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title="Projects that moved a number."
      intro="Six projects that best show the range — from self-service analytics and data pipelines to storytelling. Every chart is an illustrative sample of the deliverable's shape; real client numbers stay with the client."
    >
      <Reveal className="mb-8 flex flex-wrap items-center gap-2">
        <div className="mono inline-flex rounded-full border border-line bg-surface/70 p-1 text-[11px] uppercase tracking-wider">
          <button onClick={() => { setShowAll(false); setCat('All') }} aria-pressed={!showAll}
                  className={`rounded-full px-4 py-1.5 transition ${!showAll ? 'bg-accent text-accent-ink' : 'text-muted hover:text-fg'}`}>
            Featured · {featured.length}
          </button>
          <button onClick={() => setShowAll(true)} aria-pressed={showAll}
                  className={`rounded-full px-4 py-1.5 transition ${showAll ? 'bg-accent text-accent-ink' : 'text-muted hover:text-fg'}`}>
            All projects · {projects.length}
          </button>
        </div>
        <AnimatePresence>
          {showAll && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
                        className={`chip !px-3.5 !py-1.5 transition ${cat === c ? '!border-accent !text-accent' : 'hover:!border-accent/60 hover:!text-fg'}`}>
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      <motion.div layout className="grid gap-7 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => {
            const Chart = charts[p.chart]
            return (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="card flex flex-col p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="eyebrow">{p.category}</span>
                  <span className="mono text-[10px] uppercase tracking-wider text-faint">sample data</span>
                </div>
                <div className="rounded-xl border border-line bg-bg p-4">
                  {Chart && <Chart />}
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 mb-4 text-base leading-[1.65] text-muted">{p.description}</p>
                <ul className="mb-5 space-y-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-[15px] text-fg/90">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="chip ml-auto !border-accent/40 !text-accent hover:!bg-accent hover:!text-accent-ink">
                      Open ↗
                    </a>
                  )}
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {!showAll && (
        <Reveal className="mt-8 flex justify-center">
          <button onClick={() => setShowAll(true)} className="btn-ghost">
            View all {projects.length} projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </Reveal>
      )}

      <Reveal>
        <DashboardTeaser />
      </Reveal>
    </Section>
  )
}
