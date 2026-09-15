# Phimphimai Buranchai — Data Analyst Portfolio

เว็บ Portfolio แบบ single-page ทำด้วย **React + Vite + Tailwind CSS v4 + Framer Motion**

## รันดูบนเครื่อง

```bash
npm install     # ครั้งแรกครั้งเดียว
npm run dev     # เปิด http://localhost:5173
```

## แก้ไขเนื้อหา

ข้อมูลทั้งหมด (ชื่อ, ประสบการณ์, skills, projects, ช่องทางติดต่อ) อยู่ที่ไฟล์เดียว:

```
src/data/profile.js
```

- **เปลี่ยน CV** — วางไฟล์ PDF ใหม่ทับ `public/Phimphimai-Buranchai-CV.pdf`
- **ใส่ LinkedIn / GitHub** — แก้ `profile.linkedin` และ `profile.github` ใน `profile.js` (จะโชว์ในส่วน Contact อัตโนมัติ)
- **ปิดป้าย "Open to work"** — ตั้ง `available: false`
- **แก้กราฟใน Projects** — ตัวเลขตัวอย่างอยู่ใน `src/charts/*.jsx`
- **แดชบอร์ด (หน้า `#/dashboard`)** — ข้อมูลจำลอง generate ใน `src/dashboard/data.js` (เปลี่ยน seed / สัดส่วนได้), ข้อความ case study อยู่ใน `dashboardCase` ของ `profile.js`, แผนที่จังหวัดอยู่ใน `src/data/thailand.js`
- **เปลี่ยนสี / ฟอนต์** — ตัวแปรอยู่ใน `src/index.css` (บล็อก `@theme`)

## Deploy ขึ้น Vercel (ฟรี)

1. สร้าง repo บน GitHub แล้ว push โฟลเดอร์นี้ขึ้นไป
2. ไปที่ https://vercel.com → **Add New Project** → เลือก repo
3. Vercel ตรวจเจอ Vite เอง กด **Deploy** ได้เลย (Build command: `npm run build`, Output: `dist`)

หรือใช้ CLI: `npx vercel`

## โครงสร้าง

```
src/
  data/profile.js      ← เนื้อหาทั้งหมด
  components/          ← Nav, Hero, Marquee, About, Experience, Work, Contact, Footer
  charts/              ← กราฟ SVG ในการ์ด Projects (มี tooltip + data table)
  pages/DashboardPage.jsx ← หน้าแดชบอร์ดแยก (เข้าจากเมนู Dashboard หรือการ์ดใน Work)
  router.js            ← hash routing แบบง่าย
  dashboard/           ← แดชบอร์ด interactive (filter, แผนที่, กราฟ, ตาราง) ใช้ข้อมูลจำลอง
  index.css            ← สี ฟอนต์ และ utility classes
public/
  Phimphimai-Buranchai-CV.pdf
```
