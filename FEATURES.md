# CodeForge Me — Fitur

Collaborative Code Playground: real-time multi-user code editor dengan AI suggestion, GPU terminal rendering, version history, dan analytics.

## 1. Real-time Collaborative Editor
Editor kode multi-user dengan room-based collaboration. BroadcastChannel API untuk sync perubahan teks antar tab. Kode syntax highlighting via Prism.js CDN. Indikator pengguna online real-time.

## 2. AI Code Suggestion (Mock LLM)
Heuristic-based code suggestion engine: analyze current code context, detect missing patterns (looping, error handling, imports), and propose improvements. Toggle fitur, terima/tolak saran.

## 3. GPU-Accelerated Terminal Rendering
Web Worker + OffscreenCanvas untuk render terminal output dengan GPU-accelerated text rendering. Simulasi eksekusi kode (JavaScript, Python-like pseudocode, bash) dengan highlight output.

## 4. Version History + Auto-save
Setiap perubahan kode di-auto-save sebagai versi. Riwayat versi dengan timestamp, label opsional, restore satu klik. Slot versi tidak terbatas (localStorage).

## 5. Snippet Library
Simpan kode sebagai snippet bernama dengan deskripsi dan bahasa. Library grid dengan search/filter/urut. Hapus, buka kembali ke editor. Export individual snippet.

## 6. Export & Share (PDF/SVG/Copy/WhatsApp)
Export kode sebagai teks, tangkapan layar SVG (render code ke SVG via canvas), salin ke clipboard, atau bagikan via wa.me deep-link (tanpa API). Share link berisi encoded snippet + room code.

## 7. Analytics Dashboard (Recharts)
Statistik pengguna: jumlah sesi, kode dijalankan, versi tersimpan, snippet dibuat, bahasa terpopuler. Sumber traffic dari UTM/localStorage attribution → Recharts bar chart di tab Analytics.

## 8. Auto Finance Journal
Setiap aksi pengguna (eksekusi kode, ekspor, penyimpanan snippet, pembuatan share link, versi tersimpan) otomatis tercatat di jurnal keuangan dengan source tag (auto-task/auto-vendor). Saldo total, filter status, tabel entri.

## Spesifikasi Tambahan
- Bilingual EN/ID lengkap (178 key dictionary)
- localStorage auth (hf_user/hf_users) dengan register/login/logout
- In-app toast notifikasi (shadcn Toast) — tidak ada WAHA
- Attribution: UTM/URL-param → localStorage.source → Recharts di /analytics — tidak ada Pixel/GA
- 16 route: /, /login, /register, /dashboard, /editor, /library, /versions, /exports, /analytics, /finance, /settings, /about
- Tailwind v4 + shadcn/ui + Recharts + lucide-react
- No emoji, no Pixel, no GA, no /waha/
