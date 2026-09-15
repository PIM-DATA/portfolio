import { motion } from 'framer-motion'

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

// ?noanim ปิด reveal animation (ใช้ตอน screenshot/ทดสอบ)
export const NO_ANIM = typeof window !== 'undefined' && window.location.search.includes('noanim')

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={NO_ANIM ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export default function Section({ id, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} className={`relative z-10 scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 max-w-2xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          {title && <h2 className="display text-[2.6rem] leading-[1.05] sm:text-5xl">{title}</h2>}
          {intro && <p className="mt-5 text-[17px] leading-[1.65] text-muted sm:text-lg">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
