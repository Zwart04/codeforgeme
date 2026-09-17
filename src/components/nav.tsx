import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

interface NavProps {
  lang: 'en' | 'id';
  currentRoute: string;
}

export function Nav({ lang, currentRoute }: NavProps) {
  const routes = [
    { key: 'dashboard', href: '/dashboard' },
    { key: 'editor', href: '/editor' },
    { key: 'library', href: '/library' },
    { key: 'versions', href: '/versions' },
    { key: 'exports', href: '/exports' },
    { key: 'analytics', href: '/analytics' },
    { key: 'finance', href: '/finance' },
    { key: 'settings', href: '/settings' },
  ];

  const label = (key: string): string => {
    const k = key as keyof typeof t;
    const v = t[k];
    if (v && typeof v === 'object' && lang in v) return (v as any)[lang] as string;
    return key;
  };

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="hidden sm:inline">CodeForge</span>
        </Link>

        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                currentRoute === r.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {label(r.key)}
            </Link>
          ))}
        </div>

        <Link
          href="/about"
          className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {label('about')}
        </Link>
      </div>
    </nav>
  );
}

export function BackLink({ href, lang, label }: { href: string; lang: 'en' | 'id'; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft size={14} />
      {label || t.back[lang]}
    </Link>
  );
}
