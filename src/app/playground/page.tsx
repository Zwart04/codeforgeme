'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { Play, Terminal, Download, Copy } from 'lucide-react';

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState('// Try it out!\nconsole.log("Hello from CodeForge Me!");\nconst result = 2 + 2;\nconsole.log("2 + 2 =", result);');
  const [output, setOutput] = useState<string[]>([]);
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('cf_lang', lang); }, [lang, mounted]);

  const handleRun = () => {
    setOutput([]);
    const lines = code.split('\n');
    const results: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed === '') continue;
      try {
        const result = eval(line);
        if (typeof result !== 'undefined') results.push(`> ${result}`);
      } catch (e: any) {
        results.push(`Error: ${e.message}`);
      }
    }
    setOutput(results.length ? results : [`> Execution completed at ${new Date().toLocaleTimeString()}`]);
  };

  const handleClear = () => setOutput([]);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/playground" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{lang === 'en' ? 'Playground' : 'Playground'}</h1>
            <p className="text-muted-foreground mt-1">{lang === 'en' ? 'Write and run code instantly' : 'Tulis dan jalankan kode secara instan'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRun} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
              <Play size={14} /> {L.run[lang]}
            </button>
            <button onClick={handleClear} className="px-3 py-2 border border-border rounded-md font-medium hover:bg-muted/50 transition-colors text-sm">
              {L.clear[lang]}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python (mock)</option>
                <option value="html">HTML</option>
              </select>
              <span className="text-xs text-muted-foreground ml-auto">Ln {code.split('\n').length}, Col 1</span>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-80 p-4 font-mono text-sm bg-transparent resize-none focus:outline-none" spellCheck={false} />
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden h-80 flex flex-col">
            <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2"><Terminal size={14} /> {L.terminal[lang]}</span>
              <button onClick={handleDownload} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Download size={12} /> {L.download[lang]}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
              {output.length === 0 ? (
                <p className="text-muted-foreground">{L.noOutput[lang]}</p>
              ) : (
                output.map((line, i) => <div key={i} className="text-foreground">{line}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
