'use client';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { Trash2, Code2, FolderOpen, Eye, Copy } from 'lucide-react';

interface LibrarySnippet {
  id: number;
  name: string;
  description: string;
  language: string;
  code: string;
  ts: number;
}

export default function LibraryPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/library';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [library, setLibrary] = useState<LibrarySnippet[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    loadLibrary();
  }, []);

  const loadLibrary = () => {
    try {
      const raw = localStorage.getItem('cf_library') || '[]';
      setLibrary(JSON.parse(raw));
    } catch { setLibrary([]); }
  };

  const handleDelete = (id: number) => {
    const updated = library.filter(s => s.id !== id);
    setLibrary(updated);
    localStorage.setItem('cf_library', JSON.stringify(updated));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/library" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.library[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {library.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">{L.noSnippets[lang]}</h2>
            <p className="text-muted-foreground text-sm">{lang === 'en' ? 'Go to the editor and save a snippet!' : 'Buka editor dan simpan snippet!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {library.map((snippet) => (
              <div key={snippet.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(expanded === snippet.id ? null : snippet.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Code2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{snippet.name}</h3>
                      <p className="text-sm text-muted-foreground">{snippet.description || snippet.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono">{snippet.language}</span>
                    <span className="text-xs text-muted-foreground">{new Date(snippet.ts).toLocaleDateString()}</span>
                  </div>
                </div>
                {expanded === snippet.id && (
                  <div className="px-6 pb-4 border-t border-border">
                    <pre className="p-4 bg-muted/30 rounded-lg font-mono text-xs overflow-x-auto mt-3">
                      {snippet.code}
                    </pre>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleCopyCode(snippet.code)}
                        className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-1"
                      >
                        <Copy size={14} /> {L.copy[lang]}
                      </button>
                      <button
                        onClick={() => handleDelete(snippet.id)}
                        className="px-3 py-1 rounded-md bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> {L.delete[lang]}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}