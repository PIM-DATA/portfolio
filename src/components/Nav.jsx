import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { nav, profile } from '../data/profile.js'

const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }

export default function Nav({ route = 'home' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(nav[0].href)
  const [hovered, setHovered] = useState(null)

  // scroll spy — the tab whose section has passed 40% of the viewport is active
  useEffect(() => {
    const sections = nav.filter((n) => !n.href.startsWith('#/')).map((n) => ({ href: n.href, el: document.querySelector(n.href) })).filter((s) => s.el)
    const update = () => {
      setScrolled(window.scrollY > 24)
      if (route !== 'home') { setActive(`#/${route}`); return }
      const line = window.scrollY + window.innerHeight * 0.4
      let cur = sections[0]?.href
      for (const s of sections) {
        const top = getComputedStyle(s.el).position === 'fixed' ? document.documentElement.scrollHeight - s.el.offsetHeight : s.el.offsetTop
        if (top <= line) cur = s.href
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = sections.at(-1).href
      setActive(cur)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [route])

  const current = hovered ?? active

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#home" className="mono text-sm tracking-widest text-fg">
          <span className="text-accent">●</span> {profile.nickname.toUpperCase()}.DATA
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-4 md:flex">
          <ul
            className="relative flex items-center rounded-full border border-line bg-surface/70 p-1 backdrop-blur-md"
            onMouseLeave={() => setHovered(null)}
          >
            {nav.map((n) => {
              const isCurrent = current === n.href
              const isActive = active === n.href
              return (
                <li key={n.href} className="relative">
                  <a
                    href={n.href}
                    onMouseEnter={() => setHovered(n.href)}
                    onFocus={() => setHovered(n.href)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`mono relative z-10 block px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors duration-200 ${
                      isCurrent ? 'text-accent-ink' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {n.label}
                  </a>
                  {isCurrent && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-accent"
                      style={{ boxShadow: '0 0 20px -4px rgb(79 209 255 / 0.7)' }}
                    />
                  )}
                  {isActive && !isCurrent && (
                    <motion.span
                      layoutId="nav-dot"
                      transition={spring}
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                    />
                  )}
                </li>
              )
            })}
          </ul>
          <motion.a
            href={profile.cvFile}
            download
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary !py-2 !px-4 !text-xs"
          >
            Download CV
          </motion.a>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="mono text-xs uppercase tracking-[0.12em] text-fg md:hidden"
        >
          {open ? 'close' : 'menu'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Primary mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-line bg-bg/95 px-5 py-6 backdrop-blur-md md:hidden"
          >
            <motion.div
              className="flex flex-col gap-5"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {nav.map((n) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  className={`display flex items-center gap-3 text-3xl ${active === n.href ? 'text-accent' : 'text-fg'}`}
                >
                  {active === n.href && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  {n.label}
                </motion.a>
              ))}
              <motion.a
                href={profile.cvFile}
                download
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                className="btn-primary w-fit"
              >
                Download CV
              </motion.a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
