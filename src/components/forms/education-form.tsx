
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Education } from '@/lib/types';

const educationFormSchema = z.object({
  school: z.string().min(2, "School name is required."),
  degree: z.string().min(2, "Degree is required."),
  fieldOfStudy: z.string().min(2, "Field of study is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
});

export type EducationFormData = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  onSubmit: (data: EducationFormData) => void;
  initialData?: Education;
}

export function EducationForm({ onSubmit, initialData }: EducationFormProps) {
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
        school: initialData?.school || "",
        degree: initialData?.degree || "",
        fieldOfStudy: initialData?.fieldOfStudy || "",
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="school" render={({ field }) => ( <FormItem> <FormLabel>School / University</FormLabel> <FormControl> <Input placeholder="e.g. University of California, Berkeley" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="degree" render={({ field }) => ( <FormItem> <FormLabel>Degree</FormLabel> <FormControl> <Input placeholder="e.g. Bachelor of Science" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="fieldOfStudy" render={({ field }) => ( <FormItem> <FormLabel>Field of Study</FormLabel> <FormControl> <Input placeholder="e.g. Computer Science" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem> <FormLabel>Start Date</FormLabel> <FormControl> <Input type="month" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem> <FormLabel>End Date</FormLabel> <FormControl> <Input type="month" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Education'}
        </Button>
      </form>
    </Form>
  );
}
