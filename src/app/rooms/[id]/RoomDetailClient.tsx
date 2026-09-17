'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { Hash, Users, Play, Terminal } from 'lucide-react';

export default function RoomDetailClient({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [room, setRoom] = useState<{ id: string; name: string; code: string; language: string; visibility: string; updatedAt: string; userCount: number } | null>(null);
  const [code, setCode] = useState('// Welcome to CodeForge Me\nconsole.log("Hello, World!");\n');
  const [output, setOutput] = useState<string[]>([]);
  const [terminalOpen, setTerminalOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    const saved = localStorage.getItem('cf_rooms');
    if (saved) {
      const found = JSON.parse(saved).find((r: any) => r.id === params.id);
      if (found) { setRoom(found); setCode(found.code || '// Welcome to CodeForge Me\nconsole.log("Hello, World!");\n'); }
    }
  }, [params.id]);

  useEffect(() => { if (mounted) localStorage.setItem('cf_lang', lang); }, [lang, mounted]);

  const handleRun = () => {
    try {
      const result = eval(code);
      setOutput([...(typeof result !== 'undefined' ? [String(result)] : []), `> Execution completed at ${new Date().toLocaleTimeString()}`]);
    } catch (e: any) {
      setOutput([`Error: ${e.message}`, `> at ${new Date().toLocaleTimeString()}`]);
    }
  };

  const handleSave = () => {
    if (!room) return;
    const updated = { ...room, code, updatedAt: new Date().toISOString() };
    const rooms = JSON.parse(localStorage.getItem('cf_rooms') || '[]');
    const idx = rooms.findIndex((r: any) => r.id === room.id);
    if (idx >= 0) rooms[idx] = updated;
    localStorage.setItem('cf_rooms', JSON.stringify(rooms));
    setRoom(updated);
  };

  if (!mounted) return null;
  const L = t;

  const shareUrl = typeof window !== 'undefined' ? `https://codeforgeme.zwart.qzz.io/rooms/${room?.id}` : '';

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/rooms" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{room?.name || 'Room'}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Hash size={14} /> Code: {room?.code || '----'} {lang === 'en' ? '| 1 user online' : '| 1 pengguna online'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTerminalOpen(!terminalOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors text-sm ${terminalOpen ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted/50'}`}>
              <Terminal size={14} /> {lang === 'en' ? 'Terminal' : 'Terminal'}
            </button>
            <button onClick={handleRun} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
              <Play size={14} /> {L.run[lang]}
            </button>
            <button onClick={handleSave} className="px-4 py-2 border border-border rounded-md font-medium hover:bg-muted/50 transition-colors">
              {L.saved[lang]}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-sm font-medium">{room?.language || 'javascript'}</span>
              <span className="text-xs text-muted-foreground ml-auto">Ln 1, Col 1</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {terminalOpen && (
            <div className="rounded-xl border border-border bg-card overflow-hidden h-96 flex flex-col">
              <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2"><Terminal size={14} /> {L.terminal[lang]}</span>
                <button onClick={() => setOutput([])} className="text-xs text-muted-foreground hover:text-foreground">{L.clear[lang]}</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
                {output.length === 0 ? (
                  <p className="text-muted-foreground">{L.noOutput[lang]}</p>
                ) : (
                  output.map((line, i) => <div key={i} className="text-foreground">{line}</div>)
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{lang === 'en' ? 'Share:' : 'Bagikan:'}</span>
          {shareUrl && (
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); }} className="text-sm px-3 py-1 border border-border rounded-md hover:bg-muted/50 transition-colors">
              {lang === 'en' ? 'Copy Link' : 'Salin Link'}
            </button>
          )}
          <button onClick={() => { if (shareUrl) window.open(`https://wa.me/?text=${encodeURIComponent(lang === 'en' ? 'Check out my code: ' + shareUrl : 'Lihat kode saya: ' + shareUrl)}`, '_blank'); }} className="text-sm px-3 py-1 border border-border rounded-md hover:bg-muted/50 transition-colors">
            {L.shareViaWhatsApp[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}
