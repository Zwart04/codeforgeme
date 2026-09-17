'use client';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { useToast } from '@/components/ui/toast';
import { Download, Copy, Share2, Image } from 'lucide-react';

export default function ExportsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/exports';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    // Load last code from editor
    const lastCode = localStorage.getItem('cf_last_code');
    if (lastCode) setCode(lastCode);
  }, []);

  const handleExport = (ext: string) => {
    if (!code) { addToast({ title: t.exportFailed[lang], variant: 'destructive' }); return; }
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeforgeme-export${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: t.exportComplete[lang], description: `${lang === 'en' ? 'Exported as' : 'Diekspor sebagai'} ${ext}` });
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    addToast({ title: t.copied[lang] });
  };

  const handleShare = () => {
    if (!code) return;
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const url = `${window.location.origin}/editor?code=${encoded.substring(0, 500)}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`Check this code on CodeForge Me:\n${url}`)}`;
    window.open(waUrl, '_blank');
    navigator.clipboard.writeText(url);
    addToast({ title: t.shareLinkCopied[lang] });
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/exports" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.exports[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {!code ? (
          <div className="text-center py-16">
            <Download size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">{lang === 'en' ? 'No code to export' : 'Tidak ada kode untuk diekspor'}</h2>
            <p className="text-muted-foreground text-sm">{lang === 'en' ? 'Go to the editor first!' : 'Buka editor dulu!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Options */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">{L.exportCode[lang]}</h2>
              <div className="grid grid-cols-2 gap-3">
                {['.js', '.ts', '.py', '.go', '.rs', '.c', '.java', '.rb'].map((ext) => (
                  <button
                    key={ext}
                    onClick={() => handleExport(ext)}
                    className="px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm font-mono flex items-center gap-2"
                  >
                    <Download size={14} /> {ext}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy & Share */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">{L.copyToClipboard[lang]}</h2>
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> {L.copy[lang]}
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">{L.shareLink[lang]}</h2>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> {L.shareViaWhatsApp[lang]}
                </button>
              </div>
            </div>

            {/* Code Preview */}
            <div className="rounded-xl border border-border bg-card p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">{lang === 'en' ? 'Preview' : 'Pratinjau'}</h2>
              <pre className="p-4 bg-muted/30 rounded-lg font-mono text-xs overflow-x-auto max-h-48 overflow-y-auto">
                {code}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}