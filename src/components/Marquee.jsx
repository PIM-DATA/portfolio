import { tools, profile } from '../data/profile.js'
import { BrandIcon } from './Icons.jsx'

export default function Marquee() {
  const items = [...(profile.available ? [{ name: 'OPEN TO WORK', open: true }] : []), ...tools]
  const row = items.flatMap((t) => [t, null])
  return (
    <div className="relative z-10 overflow-hidden border-y border-line bg-surface py-3" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[...row, ...row].map((t, i) =>
          t === null ? (
            <span key={i} className="text-xs text-accent">✦</span>
          ) : (
            <span key={i} className={`mono flex items-center gap-2 text-xs uppercase tracking-[0.14em] ${t.open ? 'text-accent' : 'text-muted'}`}>
              {t.icon && <BrandIcon name={t.icon} size={16} />}
              {t.name}
            </span>
          ),
        )}
      </div>
    </div>
  )
}
