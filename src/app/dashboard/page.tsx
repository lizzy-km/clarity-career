"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user) return;

    if (user.role === 'employer') {
        router.replace('/dashboard/posted-jobs');
    } else {
        router.replace('/dashboard/applications');
    }
  }, [router, user, loading]);

  return null;
}
