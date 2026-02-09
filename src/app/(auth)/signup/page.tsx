"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const userRef = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        photoURL: userCredential.user.photoURL,
      });

      toast({ title: "Success", description: "Account created successfully." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
      setLoading(false);
    }
  };
  
  if (userLoading || user) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
