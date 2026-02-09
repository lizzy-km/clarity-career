
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UserProfile, Job } from '@/lib/types';

const applicationFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Please enter a valid URL.").or(z.literal('')).optional(),
  resumeUrl: z.string().min(1, "A resume URL is required.").url("Please enter a valid URL."),
  coverLetter: z.string().optional(),
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
      resumeUrl: user.resumeUrl || "",
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
            name="resumeUrl"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Resume URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://docs.google.com/document/d/..." {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                        Link to your resume (e.g., Google Docs, LinkedIn profile, or a PDF hosted online).
                    </FormDescription>
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder={`Write a brief message to ${job.company} about why you're a good fit for the ${job.title} role.`} {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}
