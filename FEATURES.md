# CodeForge Me — Features

Collaborative real-time code playground: multi-language editing with WebSocket sync, AI code suggestion, GPU-accelerated rendering, version history, export, analytics, and auto-finance journal.

## Fitur Utama (8)

### 1. Real-Time Collaborative Editor (WebSocket)
- Multi-user collaborative code editing dengan sync 실시간으로 via WebSocket
- Cursor position tracking per user (colored cursors)
- Selection sync — lihat rekan sedang blok apa
- Room-based collaboration: buat room / join via room code 6-char
- Presence indicator: user online/offline status real-time
- Operasi: insert, delete, replace — CRDT-ral Py guess (gunakan broadcast + operational transform sederhana)

### 2. Multi-Language Code Editor dengan Syntax Highlight
- Support bahasa: JavaScript, TypeScript, Python, Go, Rust, C, Java, SQL, HTML, CSS, JSON, Markdown
- Syntax highlighting via highlight.js (CDN, client-side) — zero bundle
- Line numbers, active line highlight, indent guides
- Theme toggle: light / dark /Solarized /Monokai
- Font size adjust (12-24px) + font family (monospace options)

### 3. AI Code Suggestion (Mock LLM Heuristic)
- Klik bagian kode → klik "Suggest" → AI beri saran perbaikan
- Heuristic-based: deteksi pola (forEach → map, var → let/const, == → ===, etc.)
- Show diff preview sebelum apply
- Rejected suggestions masuk ke history untuk improvement
- "Apply" → kode berubah dengan animasi highlight

### 4. GPU-Accelerated Terminal Rendering (Web Worker)
- Terminal output rendering via OffscreenCanvas di Web Worker
- ASCII/UTF-8 art rendering, ANSI color support
- Simulasi execution: run kode (mock) → lihat output di terminal panel
- Terminal history scrollback 10000 baris
- Copy output, clear terminal, toggle terminal visibility

### 5. Version History & Auto-Save
- Auto-save setiap 10 detik ke localStorage (draft)
- Manual save → commit ke version history
- Version timeline: lihat semua save, klik restore
- Diff view antara versi: line-by-line perubahan
- Named snapshots: beri nama "before refactor", "fix bug #12"
- Export version sebagai JSON

### 6. Export & Share
- Export kode sebagai: TXT, HTML (dengan syntax highlight embedded), PNG (screenshot editor via html2canvas), PDF (via jspdf)
- Export terminal output sebagai TXT
- Share link: buat link unik (room code embedded) → copy ke clipboard
- Share via wa.me deep-link: `window.open('https://wa.me/?text=...')`
- Public gist-style: publish kode sebagai snapshot publik dengan slug

### 7. Analytics Dashboard (Recharts)
- Stats per user: kode ditulis, bahasa paling dipakai, waktu editing
- Language heatmap: berapa kali tiap bahasa dipakai tiap hari (7 hari)
- Session duration chart (Recharts BarChart)
- Most active rooms chart
- Source attribution chart: UTM params → localStorage.source → Recharts bar (channel mana yang referral)
- Export analytics sebagai CSV

### 8. Auto-Finance Journal (Integrated)
- Setiap kali user publish / export / create room dianggap transaksi
- Auto journal masuk: source tagging (auto-task/auto-bill/auto-vendor)
- Currency IDR, amount mock (slot-based: publish = +5000, export = +2000)
- Dashboard keuangan mini: total income, expense, balance
- Finance chart Recharts LineChart
- Export finance sebagai Excel (.xlsx via exceljs) dan CSV

## Route Map (13 routes)

1. `/` — Landing page (hero, features, CTA signup/login)
2. `/login` — Login page (email/password, localStorage auth)
3. `/register` — Register page
4. `/dashboard` — Dashboard utama: list room, recent activity, stats ringkasan
5. `/rooms` — List semua room yang dipunyai user
6. `/rooms/[id]` — Room detail: collaborative editor + terminal + AI suggest
7. `/rooms/create` — Buat room baru (nama, bahasa default, visibility)
8. `/editor` — Editor standalone (tanpa room, untuk quick edit)
9. `/playground` — Playground: tulis kode + run mock + lihat output
10. `/snapshots` — List snapshot/publik kode (gist-style)
11. `/snapshots/[slug]` — Snapshot publik: lihat kode, fork ke room
12. `/analytics` — Analytics dashboard: chart, heatmap, source attribution
13. `/finance` — Finance journal: list transaksi, chart, export Excel/CSV
14. `/settings` — Settings: bahasa, tema editor, notifikasi, akun

## Batasan Kebijakan (2026-08-29 Boss)

- ❌ NO `/waha/` tab, NO `lib/waha.ts`, NO WAHA QR
- ❌ NO Meta Pixel (`fbq`), NO Google Ads/GA (`gtag`), NO `NEXT_PUBLIC_META_PIXEL_ID`, NO `NEXT_PUBLIC_GOOGLE_ADS_ID`
- ✅ Notification: in-app toast (shadcn Toast) + wa.me share-link (window.open)
- ✅ Attribution: UTM/URL-param → localStorage.source → Recharts bar di /analytics
- ✅ Finance: auto-journal terintegrasi dengan source tagging
- ✅ Bilingual EN/ID toggle (full dict t.*)
- ✅ No emoji di UI maupun README

## Notification Spec

- In-app toast: shadcn Toast untuk notifikasi "Room created", "Saved", " exons", "User joined", dll
- Share-link wa.me: `https://wa.me/?text=Check%20out%20my%20code%20at%20<url>` — buka via window.open
- Email mock: tampilkan modal "Email sent (mock)" — tidak ada integrasi email sungguhan

## Tech Stack

- Next.js 16 App Router (next@latest)
- TypeScript (strict mode)
- Tailwind CSS v4 + @tailwindcss/postcss
- shadcn/ui (Toast, Dialog, Button, Input, Select, Tabs, Card, Badge, Avatar, Progress)
- Recharts (dashboard charts, analytics, finance)
- highlight.js (syntax highlighting, CDN)
- html2canvas (screenshot export PNG)
- jspdf (export PDF)
- exceljs (export Excel finance)
- lucide-react (icons)
- Web Workers (OffscreenCanvas terminal rendering)
- BroadcastChannel API (tab-to-tab sync)
- localStorage (auth, rooms, snapshots, settings)
- no external DB — semua data lokal

## Design Aturan

- No emoji di mana pun (lucide-react icons)
- Light/dark mode (next-themes)
- Bilingual EN/ID toggle (button ID/EN di header)
- Font: Inter (sans) + JetBrains Mono (code)
- Color: OKLCH-based, modern minimal SaaS
- Tailwind v4 CSS-first config (globals.css)
