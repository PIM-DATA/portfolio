import { useEffect } from 'react'
import { useRoute, routeOf } from './router.js'
import Background from './components/Background.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Work from './components/Work.jsx'
import Footer from './components/Footer.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export default function App() {
  const route = useRoute()

  // เปลี่ยนหน้า → เลื่อนขึ้นบนสุด; กลับหน้าแรกพร้อม anchor (#work) → เลื่อนไป section นั้น
  useEffect(() => {
    const h = window.location.hash
    if (route === 'home' && h && !h.startsWith('#/')) {
      requestAnimationFrame(() => {
        document.querySelector(h)?.scrollIntoView()
        window.dispatchEvent(new Event('scroll'))
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
      window.dispatchEvent(new Event('scroll'))
    }
  }, [route])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href="#contact"]')
      if (!a) return
      e.preventDefault()
      if (routeOf(window.location.hash) !== 'home') window.location.hash = ''
      requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Nav route={route} />
      {/* main ทึบและอยู่เหนือ footer; margin-bottom = ความสูง footer เพื่อให้เลื่อนเปิดเห็น footer */}
      <main className="relative isolate z-10 bg-bg md:mb-[72svh] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        <Background />
        {route === 'dashboard' ? (
          <DashboardPage />
        ) : (
          <>
            <Hero />
            <Marquee />
            <About />
            <Experience />
            <Work />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
