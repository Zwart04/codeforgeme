'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardPage() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('cf_lang', lang);
  }, [lang, mounted]);

  if (!mounted) return null;

  const L = t;
  const stats = {
    sessions: 12,
    codeRun: 48,
    versions: 7,
    snippets: 3,
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/dashboard" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{L.dashboard[lang]}</h1>
            <p className="text-muted-foreground mt-1">
              {lang === 'en' ? 'Welcome back! Here is your overview.' : 'Selamat datang kembali! Ini ringkasan Anda.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name || 'Guest'}</span>
            <Link
              href="/settings"
              className="px-3 py-1.5 rounded-md bg-muted text-sm hover:bg-muted/80 transition-colors"
            >
              {L.settings[lang]}
            </Link>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
              lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('id')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
              lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            ID
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<CodeIcon />}
            label={L.codeExecuted[lang]}
            value={stats.codeRun}
            lang={lang}
          />
          <StatCard
            icon={<HistoryIcon />}
            label={L.versions[lang]}
            value={stats.versions}
            lang={lang}
          />
          <StatCard
            icon={<FileIcon />}
            label={L.snippetsCreated[lang]}
            value={stats.snippets}
            lang={lang}
          />
          <StatCard
            icon={<ClockIcon />}
            label={L.sessions[lang]}
            value={stats.sessions}
            lang={lang}
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">{L.editor[lang]}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => (window.location.href = '/editor')}
            className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Edit3 size={20} />
            </div>
            <div>
              <p className="font-semibold">{L.editor[lang]}</p>
              <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Write and run code' : 'Tulis dan jalankan kode'}</p>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = '/editor?new=true')}
            className="flex items-center gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <p className="font-semibold">{lang === 'en' ? 'New Room' : 'Ruangan Baru'}</p>
              <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Start a collaborative session' : 'Mulai sesi kolaborasi'}</p>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold mb-4">{lang === 'en' ? 'Quick Access' : 'Akses Cepat'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <Link href="/library" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.library[lang]}</p>
          </Link>
          <Link href="/versions" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.versions[lang]}</p>
          </Link>
          <Link href="/exports" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.exports[lang]}</p>
          </Link>
          <Link href="/analytics" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.analytics[lang]}</p>
          </Link>
          <Link href="/finance" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.finance[lang]}</p>
          </Link>
          <Link href="/settings" className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-center">
            <p className="text-sm font-medium">{L.settings[lang]}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, lang }: { icon: React.ReactNode; label: string; value: number; lang: 'en' | 'id' }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function Edit3({ size = 20 }: { size?: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function Plus({ size = 20 }: { size?: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
