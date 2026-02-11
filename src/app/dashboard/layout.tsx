"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Briefcase, Settings, Building, FileText, Heart, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';


import { useUser, useAuth } from '@/firebase';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  const employeeNavItems = [
    { href: '/dashboard/applications', label: 'Applications', icon: <Briefcase /> },
    { href: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: <Heart /> },
    { href: '/dashboard/profile', label: 'Profile', icon: <User /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
  ];

  const employerNavItems = [
    { href: '/dashboard/applications', label: 'Applications', icon: <Briefcase /> },

    { href: '/dashboard/posted-jobs', label: 'Posted Jobs', icon: <FileText /> },
    { href: '/dashboard/companies', label: 'My Companies', icon: <Building /> },
    { href: '/dashboard/profile', label: 'Profile', icon: <User /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
  ];

  const navItems = user.role === 'employer' ? employerNavItems : employeeNavItems;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref >
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <div className="mt-auto">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">{user.role === 'employer' ? "Employer Dashboard" : "My Dashboard"}</h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
