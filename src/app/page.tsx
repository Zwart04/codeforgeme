'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-pulse text-2xl font-bold">CodeForge Me</div>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  );
}