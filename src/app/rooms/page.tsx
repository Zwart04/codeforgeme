'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Nav } from '@/components/nav';
import Link from 'next/link';
import { Plus, Hash, Users } from 'lucide-react';

export default function RoomsPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [rooms, setRooms] = useState<{ id: string; name: string; code: string; language: string; visibility: string; updatedAt: string; userCount: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    const saved = localStorage.getItem('cf_rooms');
    if (saved) setRooms(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('cf_lang', lang);
  }, [lang, mounted]);

  const handleCreate = () => {
    const name = prompt(lang === 'en' ? 'Room name:' : 'Nama ruangan:');
    if (!name) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = { id: `room-${Date.now()}`, name, code, language: 'javascript', visibility: 'private', updatedAt: new Date().toISOString(), userCount: 1 };
    const existing = JSON.parse(localStorage.getItem('cf_rooms') || '[]');
    existing.push(room);
    localStorage.setItem('cf_rooms', JSON.stringify(existing));
    setRooms(existing);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/rooms" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{L.editor[lang]}</h1>
            <p className="text-muted-foreground mt-1">{lang === 'en' ? 'Your collaborative coding rooms' : 'Ruangan coding kolaboratif Anda'}</p>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
            <Plus size={18} /> {lang === 'en' ? 'New Room' : 'Ruangan Baru'}
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <Hash size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{lang === 'en' ? 'No rooms yet' : 'Belum ada ruangan'}</h2>
            <p className="text-muted-foreground mb-4">{lang === 'en' ? 'Create your first room to start collaborating' : 'Buat ruangan pertama Anda untuk mulai berkolaborasi'}</p>
            <button onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
              {lang === 'en' ? 'Create Room' : 'Buat Ruangan'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Link key={room.id} href={`/rooms/${room.id}`} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{room.name}</h3>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{room.code}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Hash size={14} /> {room.language}</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {room.userCount} {lang === 'en' ? 'online' : 'online'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{new Date(room.updatedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
