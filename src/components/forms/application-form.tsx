
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UserProfile, Job } from '@/lib/types';
import { File } from 'lucide-react';

const applicationFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Please enter a valid URL.").or(z.literal('')).optional(),
  coverLetter: z.string().min(20, "Please write a short cover letter.").optional(),
  // resume: ... for file upload later
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  user: UserProfile;
  job: Job;
  onSubmit: (data: ApplicationFormData) => void;
}

export function ApplicationForm({ user, job, onSubmit }: ApplicationFormProps) {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: user.displayName || "",
      email: user.email || "",
      phone: user.phone || "",
      portfolioUrl: user.portfolioUrl || "",
      coverLetter: "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl> <Input type="email" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone Number</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="portfolioUrl" render={({ field }) => ( <FormItem> <FormLabel>Portfolio URL</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea placeholder={`Write a brief message to ${job.company} about why you're a good fit for the ${job.title} role.`} {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <FormLabel>Resume</FormLabel>
            <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                    <File className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {user.resumeUrl ? 'Using resume from your profile.' : 'Please upload a resume on your profile.'}
                    </span>
                </div>
                <Button type="button" variant="outline" size="sm" disabled>Change</Button>
            </div>
             <p className="text-xs text-muted-foreground mt-1">File upload coming soon. For now, please ensure your resume is uploaded on your profile page.</p>
        </div>


        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}

