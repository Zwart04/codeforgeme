'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, inProgress } = useAuth();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name) { setError(L.nameRequired[lang]); return; }
    if (!email) { setError(L.emailRequired[lang]); return; }
    if (!password) { setError(L.passwordRequired[lang]); return; }
    if (password.length < 6) { setError(L.passwordMin[lang]); return; }
    if (password !== confirm) { setError(L.passwordsDoNotMatch[lang]); return; }
    const result = register(name, email, password);
    if (result && typeof result === 'object' && 'ok' in result && !result.ok) {
      setTimeout(() => setError(L.invalidCredentials[lang]), 400);
    } else {
      setDone(true);
    }
  };

  if (!mounted) return null;
  const L = t;

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{lang === 'en' ? 'Account Created' : 'Akun Dibuat'}</h1>
          <p className="text-muted-foreground mb-6">{email}</p>
          <button
            onClick={() => { window.location.href = '/dashboard'; }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            {L.dashboard[lang]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl mb-8 hover:opacity-80 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          CodeForge
        </Link>

        <h1 className="text-2xl font-bold text-center mb-1">{L.register[lang]}</h1>
        <p className="text-muted-foreground text-center text-sm mb-6">{L.createYourAccount[lang]}</p>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('id')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
          >
            ID
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{L.fullName[lang]}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{L.email[lang]}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{L.password[lang]}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{L.confirmPassword[lang]}</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Confirm your password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={inProgress}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {inProgress ? L.loading[lang] : L.createAccount[lang]}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {L.haveAccount[lang]}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {L.signIn[lang]}
          </Link>
        </p>
      </div>
    </div>
  );
}