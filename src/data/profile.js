// ─────────────────────────────────────────────────────────────
//  แก้ข้อมูลทั้งหมดของเว็บได้ที่ไฟล์นี้ไฟล์เดียว
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Phimphimai Buranchai',
  nickname: 'Pim',
  title: 'Data Analyst | BI Analyst',
  tagline: 'Customer & Business Analytics',
  location: 'Bang Na, Bangkok, Thailand',
  phone: '098-482-4772',
  phoneHref: 'tel:+66984824772',
  email: 'Phimphimaiburanchai@gmail.com',
  line: '',            // LINE ID เช่น 'pimpim' (เว้นว่าง = ไม่แสดง)
  lineHref: '',        // ลิงก์ LINE เช่น 'https://line.me/ti/p/~pimpim'
  linkedin: '',        // ใส่ลิงก์ LinkedIn เช่น 'https://www.linkedin.com/in/xxx'
  github: '',          // ใส่ลิงก์ GitHub ถ้ามี
  cvFile: 'Phimphimai-Buranchai-CV.pdf',
  photo: 'profile.jpg',   // รูปโปรไฟล์ใน public/ (ลบบรรทัดนี้ถ้าไม่อยากโชว์รูป)
  available: true,
  availabilityText: 'Open to Data Analyst / BI roles',
  heroIntro:
    'Bangkok-based data analyst turning raw customer and transaction data into dashboards, segments, and decisions — with SQL, Databricks, Power BI, and Looker Studio.',
  summary:
    'Data Analyst with hands-on experience in SQL, Databricks, Power BI, and Looker Studio, focusing on business data preparation, dashboard development, data validation, and ad-hoc analysis. Skilled in customer analytics, RFM segmentation, purchase behavior, and KPI reporting, with a background in social and consumer insight and practical use of AI tools to support analysis and problem solving.',
}

export const stats = [
  { value: '4+', label: 'Years in data & insight' },
  { value: '10+', label: 'Dashboards shipped' },
  { value: '27', label: 'Ad-hoc analyses · Feb–May 2026' },
  { value: '40%', label: 'Faster weekly reporting' },
]

export const skills = [
  {
    group: 'Data & Query',
    items: ['SQL', 'Databricks', 'Data Preparation', 'Data Cleaning', 'Data Quality Checking'],
  },
  {
    group: 'BI & Reporting',
    items: ['Power BI', 'Looker Studio', 'KPI Reporting', 'Microsoft Excel'],
  },
  {
    group: 'Analytics',
    items: ['Customer Analytics', 'RFM', 'Customer Segmentation', 'Purchase Behavior', 'AOV', 'Basket Size', 'Repeat Purchase'],
  },
  {
    group: 'Digital Analytics',
    items: ['Google Analytics 4 (GA4)', 'Web Traffic Analysis', 'User Behavior Analysis'],
  },
  {
    group: 'Social Insight',
    items: ['Social Listening', 'Sentiment Analysis', 'Social Trend Analysis', 'Crisis Monitoring'],
  },
  {
    group: 'AI Tools',
    items: ['ChatGPT', 'Claude'],
  },
]

// icon = key ใน src/components/Icons.jsx
export const tools = [
  { name: 'SQL', icon: 'sql', note: 'Query · join · validate' },
  { name: 'Databricks', icon: 'databricks', note: 'Data prep at scale' },
  { name: 'Power BI', icon: 'powerbi', note: 'Dashboards · DAX' },
  { name: 'Looker Studio', icon: 'looker', note: 'Reporting' },
  { name: 'Excel', icon: 'microsoftexcel', note: 'Analysis · pivots' },
  { name: 'GA4', icon: 'googleanalytics', note: 'Web & user behavior' },
  { name: 'Microsoft Fabric', icon: 'microsoft', note: 'Certified · 2026' },
  { name: 'ChatGPT', icon: 'openai', note: 'AI-assisted analysis' },
  { name: 'Claude', icon: 'claude', note: 'AI-assisted analysis' },
]

