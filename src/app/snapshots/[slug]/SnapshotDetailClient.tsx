'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { notFound } from 'next/navigation';
import { FileCode, Copy, ExternalLink, GitFork, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function SnapshotDetailClient({ params }: { params: { slug: string } }) {
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [snapshot, setSnapshot] = useState<{ id: string; name: string; slug: string; language: string; code: string; createdAt: string; forkCount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    const saved = localStorage.getItem('cf_snapshots');
    if (saved) {
      const found = JSON.parse(saved).find((s: any) => s.slug === params.slug);
      setSnapshot(found || null);
    }
  }, [params.slug]);

  useEffect(() => { if (mounted) localStorage.setItem('cf_lang', lang); }, [lang, mounted]);

  const handleCopy = () => {
    if (!snapshot) return;
    navigator.clipboard.writeText(snapshot.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleFork = () => {
    if (!snapshot) return;
    const rooms = JSON.parse(localStorage.getItem('cf_rooms') || '[]');
    rooms.push({ id: `room-${Date.now()}`, name: snapshot.name, code: snapshot.slug, language: snapshot.language, visibility: 'private', updatedAt: new Date().toISOString(), userCount: 1 });
    localStorage.setItem('cf_rooms', JSON.stringify(rooms));
    const snaps = JSON.parse(localStorage.getItem('cf_snapshots') || '[]');
    const updated = snaps.map((s: any) => s.slug === snapshot.slug ? { ...s, forkCount: s.forkCount + 1 } : s);
    localStorage.setItem('cf_snapshots', JSON.stringify(updated));
    setSnapshot({ ...snapshot, forkCount: snapshot.forkCount + 1 });
  };

  if (!mounted) return null;
  if (!snapshot) notFound();
  const L = t;

  const shareUrl = typeof window !== 'undefined' ? `https://codeforgeme.zwart.qzz.io/snapshots/${snapshot.slug}` : '';

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/snapshots" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/snapshots" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={16} /> {lang === 'en' ? 'Back to Snapshots' : 'Kembali ke Snapshot'}
          </Link>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{snapshot.name}</h1>
            <p className="text-muted-foreground mt-1">{snapshot.language} — {new Date(snapshot.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors text-sm">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {lang === 'en' ? 'Copied!' : 'Tersalin!'}
            </button>
            <button onClick={handleFork} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors text-sm">
              <GitFork size={14} /> {lang === 'en' ? 'Fork to Room' : 'Fork ke Ruangan'}
            </button>
            {shareUrl && (
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); }} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors text-sm">
                <ExternalLink size={14} /> {lang === 'en' ? 'Copy Link' : 'Salin Link'}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
            <FileCode size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">{snapshot.language}</span>
            <span className="text-xs text-muted-foreground ml-auto">{snapshot.code.split('\n').length} lines</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground leading-relaxed">
            {snapshot.code}
          </pre>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{lang === 'en' ? 'Forks:' : 'Forks:'} {snapshot.forkCount}</span>
          <span className="text-sm text-muted-foreground">{lang === 'en' ? 'Public' : 'Publik'}</span>
        </div>
      </div>
    </div>
  );
}
