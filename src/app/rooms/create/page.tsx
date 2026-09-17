'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import { Plus, Code, Hash } from 'lucide-react';

export default function CreateRoomPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [done, setDone] = useState(false);
  const [newRoomCode, setNewRoomCode] = useState('');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('cf_lang', lang); }, [lang, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = { id: `room-${Date.now()}`, name, code, language, visibility: 'private', updatedAt: new Date().toISOString(), userCount: 1 };
    const rooms = JSON.parse(localStorage.getItem('cf_rooms') || '[]');
    rooms.push(room);
    localStorage.setItem('cf_rooms', JSON.stringify(rooms));
    setNewRoomCode(code);
    setDone(true);
  };

  if (!mounted) return null;
  const L = t;

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Nav lang={lang} currentRoute="/rooms" />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Hash size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{lang === 'en' ? 'Room Created' : 'Ruangan Dibuat'}</h1>
          <p className="text-muted-foreground mb-2">{name}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-mono mb-6">
            <Code size={14} /> {newRoomCode}
          </div>
          <div className="flex gap-3 justify-center">
            <a href={`/rooms/${name ? 'room-' + Date.now() : 'new'}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
              {lang === 'en' ? 'Open Room' : 'Buka Ruangan'}
            </a>
            <button onClick={() => setDone(false)} className="px-4 py-2 border border-border rounded-md font-medium hover:bg-muted/50 transition-colors">
              {lang === 'en' ? 'Create Another' : 'Buat Lainnya'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/rooms" />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{L.newRoom[lang]}</h1>
        <p className="text-muted-foreground mb-6">{lang === 'en' ? 'Create a new collaborative coding room' : 'Buat ruangan coding kolaboratif baru'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{L.roomCode[lang]}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'en' ? 'My Collaborative Room' : 'Ruangan Kolaborasi Saya'} className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{L.snippetLanguage[lang]}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Plus size={16} /> {L.create[lang]}
          </button>
        </form>
      </div>
    </div>
  );
}
