import Section, { Reveal } from './Section.jsx'
import { experience } from '../data/profile.js'

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="From social insight to business intelligence." intro="Four years across social insight, BI development, and data analysis.">
      <div className="space-y-6 sm:space-y-8">
        {experience.map((co, i) => (
          <Reveal key={co.company} className="card p-5 sm:p-8" delay={i * 0.05}>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-5">
              <h3 className="text-xl font-semibold">{co.company}</h3>
              <span className="mono text-xs uppercase tracking-[0.1em] text-accent">{co.period}</span>
            </div>
            <ol className="relative ml-2 border-l border-line pl-6">
              {co.roles.map((r) => (
                <li key={r.title} className="relative pb-9 last:pb-0">
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-medium text-fg">{r.title}</h4>
                    <span className="mono text-[11px] text-muted">{r.period}</span>
                  </div>
                  <ul className="mt-3 space-y-2.5 text-base leading-[1.65] text-muted">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
