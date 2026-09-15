import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'

// Reveal footer: บน desktop ติดอยู่ล่างสุดของ viewport (fixed) เนื้อหาหลักเลื่อนเปิดออกให้เห็น
// ความสูงต้องตรงกับ margin-bottom ของ <main> ใน App.jsx (md:mb-[72svh])
const Icon = {
  mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  line: <path d="M5 5.8C6.8 4.1 9.3 3.2 12 3.2c5 0 9 3.1 9 7 0 3.5-3.3 6.4-7.6 6.9L8.5 20v-3.3C5.3 15.7 3 13.2 3 10.2c0-1.6.7-3.2 2-4.4z" />,
  cv: <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />,
  linkedin: <path d="M8 11v5M8 8.5v.01M12 16v-5m0 0v5m0-5c0-1.2.8-2 2-2s2 .8 2 2v5M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5v-13z" />,
  up: <path d="M5 10l7-7m0 0l7 7m-7-7v18" />,
}

export default function Footer() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  // เมื่อเลื่อนจนเห็น footer เกิน 20% → เนื้อหาเลื่อนขึ้น + ไอคอนเด้งหนึ่งรอบ
  // (footer เป็น fixed จึงคำนวณจากตำแหน่ง scroll แทน IntersectionObserver)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const doc = document.documentElement
      const revealed = window.scrollY + window.innerHeight - (doc.scrollHeight - el.offsetHeight)
      setShown(revealed / el.offsetHeight > 0.2)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  const actions = [
    { icon: 'mail', label: 'Email', short: profile.email, href: `mailto:${profile.email}` },
    { icon: 'phone', label: 'Call', short: profile.phone, href: profile.phoneHref },
    profile.line && { icon: 'line', label: 'LINE', short: profile.line, href: profile.lineHref || undefined },
    profile.linkedin && { icon: 'linkedin', label: 'LinkedIn', short: 'Profile', href: profile.linkedin, ext: true },
    { icon: 'cv', label: 'Download CV', short: 'PDF', href: profile.cvFile, download: true },
  ].filter(Boolean)

  return (
    <footer
      id="contact"
      ref={ref}
      className="reveal-footer relative z-0 flex min-h-[640px] w-full flex-col justify-between overflow-hidden md:fixed md:bottom-0 md:left-0 md:h-[72svh] md:min-h-[540px] md:max-h-[760px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface via-bg to-bg" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className={`footer-content relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-8 pt-20 text-center sm:px-8 md:pt-0 ${shown ? 'is-shown' : ''}`}>
        <p className="eyebrow mb-5 footer-rise" style={{ '--d': 0 }}>Contact</p>
        <h2 className="display glow-heading text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          <span className="block footer-rise" style={{ '--d': 1 }}>Need a</span>
          <span className="block text-accent footer-rise" style={{ '--d': 2 }}>data analyst?</span>
        </h2>
        <p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-muted footer-rise" style={{ '--d': 3 }}>
          {profile.availabilityText}. For teams and recruiters looking for reliable data prep, clear dashboards, and analysis that answers the actual business question. Full portfolio deck available on request.
        </p>

        <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-2.5">
          {actions.map((a, i) => (
            <a
              key={a.label}
              href={a.href}
              download={a.download || undefined}
              target={a.ext ? '_blank' : undefined}
              rel={a.ext ? 'noreferrer' : undefined}
              className="footer-pill footer-rise group"
              style={{ '--i': i, '--d': 4 + i }}
            >
              <span className="footer-icon flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{Icon[a.icon]}</svg>
              </span>
              <span className="text-sm font-medium">{a.label}</span>
              <span className="mono hidden text-[11px] text-muted sm:inline">{a.short}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <p className="mono text-xs uppercase tracking-[0.1em] text-muted">© {new Date().getFullYear()} {profile.name}</p>
          <p className="mono text-xs uppercase tracking-[0.1em] text-muted">Designed & built with <span className="text-accent">♥</span> in Bangkok</p>
          <a href="#home" className="footer-pill group !py-1.5" aria-label="Back to top">
            <span className="footer-icon flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-fg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{Icon.up}</svg>
            </span>
            <span className="mono text-xs uppercase tracking-[0.1em]">Top</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
