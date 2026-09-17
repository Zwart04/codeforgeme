'use client';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from '@/components/theme-provider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
