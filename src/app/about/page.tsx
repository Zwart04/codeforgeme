'use client';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { Github, Code2, Zap, Shield, Layers } from 'lucide-react';

export default function AboutPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/about';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/about" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.aboutTitle[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {/* Hero */}
        <div className="rounded-xl border border-border bg-card p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Code2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">CodeForge Me</h2>
              <p className="text-muted-foreground">{L.version[lang]} 1.0.0</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed">{L.aboutDesc[lang]}</p>
        </div>

        {/* Tech Stack */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers size={18} /> {L.techStack[lang]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Next.js 16', 'TypeScript', 'Tailwind v4', 'Recharts', 'Lucide React', 'Vercel / CF Pages'].map((tech) => (
              <div key={tech} className="px-4 py-3 rounded-lg border border-border bg-muted/30 text-sm font-mono">
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap size={18} /> {lang === 'en' ? 'Features' : 'Fitur'}
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Real-time collaborative code editing' : 'Edit kode kolaboratif real-time'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'AI code suggestion (local mock)' : 'Saran kode AI (mock lokal)'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'GPU-accelerated terminal rendering' : 'Rendering terminal GPU-akselerasi'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Multi-language support (8 languages)' : 'Dukungan multi-bahasa (8 bahasa)'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Version history & auto-save' : 'Riwayat versi & simpan otomatis'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Export & share' : 'Ekspor & bagikan'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Analytics dashboard' : 'Dashboard analitik'}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {lang === 'en' ? 'Finance auto-journal' : 'Jurnal keuangan otomatis'}
            </li>
          </ul>
        </div>

        {/* License */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} /> {L.openSource[lang]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === 'en'
              ? 'This project is open source under the MIT License. Feel free to use, modify, and distribute.'
              : 'Proyek ini open source di bawah Lisensi MIT. Silakan gunakan, modifikasi, dan distribusikan.'}
          </p>
        </div>
      </div>
    </div>
  );
}