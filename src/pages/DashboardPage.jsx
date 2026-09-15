import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Dashboard from '../components/Dashboard.jsx'
import LineOaBlock from '../dashboard/LineOaBlock.jsx'
import LineOaBroadcast from '../dashboard/LineOaBroadcast.jsx'
import LookerGa4 from '../dashboard/LookerGa4.jsx'
import { dashboards } from '../data/profile.js'
import { fadeUp, stagger, Reveal } from '../components/Section.jsx'

const VIEWS = { province: Dashboard, 'lineoa-block': LineOaBlock, 'lineoa-broadcast': LineOaBroadcast, 'looker-ga4': LookerGa4 }

export default function DashboardPage() {
  const [active, setActive] = useState(dashboards[0].id)

  // แถบเมนูย่อย: ไฮไลต์แดชบอร์ดที่กำลังดู
  useEffect(() => {
    const els = dashboards.map((d) => document.getElementById(`dash-${d.id}`)).filter(Boolean)
    const update = () => {
      const line = window.scrollY + window.innerHeight * 0.35
      let cur = dashboards[0].id
      for (const el of els) if (el.offsetTop <= line) cur = el.id.replace('dash-', '')
      setActive(cur)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const jump = (e, id) => {
    e.preventDefault()
    document.getElementById(`dash-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative z-10 px-5 pb-24 pt-32 sm:px-8">
      <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-6xl">
        <motion.a variants={fadeUp} href="#work" className="mono mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted transition hover:text-accent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          Back to portfolio
        </motion.a>

        <motion.p variants={fadeUp} className="eyebrow mb-4">Dashboard rebuilds · Power BI & Looker Studio → Web</motion.p>
        <motion.h1 variants={fadeUp} className="display max-w-3xl text-[2.6rem] leading-[1.05] sm:text-6xl">
          Four production reports, rebuilt for the web.
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-muted sm:text-lg">
          Same filters, same visuals, same logic as the Power BI and Looker Studio originals — every number is synthetic, because the real data belongs to the business. Scroll through all four, or jump to one.
        </motion.p>
      </motion.div>

      {/* sticky sub-nav */}
      <div className="sticky top-[68px] z-30 mx-auto mt-8 max-w-6xl">
        <nav aria-label="Dashboards" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-bg/85 p-1 backdrop-blur-md">
          {dashboards.map((d, i) => (
            <a key={d.id} href={`#dash-${d.id}`} onClick={(e) => jump(e, d.id)} aria-current={active === d.id ? 'true' : undefined}
               className={`mono whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition ${active === d.id ? 'bg-accent text-accent-ink' : 'text-muted hover:text-fg'}`}>
              <span className="mr-1.5 opacity-60">{i + 1}</span>{d.tab}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl">
        {dashboards.map((d, i) => {
          const View = VIEWS[d.id]
          return (
            <section key={d.id} id={`dash-${d.id}`} className="scroll-mt-32 border-t border-line/60 pt-14 first:border-0 first:pt-12" style={{ marginTop: i ? '4.5rem' : 0 }}>
              <Reveal>
                <p className="eyebrow mb-3">{String(i + 1).padStart(2, '0')} · {d.tool} · {d.tab}</p>
                <h2 className="display max-w-3xl text-4xl leading-[1.05] sm:text-5xl">{d.title}</h2>
                <p className="mt-4 max-w-2xl text-[17px] leading-[1.65] text-muted">{d.intro}</p>
              </Reveal>
              <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
                {d.points.map((p) => (
                  <div key={p.h} className="card p-5">
                    <p className="eyebrow mb-2">{p.h}</p>
                    <p className="text-[15px] leading-[1.65] text-muted">{p.t}</p>
                  </div>
                ))}
              </Reveal>
              <Reveal className="mt-6"><View /></Reveal>
            </section>
          )
        })}

        <p className="mono mt-6 text-[11px] text-faint">
          * Layouts and logic mirror production Power BI and Looker Studio reports; every number is generated from a fixed seed. No client data is shown.
        </p>
      </div>
    </div>
  )
}