export const languages = [
  { name: 'Thai', level: 'Native' },
  { name: 'Chinese', level: 'Conversational' },
  { name: 'English', level: 'Basic working proficiency' },
]

// ตรงตาม CV (Resume - Phimphimai Buranchai.pdf)
export const experience = [
  {
    company: '7 Days Success Co., Ltd.',
    period: 'Jun 2022 — Present',
    roles: [
      {
        title: 'Junior Data Analyst',
        period: 'Feb 2026 — Present',
        bullets: [
          'Use SQL and Databricks to retrieve, join, validate, and prepare data from multiple tables for customer, transaction, and business analysis.',
          'Prepare customer analytics datasets covering RFM, AOV, Basket Size, Purchase Frequency, Repeat Purchase, and Customer Segmentation for dashboards and recurring analysis.',
          'Analyze customer and transaction data across users, orders, purchase rounds, dates, and provinces to identify purchasing patterns and support marketing and business decisions.',
          'Validate source and reporting data by investigating duplicates, missing values, date inconsistencies, and reporting discrepancies to improve reporting reliability.',
          'Support Power BI and Looker Studio dashboards and ad-hoc analysis by translating business questions into required metrics, datasets, and reporting outputs.',
        ],
      },
      {
        title: 'Business Intelligence Developer',
        period: 'Sep 2025 — Jan 2026',
        bullets: [
          'Designed Power BI dashboards, prepared multi-source data for reporting, and reduced weekly report preparation time by approximately 40%.',
          'Created data quality checks to reduce reporting errors before presentation.',
        ],
      },
      {
        title: 'Monitoring & Social Insight Specialist',
        period: 'Jun 2022 — Sep 2025',
        bullets: [
          'Analyzed social media data through social listening to identify trends, sentiment, and emerging brand issues.',
          'Prepared insight reports for marketing and communication teams.',
        ],
      },
    ],
  },
  {
    company: 'IDA Intelligent Data Analytics Co., Ltd.',
    period: '2020 — 2022',
    roles: [
      {
        title: 'Social Intelligence Service Officer',
        period: '2020 — 2022',
        bullets: [
          'Collected and analyzed multi-channel online data for corporate clients.',
          'Monitored issues that could develop into crises, assessed potential impact on brand reputation, and summarized key developments.',
          'Prepared crisis monitoring and insight reports to support timely client response and decision-making.',
        ],
      },
    ],
  },
]

export const education = [
  {
    degree: 'Bachelor of Arts in Chinese for Communication',
    school: 'Rajamangala University of Technology Krungthep',
  },
]

// image = รูปใบเซอร์ใน public/certs/ (กดแล้วขยายดูได้)
export const certifications = [
  { name: 'Microsoft Fabric Essential for Business', issuer: '9Expert Corporation', date: 'Apr 2026', hours: '12 hrs', image: 'certs/microsoft-fabric.jpg' },
  { name: 'Power BI Advanced Visualization and AI', issuer: '9Expert Corporation', date: 'Jul 2025', hours: '12 hrs', image: 'certs/powerbi-advanced.jpg' },
  { name: 'Full Stack Structural Foundation', issuer: 'borntodev Academy', date: 'Apr 2026', hours: '2-day bootcamp', image: 'certs/fullstack-foundation.jpg' },
]

