'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(path: string, q?: Query) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const firestore = useFirestore();

  const memoizedQuery = useMemo(() => {
    if (!firestore) return null;
    const ref = collection(firestore, path);
    return q || query(ref);
  }, [firestore, path, q]);

  useEffect(() => {
    if (!memoizedQuery) return;

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Timestamps to Dates
            Object.keys(data).forEach(key => {
                if (data[key] instanceof Timestamp) {
                    data[key] = data[key].toDate();
                }
            });
            return { id: doc.id, ...data } as T;
        });
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, path]);

  return { data, loading, error };
}
