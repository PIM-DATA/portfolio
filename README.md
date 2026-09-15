# Phimphimai Buranchai — Data Analyst Portfolio

**Live site:** https://phimphimaipim.vercel.app

A personal portfolio for a Bangkok-based Data Analyst / BI Analyst, built as a single-page React app. Beyond the usual profile, experience, and project cards, it contains **four interactive dashboard rebuilds** — three Power BI pages and one Looker Studio report that I built at work, recreated for the web with the same layouts, filters, and logic.

> **Every number on this site is synthetic.** The original dashboards run on confidential business data. Each rebuild generates its dataset from a fixed random seed at load time, so the visuals behave like the real reports without exposing a single real figure.

## What's inside

| Section | Highlights |
|---|---|
| **Home** | Profile, skills by group, tool icons, certifications (with lightbox), experience timeline from my CV |
| **Work** | 12 project case studies — self-service analytics (Databricks Genie), feature analytics, market research, BI dashboards, GA4 reporting, data engineering, RFM segmentation, social listening — each with an illustrative SVG chart |
| **Dashboards** (`/#/dashboard`) | 4 rebuilt reports, stacked with a sticky jump-nav: **New customers by province** (77-province choropleth, region/province/round filters, age × gender, sortable table) · **LINE OA Block** (active vs blocked, round-over-round deltas, 3-year monthly trend) · **LINE OA Broadcast** (sent/opened/clicked/cost KPIs, per-round table, daily and hourly views) · **GA4 E-commerce** (Looker-style sidebar pages, scorecards with period comparison and sparklines, revenue trend, funnel, country/device) |

## Design notes

- **Charts are hand-written SVG** (no chart library) — hover tooltips, crosshairs, sortable tables, and a data-table fallback on the smaller charts.
- **One y-axis per chart.** Where the originals used dual axes, the rebuild splits them into paired charts sharing an x-axis.
- **Palette validated for colour-vision deficiency** (adjacent-series ΔE checked) with legends and 2px gaps as secondary encoding; status colours carry an icon, never colour alone.
- Animated "data constellation" background on canvas, reveal footer, scroll-spy navigation; all motion respects `prefers-reduced-motion`.
- Thailand province geometry simplified from [apisit/thailand.json](https://github.com/apisit/thailand.json) (MIT) and pre-projected into SVG paths. Brand icons from [Simple Icons](https://simpleicons.org) (CC0).

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · Framer Motion · deployed on Vercel (auto-deploys from `main`)

```
src/
  data/profile.js      all copy: profile, skills, experience, projects, dashboard case studies
  data/thailand.js     77 province paths + regions
  components/          page sections (Hero, About, Experience, Work, Footer, Nav, Background …)
  charts/              small SVG charts used on project cards
  dashboard/           the four dashboard rebuilds + synthetic data generators
  pages/DashboardPage.jsx
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Contact

Phimphimai Buranchai · Bangkok · Phimphimaiburanchai@gmail.com

---

<details>
<summary>หมายเหตุสำหรับตัวเอง (ภาษาไทย)</summary>

- ข้อความทั้งหมดแก้ที่ `src/data/profile.js` — Experience ให้ตรงตาม CV, `featured: true` = โปรเจกต์ที่โชว์หน้าแรก
- เปลี่ยน CV: วางไฟล์ทับ `public/Phimphimai-Buranchai-CV.pdf` · ใบเซอร์อยู่ `public/certs/` · รูปโปรไฟล์ `public/profile.jpg`
- ใส่ LinkedIn / LINE: `profile.linkedin`, `profile.line` ใน `profile.js` (จะโผล่ที่ footer)
- แดชบอร์ด: ข้อมูลจำลองอยู่ใน `src/dashboard/*.jsx` และ `data.js` · ข้อความ case study อยู่ที่ `dashboards` ใน `profile.js`
- สี/ฟอนต์: `src/index.css` (บล็อก `@theme`)
- อัปเดตเว็บ: แก้ → `git commit` → `git push` → Vercel build ให้เองใน ~1 นาที · เปลี่ยนชื่อลิงก์ที่ Vercel → Settings → Domains
- ไฟล์ต้นฉบับที่มีข้อมูลจริง (PDF portfolio, รูปดิบ, screenshots) ถูกกันไม่ให้ขึ้น GitHub ใน `.gitignore`

</details>
