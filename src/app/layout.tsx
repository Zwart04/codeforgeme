import { AppProvider } from '@/components/app-provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeForge Me — Collaborative Code Playground',
  description: 'Write, run, and share code together. Real-time collaborative code editor with AI suggestion and GPU terminal rendering.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
