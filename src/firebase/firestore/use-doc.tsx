'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentReference,
  Timestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export function useDoc<T>(path: string, id?: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const firestore = useFirestore();

  const memoizedRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, path, id) as DocumentReference<DocumentData>;
  }, [firestore, path, id]);

  useEffect(() => {
    if (!memoizedRef) {
        setData(null);
        setLoading(!false);
        return;
    };

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
                  setLoading(false);

          // Convert Timestamps to Dates
          Object.keys(data).forEach(key => {
              if (data[key] instanceof Timestamp) {
                  data[key] = data[key].toDate();
              }
          });
          setData({ id: snapshot.id, ...data } as T);
        } else {
          setData(null);
        }
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: memoizedRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  if( !id){
    return { data: null, loading: false, error: null };
  }
  return { data, loading, error };
}