// ผลงาน — สรุปจาก PHIMPHIM_Portfolio.pdf (Feb–May 2026) + CV
// chart = key ใน src/charts/index.js ; กราฟทุกตัวเป็นค่าจำลอง ไม่ใช่ตัวเลขจริง
// link = ใส่ URL ได้ถ้าเว็บนั้นปลอดภัยพอจะเปิดสาธารณะ (เว้นว่างไว้ = ไม่แสดงปุ่ม)
// featured: true = โชว์ในหน้าแรกทันที (ที่เหลือซ่อนอยู่หลังปุ่ม View all projects)
export const projects = [
  {
    id: 'genie',
    featured: true,
    chart: 'genie',
    category: 'Self-service & AI',
    title: 'Genie Space for Lottery Analytics',
    description:
      'Designed a Databricks Genie space so non-technical teams can ask lottery questions in plain language and get trustworthy answers — defining data sources, join logic, time-zone rules, location-cleaning rules, and business definitions behind every answer.',
    tags: ['Databricks', 'Genie', 'SQL', 'Self-service'],
    highlights: ['Fewer repeat ad-hoc queries', 'Consistent business definitions', 'Faster access for marketing & ops'],
  },
  {
    id: 'scan',
    featured: true,
    chart: 'funnel',
    category: 'Product Analytics',
    title: '"ฝากตรวจหวย" Feature Analytics',
    description:
      'End-to-end tracking for a ticket-checking feature in the app: raw data prep, analysis tables, scheduled job runs, then a dashboard and insight summary for the Marcom team to measure campaigns and user behaviour.',
    tags: ['SQL', 'Databricks Jobs', 'Dashboard', 'Web app'],
    highlights: ['Per-round usage & hit rate', 'Acquisition funnel by segment', 'Built and deployed as a web dashboard'],
    link: '',
  },
  {
    id: 'map',
    featured: true,
    chart: 'dotmap',
    category: 'Data Storytelling',
    title: 'Digital Map of First-Prize Winners',
    description:
      'Built an interactive map end-to-end — showing where first-prize winners are, in Thailand and abroad, with prize amounts and ticket counts — so executives can present the brand\'s track record to visitors and partners in a way that is easy to grasp.',
    tags: ['Web map', 'Data prep', 'Storytelling'],
    highlights: ['Region / country filters', '3D globe view', 'Executive & visitor-ready'],
    link: '',
  },
  {
    id: 'market',
    chart: 'donut',
    category: 'Market Research',
    title: 'Thai Lottery Market Overview',
    description:
      'Market-sizing and trend analysis of the online lottery market — comparing digital, platform, and paper channels alongside economic context and consumer behaviour to surface business opportunities, shifts in buying behaviour, and competitive trends.',
    tags: ['Market analysis', 'Public data', 'Consumer insight'],
    highlights: ['Channel share & forecast', 'Consumer behaviour scenes', 'Input to strategy & Marcom'],
    link: '',
  },
  {
    id: 'bu',
    chart: 'kpis',
    category: 'BI Dashboards',
    title: 'Business-Unit Performance Dashboards',
    description:
      'Designed dashboards for several business units in the group — a media app, a marketplace, and a hotel check-in product — consolidating each BU\'s key metrics (users, MAU/DAU, stickiness, growth) into one page for planning and monitoring.',
    tags: ['Power BI', 'Looker Studio', 'KPI design'],
    highlights: ['One page per BU', 'Consistent KPI definitions', 'Faster monthly reviews'],
  },
  {
    id: 'social',
    chart: 'social',
    category: 'BI Dashboards',
    title: 'Social Media Performance Dashboard',
    description:
      'Looker Studio dashboards for TikTok and Facebook channels — reach, engagement, follower growth, and content performance — so the content team can see which posts work and adjust strategy quickly.',
    tags: ['Looker Studio', 'TikTok', 'Facebook', 'Content analytics'],
    highlights: ['Channel KPIs with date range', 'Post-level performance table', 'Engagement trend'],
  },
  {
    id: 'ga4',
    featured: true,
    chart: 'ga4',
    category: 'Digital Analytics',
    title: 'GA4 E-commerce Report (Looker Studio)',
    description:
      'A four-page Looker Studio report on GA4 data for a marketplace: overview KPIs (active users, transactions, purchaser rate, revenue per customer), product analysis, purchase funnel, and customer analysis — with period-over-period comparison and country / device breakdowns.',
    tags: ['GA4', 'Looker Studio', 'E-commerce', 'Funnel'],
    highlights: ['Session → purchase funnel', 'Period-over-period deltas', 'Country & device performance'],
  },
  {
    id: 'ads',
    chart: 'ads',
    category: 'Digital Analytics',
    title: 'Ads Performance Dashboard (Looker Studio)',
    description:
      'One Looker Studio report covering every paid campaign in the group — app-download, follower, and YouTube subscriber campaigns — with impressions, cost, cost per result, a conversion funnel, and device breakdown per project, styled for presenting to partners and guests.',
    tags: ['Google Ads', 'YouTube Ads', 'Looker Studio', 'Campaign KPIs'],
    highlights: ['One page per campaign / brand', 'Impressions → click → conversion funnel', 'Cost-per-result tracking'],
  },
  {
    id: 'thaimart',
    chart: 'orders',
    category: 'BI Dashboards',
    title: 'E-commerce Performance & Seller Dashboards',
    description:
      'Prepared, validated, and supported data for a marketplace performance dashboard — orders, GMV, actual sales, order status, registrations, visitors, growth — plus a seller-side view of SKUs, collections, and shop approvals.',
    tags: ['Data validation', 'Power BI', 'E-commerce KPIs'],
    highlights: ['Daily vs cumulative metrics', 'Order-status pipeline', 'Anomaly spotting'],
  },
  {
    id: 'pipeline',
    featured: true,
    chart: 'pipeline',
    category: 'Data Engineering',
    title: 'Databricks Tables, ETL & Data Quality',
    description:
      'Wrote and maintained the SQL behind analysis tables (customer profile, latest-round, top-purchase, silver ETL), scheduled job runs so data refreshes itself, and standardised messy fields — such as province names — before they reach any dashboard.',
    tags: ['SQL', 'Databricks', 'ETL', 'Data quality'],
    highlights: ['Reusable notebooks & jobs', 'Cleaning & standardisation rules', 'Fewer reporting errors'],
  },
  {
    id: 'rfm',
    featured: true,
    chart: 'rfm',
    category: 'Customer Analytics',
    title: 'Customer Analytics & RFM Segmentation',
    description:
      'Prepared customer profile datasets covering RFM, AOV, basket size, purchase frequency, customer segments, and repeat-purchase behaviour — feeding recurring dashboards and 27 ad-hoc requests from Marcom, Revenue, and CRM teams in four months.',
    tags: ['SQL', 'Databricks', 'RFM', 'Ad-hoc analysis'],
    highlights: ['Segment-level AOV & frequency', 'Repeat-purchase tracking', '27 ad-hoc analyses (Feb–May 2026)'],
  },
  {
    id: 'listening',
    chart: 'sentiment',
    category: 'Social Insight',
    title: 'Social Listening & Crisis Monitoring',
    description:
      'Three years of tracking brand conversation across channels — sentiment shifts, emerging issues, and trends — delivered as insight and crisis reports for marketing and communication teams and corporate clients.',
    tags: ['Social listening', 'Sentiment analysis', 'Reporting'],
    highlights: ['Weekly sentiment trend', 'Early issue detection', 'Client-ready insight reports'],
  },
]

