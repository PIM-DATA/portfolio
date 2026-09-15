import { motion } from 'framer-motion'
import { profile, stats } from '../data/profile.js'
import { fadeUp, stagger } from './Section.jsx'

export default function Hero() {
  return (
    <section id="home" className="relative z-10 overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center gap-3">
              {profile.available && (
                <span className="chip !border-accent/40 !text-accent">
                  <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  {profile.availabilityText}
                </span>
              )}
              <span className="chip">{profile.location}</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
              {profile.name.split(' ')[0]}
              <br />
              <span className="display font-normal text-accent">{profile.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mono mt-6 text-sm uppercase tracking-[0.1em] text-muted sm:text-[15px]">
              {profile.title} · {profile.tagline}
            </motion.p>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-[1.75] text-muted sm:text-xl sm:leading-[1.7]">
              {profile.heroIntro}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <a href="#work" className="btn-primary">
                View work <Arrow />
              </a>
              <a href={profile.cvFile} download className="btn-ghost">
                Download CV (PDF)
              </a>
              <a href="#contact" className="btn-ghost">
                Contact
              </a>
            </motion.div>
          </div>

          {profile.photo && (
            <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="absolute -inset-3 rounded-[28px] border border-accent/20" />
              <div className="absolute -inset-3 rounded-[28px] bg-accent/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="aspect-[3/4] w-full object-cover object-top"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent p-5">
                  <p className="mono text-xs uppercase tracking-[0.1em] text-accent">{profile.nickname} · {profile.title.split('|')[0].trim()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.dl variants={fadeUp} className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-6 py-6">
              <dd className="stat-num text-4xl text-fg">{s.value}</dd>
              <dt className="mono mt-2 text-xs uppercase tracking-[0.1em] text-muted">{s.label}</dt>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
