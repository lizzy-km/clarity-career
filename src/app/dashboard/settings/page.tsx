'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { useUser } from '@/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Please enter your current password." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
});

export default function SettingsPage() {
    const { rawUser: user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [passwordForDelete, setPasswordForDelete] = useState('');
    const [theme, setTheme] = useState('system');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'system';
        setTheme(storedTheme);
        applyTheme(storedTheme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (localStorage.getItem('theme') === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    
    const applyTheme = (selectedTheme: string) => {
        if (selectedTheme === 'system') {
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemIsDark);
        } else {
            document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
        }
    }

    const handleThemeChange = (value: string) => {
        setTheme(value);
        localStorage.setItem('theme', value);
        applyTheme(value);
    }
    
    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const handleChangePassword = async (values: z.infer<typeof passwordFormSchema>) => {
        if (!user || !user.email) return;

        const credential = EmailAuthProvider.credential(user.email, values.currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, values.newPassword);
            toast({ title: "Success", description: "Your password has been updated." });
            passwordForm.reset();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: "There was a problem changing your password. You may need to log out and log back in." });
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        
        const isPasswordProvider = user.providerData.some(
            (provider) => provider.providerId === 'password'
        );
        
        try {
            if (isPasswordProvider && user.email) {
                const credential = EmailAuthProvider.credential(user.email, passwordForDelete);
                await reauthenticateWithCredential(user, credential);
            }
            await deleteUser(user);
            toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
            router.push('/');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: "There was a problem deleting your account. You may need to log out and log back in." });
            setDeleteAlertOpen(false);
        }
    }
    
    const isPasswordProvider = user?.providerData.some(
        (provider) => provider.providerId === 'password'
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                     <RadioGroup value={theme} onValueChange={handleThemeChange} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="light" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Light
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="dark" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Dark
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="system" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            System
                            </FormLabel>
                        </FormItem>
                    </RadioGroup>
                </CardContent>
            </Card>

            {isPasswordProvider && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Change your password here. After changing, you might be logged out for security.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4 max-w-sm">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                    {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Delete Account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all of your content. This action is irreversible.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={!user}>Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            {isPasswordProvider && (
                                <div className="space-y-2">
                                    <Label htmlFor="password-confirm">Please enter your password to confirm.</Label>
                                    <Input 
                                        id="password-confirm" 
                                        type="password"
                                        value={passwordForDelete}
                                        onChange={(e) => setPasswordForDelete(e.target.value)} 
                                    />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} disabled={isPasswordProvider && !passwordForDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
