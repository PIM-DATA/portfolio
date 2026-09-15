import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section, { Reveal } from './Section.jsx'
import { profile, skills, tools, languages, certifications, education } from '../data/profile.js'
import { BrandIcon } from './Icons.jsx'

function Lightbox({ cert, onClose }) {
  useEffect(() => {
    if (!cert) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [cert, onClose])
  return (
    <AnimatePresence>
      {cert && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={cert.name}>
          <motion.figure initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                         className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={cert.image} alt={cert.name} className="max-h-[80vh] w-auto rounded-xl border border-line shadow-2xl" />
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium">{cert.name}</span>
              <span className="mono text-[11px] text-muted">{cert.issuer} · {cert.date}</span>
            </figcaption>
          </motion.figure>
          <button onClick={onClose} aria-label="Close" className="mono absolute right-5 top-5 text-xs uppercase tracking-[0.2em] text-muted hover:text-accent">close ✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function About() {
  const [cert, setCert] = useState(null)
  return (
    <Section id="about" eyebrow="About" title="Data that actually gets used." intro={profile.summary}>
      <Reveal className="mb-8">
        <p className="eyebrow mb-4">Tools</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tools.map((t) => (
            <li key={t.name} className="card flex items-center gap-3 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2">
                <BrandIcon name={t.icon} size={22} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{t.name}</span>
                <span className="mono hidden truncate text-[10px] uppercase tracking-wider text-muted sm:block">{t.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="card p-6 lg:col-span-2">
          <p className="eyebrow mb-5">Skills & Expertise</p>
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="mb-3 text-sm font-semibold text-fg">{s.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span key={i} className="chip">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal className="card p-6" delay={0.05}>
            <p className="eyebrow mb-5">Languages</p>
            <ul className="space-y-3">
              {languages.map((l) => (
                <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium">{l.name}</span>
                  <span className="mono text-xs uppercase tracking-[0.06em] text-muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card p-6" delay={0.1}>
            <p className="eyebrow mb-5">Certifications</p>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li key={c.name}>
                  <button onClick={() => c.image && setCert(c)} className="group flex w-full items-center gap-3 text-left" aria-label={`View certificate: ${c.name}`}>
                    {c.image && (
                      <img src={c.image} alt="" loading="lazy" className="h-12 w-16 shrink-0 rounded-md border border-line object-cover object-left-top transition group-hover:border-accent/60" />
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug group-hover:text-accent">{c.name}</span>
                      <span className="mono mt-0.5 block text-[11px] text-muted">{c.issuer} · {c.date}{c.hours ? ` · ${c.hours}` : ''}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card p-6" delay={0.15}>
            <p className="eyebrow mb-5">Education</p>
            {education.map((e) => (
              <div key={e.degree}>
                <p className="text-sm font-medium leading-snug">{e.degree}</p>
                <p className="mono mt-1 text-[11px] text-muted">{e.school}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
      <Lightbox cert={cert} onClose={() => setCert(null)} />
    </Section>
  )
}