// Case study ของแดชบอร์ดที่สร้างใหม่ด้วยข้อมูลจำลอง (section "Dashboard")
export const dashboardCase = {
  title: 'New customers by province — rebuilt, interactive, and safe to share.',
  teaser:
    'Four production reports — three Power BI pages and a Looker Studio GA4 report — rebuilt as live web dashboards with the same filters and visuals, and fully synthetic numbers so they are safe to explore.',
  intro:
    'A Power BI report I built for a recurring customer-acquisition review, recreated here as a live web dashboard. Same filters, same visuals, same logic — but every number is synthetic, because the real data belongs to the business.',
  points: [
    { h: 'Business question', t: 'Where are new customers coming from each purchase round, and who are they by age and gender — so marketing can target provinces and segments that are growing.' },
    { h: 'Data & prep', t: 'Customer, order, and purchase-round tables joined in SQL / Databricks; province and gender normalised; duplicates and missing values validated before reporting.' },
    { h: 'Outcome', t: 'One page replaced a weekly manual spreadsheet. Filters by region, province, and round let the team answer follow-up questions live in the meeting.' },
  ],
}

// แดชบอร์ดทั้งหมดในหน้า #/dashboard (แท็บ) — id ต้องตรงกับ DashboardPage.jsx
export const dashboards = [
  {
    id: 'province',
    tool: 'Power BI',
    tab: 'ลูกค้าใหม่รายจังหวัด',
    title: dashboardCase.title,
    intro: dashboardCase.intro,
    points: dashboardCase.points,
  },
  {
    id: 'lineoa-block',
    tool: 'Power BI',
    tab: 'Line OA Block',
    title: 'Line OA — who blocks us, and when.',
    intro:
      'A Power BI page tracking LINE Official Account health: new followers versus users who block the account, by purchase round and by month since launch. Rebuilt here with synthetic numbers.',
    points: [
      { h: 'Business question', t: 'Are broadcasts driving people to block the account? Which rounds spike, and is the block share trending up or down after each campaign change?' },
      { h: 'Data & prep', t: 'LINE OA follower and block events joined to the purchase-round calendar; monthly and per-round aggregates with round-over-round deltas computed in the model.' },
      { h: 'Outcome', t: 'Block share and its trend became a standing KPI in the Marcom review, used to tune broadcast frequency and content mix.' },
    ],
  },
  {
    id: 'lineoa-broadcast',
    tool: 'Power BI',
    tab: 'Line OA Broadcast',
    title: 'Line OA — broadcast reach, opens, clicks, and cost.',
    intro:
      'A Power BI page for LINE broadcast performance: messages sent per round and channel, open and click rates with deltas, video completion, cost, and when in the day messages land. Rebuilt here with synthetic numbers.',
    points: [
      { h: 'Business question', t: 'Which rounds and send times get the best open and click rates for the budget — and where does volume outrun engagement?' },
      { h: 'Data & prep', t: 'Broadcast logs by channel (NOK / KSL) aggregated to round, day, and hour; rate deltas versus the previous round; cost derived from message volume.' },
      { h: 'Outcome', t: 'Send volume was cut after the December review while open rate held — the daily and hourly views showed the same reach could be bought with far fewer messages.' },
    ],
  },
  {
    id: 'looker-ga4',
    tool: 'Looker Studio',
    tab: 'GA4 E-commerce',
    title: 'GA4 e-commerce in Looker Studio — users to revenue.',
    intro:
      'A four-page Looker Studio report on GA4 data for a marketplace app — overview KPIs with period-over-period change, product analysis, purchase funnel, and customer breakdown by country and device — condensed here into one page with synthetic numbers.',
    points: [
      { h: 'Business question', t: 'Is growth coming from more users or better conversion? Which products and devices drive revenue, and where does the funnel leak between add-to-cart and purchase?' },
      { h: 'Data & prep', t: 'GA4 events (session, view_item, add_to_cart, begin_checkout, purchase) connected natively; calculated fields for add-to-cart rate, purchaser rate, and revenue per customer; date-range comparison built into every scorecard.' },
      { h: 'Outcome', t: 'Marketing gets a self-serve view refreshed daily — campaign days show up as revenue spikes, and the funnel makes it clear that checkout completion, not traffic, is the lever to work on.' },
    ],
  },
]

export const nav = [
  { label: 'home', href: '#home' },
  { label: 'about', href: '#about' },
  { label: 'experience', href: '#experience' },
  { label: 'work', href: '#work' },
  { label: 'dashboard', href: '#/dashboard' },
  { label: 'contact', href: '#contact' },
]
