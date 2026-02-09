"use client";

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) return null;
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "CC";
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and professional background.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} data-ai-hint="person portrait" />
                <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.displayName ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email ?? ''} disabled />
              </div>
           </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Showcase your professional journey.</CardDescription>
          </CardHeader>
          <CardContent>
              {/* This would be a list of experiences, for now a form for one */}
              <div className="space-y-4 p-4 border rounded-md relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input id="job-title" placeholder="e.g. Product Manager" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="e.g. Innovate Inc." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="month" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="month" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your role and accomplishments..." />
                </div>
              </div>
              <Button variant="outline" className="mt-4">Add Experience</Button>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your academic background.</CardDescription>
          </CardHeader>
          <CardContent>
              <Button variant="outline">Add Education</Button>
          </CardContent>
      </Card>

    </div>
  );
}
