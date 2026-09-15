import { useEffect, useRef } from 'react'

// พื้นหลังเคลื่อนไหว: จุดข้อมูลลอย + เส้นเชื่อมเมื่ออยู่ใกล้ + แสงฟุ้งสีฟ้า
// ปรับความหนาแน่น/ความเร็วได้ที่ค่าด้านล่าง
const DENSITY = 1 / 14000 // จุดต่อพิกเซล² (1440×900 ≈ 90 จุด)
const LINK_DIST = 130
const SPEED = 0.18
const MOUSE_RADIUS = 160
const ACCENT = [79, 209, 255] // #4fd1ff

export default function Background() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, dpr = 1, raf = 0, pts = []
    const mouse = { x: -9999, y: -9999 }

    const make = () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
      r: 1 + Math.random() * 1.6,
      a: 0.25 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2, // twinkle phase
    })

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(w * h * DENSITY)
      pts = Array.from({ length: n }, make)
    }

    let t = 0
    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, w, h)

      // move
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        // ผลักออกจากเมาส์เบาๆ
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / MOUSE_RADIUS) * 0.4
          p.x += (dx / d) * f; p.y += (dy / d) * f
        }
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20
      }

      // links
      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue
          const k = 1 - Math.sqrt(d2) / LINK_DIST
          ctx.strokeStyle = `rgba(${ACCENT},${k * 0.16})`
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        }
      }

      // dots
      for (const p of pts) {
        const tw = 0.7 + 0.3 * Math.sin(t * 2 + p.tw)
        ctx.fillStyle = `rgba(${ACCENT},${p.a * tw})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw) }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* แสงฟุ้งเลื่อนช้าๆ */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  )
}
