'use client';
import { useState, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface JournalEntry {
  id: number;
  description: string;
  amount: number;
  status: string;
  source: string;
  ts: number;
}

const MOCK_JOURNAL: JournalEntry[] = [
  { id: 1, description: 'Code Execution', amount: 0, status: 'completed', source: 'auto-task', ts: Date.now() - 3600000 },
  { id: 2, description: 'Code Export', amount: 0, status: 'completed', source: 'auto-task', ts: Date.now() - 2400000 },
  { id: 3, description: 'Snippet Saved', amount: 0, status: 'completed', source: 'auto-task', ts: Date.now() - 1200000 },
  { id: 4, description: 'Version Saved', amount: 0, status: 'completed', source: 'auto-task', ts: Date.now() - 600000 },
  { id: 5, description: 'Share Link Created', amount: 0, status: 'pending', source: 'auto-bill', ts: Date.now() - 300000 },
];

export default function FinancePage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/finance';
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    // Load from localStorage or use mock
    try {
      const raw = localStorage.getItem('cf_finance');
      if (raw) setJournal(JSON.parse(raw));
      else setJournal(MOCK_JOURNAL);
    } catch { setJournal(MOCK_JOURNAL); }
  }, []);

  if (!mounted) return null;
  const L = t;

  const totalBalance = journal.reduce((sum, j) => sum + j.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/finance" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{L.financeJournal[lang]}</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>EN</button>
            <button onClick={() => setLang('id')} className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>ID</button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-1">{L.totalBalance[lang]}</p>
          <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">{L.autoTracked[lang]}</p>
        </div>

        {/* Journal Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold">{L.financeJournal[lang]}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">{L.date[lang]}</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">{L.description[lang]}</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">{L.sourceTag[lang]}</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">{L.status[lang]}</th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">{L.amount[lang]}</th>
                </tr>
              </thead>
              <tbody>
                {journal.map((j) => (
                  <tr key={j.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">{new Date(j.ts).toLocaleString()}</td>
                    <td className="px-6 py-3 font-medium">{j.description}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono">{j.source}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs ${j.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                        {j.status === 'completed' ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                        {j.status === 'completed' ? L.completed[lang] : L.pending[lang]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      {j.amount === 0 ? <span className="text-muted-foreground">{L.free[lang]}</span> : `$${j.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}