import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { profile, stats } from '../data/profile.js'
import { fadeUp, stagger, NO_ANIM } from './Section.jsx'
import { CountUp } from '../charts/shared.jsx'

// ── เมาส์ขยับ → ชิ้นส่วนใน hero ขยับตามคนละระยะ (ให้ดูมีมิติ) ──
// ปรับแรงได้ที่ depth ของแต่ละ <Layer> (ค่าบวก = ไปทางเดียวกับเมาส์, ลบ = สวนทาง)
function useMouse() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const y = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return // มือถือ/จอสัมผัส ไม่ต้องขยับ
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2) // -1 … 1
      my.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    const onLeave = () => { mx.set(0); my.set(0) }
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [mx, my])
  return { x, y }
}

function Layer({ mouse, depth, tilt = 0, className = '', children }) {
  const x = useTransform(mouse.x, (v) => v * depth)
  const y = useTransform(mouse.y, (v) => v * depth * 0.6)
  const rotateY = useTransform(mouse.x, (v) => v * tilt)
  const rotateX = useTransform(mouse.y, (v) => -v * tilt)
  return (
    <motion.div style={{ x, y, rotateX, rotateY, transformPerspective: 600 }} className={className}>
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const mouse = useMouse()
  return (
    <section id="home" className="relative z-10 overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      
      <motion.div variants={stagger} initial={NO_ANIM ? false : "hidden"} animate="show" className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Layer mouse={mouse} depth={6}>
          <motion.div variants={fadeUp} className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {profile.available && (
              <span className="chip !border-accent/40 !text-accent">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                {profile.availabilityText}
              </span>
            )}
            <span className="chip">{profile.location}</span>
          </motion.div>
          </Layer>

          {/* ชื่อตัวใหญ่ + รูปวงรีตรงกลาง (ไอเดียจาก portfolio-hero บน 21st.dev) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-6" aria-hidden="true">
            <Layer mouse={mouse} depth={-14}>
              <BlurWord text={profile.heroWords[0]} start={0} />
            </Layer>
            {profile.photo && (
              <motion.div
                initial={NO_ANIM ? false : { opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative shrink-0"
              >
                <Layer mouse={mouse} depth={22} tilt={10} className="relative">
                <div className="absolute -inset-2 rounded-full bg-accent/20 blur-xl" />
                <div className="relative h-[80px] w-[48px] overflow-hidden rounded-full border border-accent/30 shadow-2xl transition-transform duration-300 hover:scale-110 sm:h-[150px] sm:w-[90px] md:h-[190px] md:w-[112px] lg:h-[220px] lg:w-[130px]">
                  <img src={profile.photo} alt="" className="h-full w-full object-cover object-top" loading="eager" />
                </div>
                </Layer>
              </motion.div>
            )}
            <Layer mouse={mouse} depth={-14}>
              <BlurWord text={profile.heroWords[1]} start={profile.heroWords[0].length + 2} />
            </Layer>
          </div>

          <Layer mouse={mouse} depth={8}>
            <motion.h1 variants={fadeUp} className="display mt-8 text-3xl text-fg sm:text-5xl">
              {profile.name}
            </motion.h1>
          </Layer>

          <motion.p variants={fadeUp} className="mono mt-4 text-sm uppercase tracking-[0.1em] text-muted sm:text-[15px]">
            {profile.title} · {profile.tagline}
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-[1.75] text-muted sm:text-xl sm:leading-[1.7]">
            {profile.heroIntro}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-3">
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

        <motion.dl variants={fadeUp} className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-surface px-6 py-7">
              <dd className="stat-num order-1 text-5xl text-fg md:text-6xl"><CountUp value={s.value} accent /></dd>
              <dt className="order-2 mt-3 text-sm font-medium text-fg">{s.label}</dt>
              {s.note && <dd className="order-3 mono mt-1 text-xs text-muted">{s.note}</dd>}
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}

// ตัวอักษรค่อย ๆ ชัดขึ้นทีละตัว (blur → ชัด)
function BlurWord({ text, start = 0 }) {
  return (
    <span className="flex text-[52px] font-extrabold uppercase leading-none tracking-tighter text-accent sm:text-[120px] md:text-[160px] lg:text-[200px]">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={NO_ANIM ? false : { opacity: 0, y: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: (start + i) * 0.1, ease: 'easeOut' }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
