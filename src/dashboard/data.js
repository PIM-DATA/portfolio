import { PROVINCES } from '../data/thailand.js'

// ─── ข้อมูลจำลอง (synthetic) ───────────────────────────────────────────
// ตัวเลขทั้งหมด generate จาก seed คงที่ — ไม่ใช่ข้อมูลจริงของบริษัทใด
// โครงสร้าง: จังหวัด × งวด × ช่วงอายุ × เพศ → จำนวนลูกค้าใหม่

export const ROUNDS = ['2026-06-16', '2026-07-01', '2026-07-16', '2026-08-01', '2026-08-16', '2026-09-01']
export const AGES = ['18-', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
export const GENDERS = [
  { key: 'F', label: 'Female' },
  { key: 'M', label: 'Male' },
  { key: 'U', label: 'Unspecified' },
]

const AGE_W = [0.12, 0.15, 0.31, 0.2, 0.12, 0.07, 0.03]
const GENDER_W = [0.37, 0.33, 0.3]
const ROUND_W = [0.85, 1.0, 0.92, 1.1, 1.05, 1.18]

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// รายการจังหวัดที่ใช้ในแดชบอร์ด = 77 จังหวัด + "ไม่ระบุ"
export const UNSPECIFIED = { id: 'Unspecified', th: 'ไม่ระบุ', region: null, w: 30 }
export const ALL_PROVINCES = [...PROVINCES, UNSPECIFIED]

// rows: { province, region, round, age, gender, n }
export const ROWS = (() => {
  const rnd = mulberry32(20260915)
  const rows = []
  for (const p of ALL_PROVINCES) {
    const base = p.w * 5.6 * (0.7 + rnd() * 0.6)
    for (let r = 0; r < ROUNDS.length; r++) {
      const rb = base * ROUND_W[r] * (0.85 + rnd() * 0.3)
      for (let a = 0; a < AGES.length; a++) {
        for (let g = 0; g < GENDERS.length; g++) {
          // ลูกค้าที่ไม่ระบุจังหวัด มักไม่ระบุเพศด้วย
          const gw = p === UNSPECIFIED ? [0.2, 0.18, 0.62][g] : GENDER_W[g]
          const n = Math.round(rb * AGE_W[a] * gw * (0.75 + rnd() * 0.5))
          if (n > 0) rows.push({ province: p.id, region: p.region, round: ROUNDS[r], age: AGES[a], gender: GENDERS[g].key, n })
        }
      }
    }
  }
  return rows
})()

export function aggregate(rows, filters) {
  const { regions, provinces, rounds } = filters
  const byProvince = new Map()
  const byAge = Object.fromEntries(AGES.map((a) => [a, { F: 0, M: 0, U: 0 }]))
  const total = { F: 0, M: 0, U: 0 }
  for (const r of ROWS) {
    if (regions.size && r.region && !regions.has(r.region)) continue
    if (regions.size && !r.region) continue
    if (provinces.size && !provinces.has(r.province)) continue
    if (rounds.size && !rounds.has(r.round)) continue
    const p = byProvince.get(r.province) ?? { F: 0, M: 0, U: 0 }
    p[r.gender] += r.n
    byProvince.set(r.province, p)
    byAge[r.age][r.gender] += r.n
    total[r.gender] += r.n
  }
  return { byProvince, byAge, total }
}

export const sum = (o) => o.F + o.M + o.U
export const fmt = (n) => n.toLocaleString('en-US')
