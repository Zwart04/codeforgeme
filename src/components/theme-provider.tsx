'use client';
import { useState, useEffect } from 'react';
import { Monitor, Moon } from 'lucide-react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('cf_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {children}
      {mounted && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-md border transition-colors ${
              theme === 'light' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
            title="Light mode"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-md border transition-colors ${
              theme === 'dark' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
            title="Dark mode"
          >
            <Moon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
