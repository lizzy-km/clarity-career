"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Chrome } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);
  const { user, loading: userLoading } = useUser();
  const isMobile = useIsMobile();

  const handleOAuthSuccess = useCallback(async (oauthUser: User) => {
    const userRef = doc(firestore, 'users', oauthUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: oauthUser.uid,
        displayName: oauthUser.displayName,
        email: oauthUser.email,
        photoURL: oauthUser.photoURL,
        role: 'employee',
      });
    }

    toast({ title: "Success", description: "Logged in successfully with Google." });
    router.push('/dashboard');
  }, [firestore, router, toast]);

  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result) {
          handleOAuthSuccess(result.user);
        }
      })
      .catch(error => {
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
      })
      .finally(() => {
        setIsCheckingRedirect(false);
      });
  }, [auth, handleOAuthSuccess, toast]);

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Success", description: "Logged in successfully." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
      setFormLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setFormLoading(true);
    const googleProvider = new GoogleAuthProvider();
    if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
    } else {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          await handleOAuthSuccess(result.user);
        } catch (error: any) {
          if (error.code !== 'auth/popup-closed-by-user') {
            toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message });
          }
          setFormLoading(false);
        }
    }
  };

  const pageLoading = userLoading || isCheckingRedirect;



  if (pageLoading) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Please Wait</CardTitle>
                <CardDescription>
                We're checking your session...
                </CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                    </div>
                </div>
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />

             </CardContent>
             <CardFooter>
                 <Skeleton className="h-10 w-full" />
             </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="grid gap-4">
          <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={formLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={formLoading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={formLoading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={formLoading}>
            {formLoading ? 'Logging in...' : 'Sign in'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
