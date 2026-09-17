'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { User, Trash2, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/settings';
  const { user, logout } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  const handleClearData = () => {
    if (lang === 'en') {
      if (!confirm('Are you sure? This will delete all your snippets, versions, and journal entries.')) return;
    } else {
      if (!confirm('Pastikan? Ini akan menghapus semua snippet, versi, dan entri jurnal Anda.')) return;
    }
    localStorage.removeItem('cf_library');
    localStorage.removeItem('cf_versions');
    localStorage.removeItem('cf_finance');
    localStorage.removeItem('cf_attribution_log');
    alert(lang === 'en' ? 'All data cleared' : 'Semua data dihapus');
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/settings" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.settings[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={18} /> {L.profile[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{L.fullName[lang]}</label>
              <input
                type="text"
                value={user?.name || 'Guest'}
                readOnly
                className="w-full px-3 py-2 rounded-md border border-border bg-muted text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{L.email[lang]}</label>
              <input
                type="email"
                value={user?.email || 'guest@codeforgeme.local'}
                readOnly
                className="w-full px-3 py-2 rounded-md border border-border bg-muted text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Monitor size={18} /> {L.account[lang]}
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
            >
              {L.logout[lang]}
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} /> {L.clearData[lang]}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">{L.about[lang]}</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{L.version[lang]}: 1.0.0</p>
            <p>{lang === 'en' ? 'Built with Next.js 16, TypeScript, Tailwind v4' : 'Dibuat dengan Next.js 16, TypeScript, Tailwind v4'}</p>
            <p>License: MIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}