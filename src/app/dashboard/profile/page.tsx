
"use client";

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { updateUserProfile } from '@/firebase/firestore/writes';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserProfile, WorkExperience, Education } from '@/lib/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ExperienceForm, ExperienceFormData } from '@/components/forms/experience-form';
import { EducationForm, EducationFormData } from '@/components/forms/education-form';
import { Pen, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Please enter a valid URL.").or(z.literal('')).optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, rawUser, loading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [editingExperience, setEditingExperience] = useState<WorkExperience | undefined>();
  const [experienceFormOpen, setExperienceFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | undefined>();
  const [educationFormOpen, setEducationFormOpen] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: {
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        portfolioUrl: user?.portfolioUrl || '',
    }
  });

  if (loading || !user || !rawUser) return null; // Or a loading skeleton
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "CC";
    return name.split(' ').map(n => n[0]).join('');
  }

  const handleProfileSave = async (data: ProfileFormData) => {
    try {
        if (data.displayName !== user.displayName) {
          await updateAuthProfile(rawUser, { displayName: data.displayName });
        }
        updateUserProfile(firestore, user.uid, data);
        toast({ title: "Success", description: "Your profile has been updated." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  }

  const handleExperienceSubmit = (data: ExperienceFormData) => {
    const newExperience: WorkExperience = { ...data, id: editingExperience?.id || uuidv4() };
    const currentExperiences = user.workExperience || [];
    
    let updatedExperiences: WorkExperience[];
    if (editingExperience) {
        updatedExperiences = currentExperiences.map(exp => exp.id === newExperience.id ? newExperience : exp);
    } else {
        updatedExperiences = [...currentExperiences, newExperience];
    }
    
    updateUserProfile(firestore, user.uid, { workExperience: updatedExperiences });
    toast({ title: "Success", description: "Work experience updated." });
    setExperienceFormOpen(false);
    setEditingExperience(undefined);
  };

  const deleteExperience = (id: string) => {
      const updatedExperiences = (user.workExperience || []).filter(exp => exp.id !== id);
      updateUserProfile(firestore, user.uid, { workExperience: updatedExperiences });
      toast({ title: "Success", description: "Work experience removed." });
  }

  const handleEducationSubmit = (data: EducationFormData) => {
    const newEducation: Education = { ...data, id: editingEducation?.id || uuidv4() };
    const currentEducation = user.education || [];
    
    let updatedEducation: Education[];
    if (editingEducation) {
        updatedEducation = currentEducation.map(edu => edu.id === newEducation.id ? newEducation : edu);
    } else {
        updatedEducation = [...currentEducation, newEducation];
    }
    
    updateUserProfile(firestore, user.uid, { education: updatedEducation });
    toast({ title: "Success", description: "Education updated." });
    setEducationFormOpen(false);
    setEditingEducation(undefined);
  };

  const deleteEducation = (id: string) => {
      const updatedEducation = (user.education || []).filter(edu => edu.id !== id);
      updateUserProfile(firestore, user.uid, { education: updatedEducation });
      toast({ title: "Success", description: "Education removed." });
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
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProfileSave)} className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    {/* <Button variant="outline" type="button">Change Photo</Button>
                     <Button variant="outline" type="button">Upload Resume</Button> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="displayName" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <div className="space-y-2"> <Label htmlFor="email">Email</Label> <Input id="email" type="email" defaultValue={user.email ?? ''} disabled /> </div>
                    <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl> <Input placeholder="e.g. +1 234 567 890" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="portfolioUrl" render={({ field }) => ( <FormItem> <FormLabel>Portfolio URL</FormLabel> <FormControl> <Input placeholder="https://your-portfolio.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Showcase your professional journey.</CardDescription>
              </div>
               <Dialog open={experienceFormOpen} onOpenChange={(isOpen) => { setExperienceFormOpen(isOpen); if (!isOpen) setEditingExperience(undefined); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add Experience</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingExperience ? 'Edit' : 'Add'} Work Experience</DialogTitle>
                        </DialogHeader>
                        <ExperienceForm onSubmit={handleExperienceSubmit} initialData={editingExperience} />
                    </DialogContent>
                </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
              {user.workExperience?.map(exp => (
                  <div key={exp.id} className="flex items-start justify-between p-4 border rounded-md">
                      <div>
                          <h4 className="font-bold">{exp.title}</h4>
                          <p className="text-sm">{exp.company} &middot; {exp.location}</p>
                          <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'}</p>
                          <p className="text-sm mt-2 whitespace-pre-wrap">{exp.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingExperience(exp); setExperienceFormOpen(true); }}>
                            <Pen className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                  </div>
              ))}
              {(!user.workExperience || user.workExperience.length === 0) && (
                  <p className="text-sm text-muted-foreground">No work experience added yet.</p>
              )}
          </CardContent>
      </Card>

      <Card>
          <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your academic background.</CardDescription>
              </div>
              <Dialog open={educationFormOpen} onOpenChange={(isOpen) => { setEducationFormOpen(isOpen); if (!isOpen) setEditingEducation(undefined); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add Education</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingEducation ? 'Edit' : 'Add'} Education</DialogTitle>
                        </DialogHeader>
                        <EducationForm onSubmit={handleEducationSubmit} initialData={editingEducation} />
                    </DialogContent>
                </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
              {user.education?.map(edu => (
                  <div key={edu.id} className="flex items-start justify-between p-4 border rounded-md">
                      <div>
                          <h4 className="font-bold">{edu.school}</h4>
                          <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                          <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingEducation(edu); setEducationFormOpen(true); }}>
                            <Pen className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                  </div>
              ))}
              {(!user.education || user.education.length === 0) && (
                  <p className="text-sm text-muted-foreground">No education added yet.</p>
              )}
          </CardContent>
      </Card>
    </div>
  );
}

