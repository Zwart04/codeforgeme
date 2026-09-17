'use client';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { RotateCcw, Clock, Tag } from 'lucide-react';

interface Version {
  id: number;
  label: string;
  code: string;
  ts: number;
  language: string;
}

const MOCK_VERSIONS: Version[] = [
  { id: 1, label: 'Initial commit', code: '// Initial code\nconsole.log("Hello World");', ts: Date.now() - 3600000, language: 'JavaScript' },
  { id: 2, label: 'Added greeting function', code: '// Added greet function\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("World"));', ts: Date.now() - 2400000, language: 'JavaScript' },
  { id: 3, label: 'Refactored to arrow', code: '// Arrow function\nconst greet = (name) => `Hello, ${name}!`;\nconsole.log(greet("World"));', ts: Date.now() - 1200000, language: 'JavaScript' },
];

export default function VersionsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/versions';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    // Load from localStorage or use mock
    try {
      const raw = localStorage.getItem('cf_versions');
      if (raw) setVersions(JSON.parse(raw));
      else setVersions(MOCK_VERSIONS);
    } catch { setVersions(MOCK_VERSIONS); }
  }, []);

  const handleRestore = (v: Version) => {
    // In a real app, this would update the editor state
    // For demo, we show a toast
    alert(lang === 'en' ? `Restored: "${v.label}"` : `Dipulihkan: "${v.label}"`);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/versions" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.versionHistory[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {versions.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">{L.noVersions[lang]}</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((v, idx) => (
              <div key={v.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono text-sm">
                      v{versions.length - idx}
                    </div>
                    <div>
                      <h3 className="font-semibold">{v.label}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(v.ts).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono">{v.language}</span>
                    <button
                      onClick={() => handleRestore(v)}
                      className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={14} /> {L.restore[lang]}
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-muted/30 rounded-lg font-mono text-xs overflow-x-auto max-h-32 overflow-y-auto">
                  {v.code}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}