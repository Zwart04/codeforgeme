<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2-FF4785?style=for-the-badge)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)]()

# CodeForge Me

**Write, run, and share code together.** A collaborative code playground with real-time multi-user editing, AI code suggestion, GPU-accelerated terminal rendering, version history, and built-in analytics.

**[Live Demo](https://codeforgeme.zwart.qzz.io)** — [GitHub](https://github.com/Zwart04/codeforgeme)

English / [Indonesian](#tentang-codeforge-me)

</div>

---

## About CodeForge Me

CodeForge Me is a browser-native collaborative code playground. Multiple users can join the same room via a shared URL and edit code simultaneously. The editor supports 8 programming languages, runs code in a simulated sandbox, and provides AI-powered code suggestions — all running entirely in the browser with zero backend.

### Key Highlights

- **Real-time collaborative editing** — join rooms via URL, see cursors and edits from other users
- **AI code suggestion** — local heuristic mock provides inline suggestions with `Ctrl+Space`
- **GPU-accelerated terminal** — code output rendered via OffscreenCanvas for high performance
- **8 language support** — JavaScript, TypeScript, Python, Go, Rust, C, Java, Ruby
- **Version history** — auto-save snapshots every 30 seconds, restore previous versions
- **Export & share** — download code files, copy to clipboard, or share via WhatsApp
- **Analytics dashboard** — Recharts-powered charts for languages, sessions, and traffic sources
- **Finance auto-journal** — every run, export, and share action logged automatically

---

## Features

### 1. Real-Time Collaborative Editor
- Multi-user code editing with BroadcastChannel API (zero server)
- Cursor position sync with color-coded cursors per user
- Join rooms via URL parameter `?room=<slug>`
- User presence indicator showing online users

### 2. Multi-Language Code Editor
- Syntax highlighting for 8 languages
- Auto-detect language from file extension or manual selection
- Monospace font, line numbers, minimap support

### 3. AI Code Suggestion (Local Mock)
- Press `Ctrl+Space` or click "Suggest" button
- Heuristic mock provides context-aware code suggestions
- Accept or reject suggestions with one click

### 4. GPU-Accelerated Terminal Rendering
- Output rendered via OffscreenCanvas for high performance
- Typing effect, ANSI-style colors, scrollback buffer
- Dark/light terminal theme

### 5. Version History & Auto-Save
- Auto-save snapshot every 30 seconds
- Restore previous versions with diff view
- Custom labels for important versions

### 6. Code Execution Sandbox (Mock)
- "Run" button executes code — mock evaluation for JS, Python, Go, Rust
- 3-second timeout safety, error catching
- Output to terminal canvas with syntax coloring

### 7. Export & Share
- Export code as file (`.js`, `.ts`, `.py`, `.go`, `.rs`, `.c`, `.java`, `.rb`)
- Copy code to clipboard
- Share via WhatsApp deep-link with code in URL

### 8. Analytics Dashboard
- Recharts bar charts: most-used languages
- Line charts: session duration per user
- Traffic sources: UTM attribution via localStorage (no third-party tracking)
- Finance journal: auto-tracked for all code actions

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | App Router, Static Export |
| TypeScript | 5 | Type-safe development |
| Tailwind CSS | 4 | CSS-first styling |
| Recharts | 2 | Charts and data visualization |
| Lucide React | 0.511 | Icons (no emoji) |
| date-fns | 4 | Date formatting |
| BroadcastChannel | Native API | Real-time sync between tabs |
| OffscreenCanvas | Native API | GPU-accelerated terminal |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/Zwart04/codeforgeme.git
cd codeforgeme
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

Static output will be in the `out/` directory.

---

## Project Structure

```
codeforgeme/
├── public/
│   └── icon.svg              # Favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── globals.css       # Tailwind v4 + custom styles
│   │   ├── page.tsx          # Redirect to login/dashboard
│   │   ├── login/page.tsx    # Login page (localStorage auth)
│   │   ├── register/page.tsx # Registration page
│   │   ├── dashboard/page.tsx # Overview dashboard with stats
│   │   ├── editor/page.tsx   # Collaborative editor (main feature)
│   │   ├── library/page.tsx  # Snippet library
│   │   ├── versions/page.tsx # Version history
│   │   ├── exports/page.tsx  # Export & share
│   │   ├── analytics/page.tsx # Recharts dashboard
│   │   ├── finance/page.tsx  # Finance auto-journal
│   │   ├── settings/page.tsx # User settings
│   │   └── about/page.tsx    # About page
│   ├── components/
│   │   ├── nav.tsx           # Navigation bar with BackLink
│   │   ├── app-provider.tsx  # Auth + Toast + Theme provider
│   │   ├── theme-provider.tsx # Light/dark mode
│   │   ├── ui/toast.tsx      # Toast notification component
│   │   └── editor/           # Editor components (future)
│   └── lib/
│       ├── auth.tsx          # Auth context with localStorage
│       ├── i18n.ts           # EN/ID bilingual dictionary
│       ├── attribution.ts    # UTM/localStorage attribution
│       └── utils.ts          # Utility functions (cn)
├── next.config.mjs           # Next.js config: output: 'export'
├── postcss.config.mjs        # PostCSS config for Tailwind v4
├── tailwind.config.ts        # Tailwind v4 theme
├── tsconfig.json             # TypeScript config with path alias @/* -> ./src/*
├── wrangler.toml             # Cloudflare Pages config
├── package.json
├── LICENSE                   # MIT License
└── .gitignore
```

---

## Architecture

### Client-Side Only
CodeForge Me is a **fully client-side application** with no backend server. All state is managed via React Context and persisted in `localStorage`.

### Data Flow
1. User authenticates (localStorage-based)
2. Editor code state held in React state
3. Auto-save snapshots to localStorage every 30s
4. Collaborative sync via BroadcastChannel API
5. Analytics and finance journal updated in real-time

### Notification System
- In-app toast (custom component, no external library)
- WhatsApp share via `wa.me` deep-link
- No email/WAHA/SMS — all mock/share-based

### Attribution System
- UTM parameters read on first visit
- Persisted to `localStorage.source`
- Visualized in analytics with Recharts
- No Meta Pixel, no Google Ads, no third-party scripts

---

## Demo Account

| Field | Value |
|---|---|
| Email | `demo@codeforgeme.local` |
| Password | `demo123` |

Or register a new account.

---

## Roadmap

- [ ] WebSocket-based real multi-user sync
- [ ] More language support (PHP, Kotlin, Swift)
- [ ] Syntax highlighting with Prism/Shiki
- [ ] Cloud sync with Supabase
- [ ] Mobile-optimized editor
- [ ] PWA offline support

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with Next.js 16, TypeScript, Tailwind v4, and Recharts.

</div>