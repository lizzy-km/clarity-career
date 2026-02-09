
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection } from '@/firebase';
import type { Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';

const jobFormSchema = z.object({
  title: z.string().min(2, "Job title is required."),
  companyId: z.string().min(1, "Please select a company."),
  location: z.string().min(2, "Location is required."),
  salaryMin: z.coerce.number().min(1, "Please enter a valid minimum salary."),
  salaryMax: z.coerce.number().min(1, "Please enter a valid maximum salary."),
  industry: z.string().min(2, "Industry is required."),
  description: z.string().min(20, "Description must be at least 20 characters."),
}).refine(data => data.salaryMax > data.salaryMin, {
    message: "Maximum salary must be greater than minimum salary.",
    path: ["salaryMax"],
});

export type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

export function JobForm({ onSubmit }: JobFormProps) {
  const { data: companies, loading: loadingCompanies } = useCollection<Company>('companies');
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
        title: "",
        companyId: "",
        location: "",
        industry: "",
        description: "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        {loadingCompanies ? <Skeleton className="h-10 w-full" /> : 
                        <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                        </SelectTrigger>}
                        </FormControl>
                        <SelectContent>
                            {companies?.map(company => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 120000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="salaryMax"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 180000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the role, responsibilities, and requirements." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Post Job'}
        </Button>
      </form>
    </Form>
  );
}
