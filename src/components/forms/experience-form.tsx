
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { WorkExperience } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';

const experienceFormSchema = z.object({
  title: z.string().min(2, "Title is required."),
  company: z.string().min(2, "Company is required."),
  location: z.string().min(2, "Location is required."),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable(),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

export type ExperienceFormData = z.infer<typeof experienceFormSchema>;

interface ExperienceFormProps {
  onSubmit: (data: ExperienceFormData) => void;
  initialData?: WorkExperience;
}

export function ExperienceForm({ onSubmit, initialData }: ExperienceFormProps) {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
        title: initialData?.title || "",
        company: initialData?.company || "",
        location: initialData?.location || "",
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || null,
        description: initialData?.description || "",
    }
  });

  const isCurrent = form.watch('endDate') === null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl> <Input placeholder="e.g. Product Manager" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="company" render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl> <Input placeholder="e.g. Innovate Inc." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <FormControl> <Input placeholder="e.g. New York, NY" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem> <FormLabel>Start Date</FormLabel> <FormControl> <Input type="month" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem> <FormLabel>End Date</FormLabel> <FormControl> <Input type="month" {...field} value={field.value ?? ""} disabled={isCurrent} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                    <Checkbox
                    checked={field.value === null}
                    onCheckedChange={(checked) => {
                        return checked ? field.onChange(null) : field.onChange("");
                    }}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    I am currently working in this role
                    </FormLabel>
                </div>
                </FormItem>
            )}
        />
        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl> <Textarea placeholder="Describe your role and accomplishments..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Experience'}
        </Button>
      </form>
    </Form>
  );
}
