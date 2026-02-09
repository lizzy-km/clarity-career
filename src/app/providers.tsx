'use client';

import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

const FirebaseClientProvider = dynamic(
  () => import('@/firebase/client-provider').then((mod) => mod.FirebaseClientProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      {children}
      <Toaster />
    </FirebaseClientProvider>
  );
}
