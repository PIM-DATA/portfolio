import { useEffect, useState } from 'react'

// hash routing แบบง่าย: '#/dashboard' = หน้าแดชบอร์ด, อย่างอื่น = หน้าแรก (anchor '#about' ฯลฯ ยังใช้เลื่อนหน้าได้)
export const routeOf = (hash) => (hash.startsWith('#/') ? hash.slice(2).split('?')[0] : 'home')

export function useRoute() {
  const [route, setRoute] = useState(() => routeOf(window.location.hash))
  useEffect(() => {
    const on = () => setRoute(routeOf(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
