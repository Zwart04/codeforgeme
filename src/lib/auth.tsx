'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  inProgress: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => { ok: boolean; reason?: string } | void;
  logout: () => void;
}

const Context = React.createContext<AuthContextValue | null>(null);

const DEFAULT_USER: AuthUser = { id: 'guest-001', name: 'Guest', email: 'guest@codeforgeme.local' };

function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cf_users');
    if (!raw) return [];
    return JSON.parse(raw) as AuthUser[];
  } catch {
    return [];
  }
}

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const email = localStorage.getItem('cf_user_email');
    if (!email) return null;
    const users = getStoredUsers();
    return users.find((u) => u.email === email) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [inProgress, setInProgress] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
  }, []);

  const login = React.useCallback((email: string, _password: string) => {
    setInProgress(true);
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email);
    // Also accept demo account
    const ok = !!found || _password === 'demo123';
    if (ok) {
      const u = found || { id: 'demo-user', name: email.split('@')[0], email };
      if (!found) {
        users.push(u);
        localStorage.setItem('cf_users', JSON.stringify(users));
      }
      localStorage.setItem('cf_user_email', email);
      setUser(u);
    }
    setInProgress(false);
    return ok;
  }, []);

  const register = React.useCallback((name: string, email: string, password: string) => {
    setInProgress(true);
    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      setInProgress(false);
      return { ok: false, reason: 'exists' };
    }
    const newUser: AuthUser = { id: `user-${Date.now()}`, name, email };
    users.push(newUser);
    localStorage.setItem('cf_users', JSON.stringify(users));
    localStorage.setItem('cf_user_email', email);
    setUser(newUser);
    setInProgress(false);
    return { ok: true };
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('cf_user_email');
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, setUser, inProgress, login, register, logout }),
    [user, inProgress, login, register, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth(): AuthContextValue {
  const c = React.useContext(Context);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}

export function getGuestUser(): AuthUser {
  return DEFAULT_USER;
}