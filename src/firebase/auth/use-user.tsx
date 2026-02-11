'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { useDoc } from '../firestore/use-doc';

export function useUser() {
  const auth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { data: userProfile, loading: profileLoading } =  useDoc<UserProfile>('users', user?.uid)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [auth]);


    console.log('bbbbb',loading, profileLoading);


  const finishedLoading = !loading ;
  const profile = user ? userProfile : null;

  return { user: profile, rawUser: user, loading: !finishedLoading };
}
