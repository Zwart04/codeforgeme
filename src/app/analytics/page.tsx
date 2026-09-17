'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { getAllSources } from '@/lib/attribution';
import { TrendingUp } from 'lucide-react';

const MOCK_SESSION_DATA = [
  { name: '09:00', duration: 5 },
  { name: '10:00', duration: 12 },
  { name: '11:00', duration: 8 },
  { name: '12:00', duration: 3 },
  { name: '13:00', duration: 15 },
  { name: '14:00', duration: 20 },
  { name: '15:00', duration: 10 },
];

const MOCK_LANGUAGE_DATA = [
  { name: 'JavaScript', count: 25 },
  { name: 'TypeScript', count: 18 },
  { name: 'Python', count: 12 },
  { name: 'Go', count: 8 },
  { name: 'Rust', count: 5 },
];

export default function AnalyticsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/analytics';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [sourceData, setSourceData] = useState<Array<{ name: string; visits: number }>>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    // Log attribution on mount
    const sources = getAllSources();
    const data = Object.entries(sources).map(([name, count]) => ({ name, visits: count }));
    if (data.length === 0) {
      setSourceData([{ name: 'direct', visits: 1 }]);
    } else {
      setSourceData(data);
    }
  }, []);

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/analytics" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.analytics[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label={L.sessions[lang]} value="12" lang={lang} />
          <StatCard label={L.codeExecuted[lang]} value="48" lang={lang} />
          <StatCard label={L.versions[lang]} value="7" lang={lang} />
          <StatCard label={L.snippets[lang]} value="3" lang={lang} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> {L.topLanguages[lang]}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MOCK_LANGUAGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">{L.trafficSources[lang]}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="visits" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Session Duration */}
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">{L.sessionDuration[lang]}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MOCK_SESSION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" min" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="duration" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, lang }: { label: string; value: string; lang: 'en' | 'id' }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}