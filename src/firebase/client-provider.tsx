'use client';
import { ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

// Initialize Firebase at the module level to ensure it only runs once.
const firebase = initializeFirebase();

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
