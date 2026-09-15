import { C } from './shared.jsx'

// ข้อมูลตัวอย่าง (illustrative) — ชั่วโมงเตรียมรายงานต่อสัปดาห์ ก่อน/หลัง
const before = 10, after = 6
const W = 320, H = 170

export default function StatTile() {
  const max = before
  const barW = (v) => (v / max) * (W - 120)
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Weekly report prep time reduced about 40 percent (illustrative)">
        <text x="0" y="52" fontSize="56" fill={C.textStrong} fontFamily="var(--font-sans)" fontWeight="700">−40%</text>
        <text x="0" y="74" fontSize="10" fill={C.text} fontFamily="var(--font-mono)" letterSpacing="1.5">WEEKLY REPORT PREP TIME</text>

        {[{ l: 'Before', v: before, c: C.mid }, { l: 'After', v: after, c: C.s1 }].map((b, i) => {
          const y = 100 + i * 30
          return (
            <g key={b.l}>
              <text x="0" y={y + 7} fontSize="10" fill={C.text} fontFamily="var(--font-mono)">{b.l}</text>
              <rect x="56" y={y} width={barW(b.v)} height="12" rx="4" fill={b.c} />
              <rect x="56" y={y} width="4" height="12" fill={b.c} />
              <text x={56 + barW(b.v) + 8} y={y + 7} dy="0.35em" fontSize="10" fill={C.textStrong} fontFamily="var(--font-mono)">{b.v} hrs</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
