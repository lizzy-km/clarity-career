'use client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: Error) => {
      if (error instanceof FirestorePermissionError) {
        // This will be caught by Next.js overlay in development
        console.error(error); 
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You don't have permission to perform this action.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.message,
        });
      }
    };

    errorEmitter.on('permission-error', handleError);
    
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
