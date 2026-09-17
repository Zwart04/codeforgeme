'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import Link from 'next/link';
import { FileCode, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SnapshotsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [snapshots, setSnapshots] = useState<{ id: string; name: string; slug: string; language: string; code: string; createdAt: string; forkCount: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    const saved = localStorage.getItem('cf_snapshots');
    if (saved) setSnapshots(JSON.parse(saved));
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('cf_lang', lang); }, [lang, mounted]);

  const handlePublish = () => {
    const name = prompt(lang === 'en' ? 'Snapshot name:' : 'Nama snapshot:');
    if (!name) return;
    const slug = Math.random().toString(36).substring(2, 10);
    const snapshot = {
      id: `snap-${Date.now()}`, name, slug,
      language: 'javascript', code: '// Your code here\nconsole.log("Hello, World!");',
      createdAt: new Date().toISOString(), forkCount: 0
    };
    const existing = JSON.parse(localStorage.getItem('cf_snapshots') || '[]');
    existing.unshift(snapshot);
    localStorage.setItem('cf_snapshots', JSON.stringify(existing));
    setSnapshots(existing);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/snapshots" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{lang === 'en' ? 'Snapshots' : 'Snapshot'}</h1>
            <p className="text-muted-foreground mt-1">{lang === 'en' ? 'Publish and share your code snippets' : 'Publikasikan dan bagikan snippet kode Anda'}</p>
          </div>
          <button onClick={handlePublish} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
            {lang === 'en' ? 'Publish Snapshot' : 'Publikasi Snapshot'}
          </button>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-16">
            <FileCode size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{lang === 'en' ? 'No snapshots yet' : 'Belum ada snapshot'}</h2>
            <p className="text-muted-foreground mb-4">{lang === 'en' ? 'Publish your first code snippet for the world to see' : 'Publikasikan snippet kode pertama Anda untuk dilihat dunia'}</p>
            <button onClick={handlePublish} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
              {lang === 'en' ? 'Publish Now' : 'Publikasi Sekarang'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshots.map((snap) => (
              <Link key={snap.id} href={`/snapshots/${snap.slug}`} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
                <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">{snap.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{snap.language}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Copy size={12} /> {snap.forkCount} {lang === 'en' ? 'forks' : 'forks'}</span>
                  <span className="flex items-center gap-1"><ExternalLink size={12} /> {lang === 'en' ? 'public' : 'publik'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">/{snap.slug}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
