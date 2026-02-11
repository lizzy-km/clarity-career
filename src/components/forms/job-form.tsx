
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
import { Checkbox } from '../ui/checkbox';

const jobFormSchema = z.object({
  title: z.string().min(2, "Job title is required."),
  companyId: z.string().min(1, "Please select a company."),
  location: z.string().min(2, "Location is required."),
  isSalaryNegotiable: z.boolean().default(false),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  industry: z.string().min(2, "Industry is required."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  positionLevel: z.string().min(1, "Position level is required"),
  experienceRequired: z.string().min(1, "Experience level is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  workMode: z.string().min(1, "Work mode is required"),
}).superRefine((data, ctx) => {
    if (!data.isSalaryNegotiable) {
        if (!data.salaryMin || data.salaryMin <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salaryMin'],
                message: "Minimum salary is required.",
            });
        }
        if (!data.salaryMax || data.salaryMax <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salaryMax'],
                message: "Maximum salary is required.",
            });
        }
        if (data.salaryMin && data.salaryMax && data.salaryMax <= data.salaryMin) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salaryMax'],
                message: "Maximum salary must be greater than minimum.",
            });
        }
    }
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
        isSalaryNegotiable: false,
    }
  });
  
  const isSalaryNegotiable = form.watch('isSalaryNegotiable');

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
                    <FormLabel>Office Location</FormLabel>
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
            <FormField control={form.control} name="positionLevel" render={({ field }) => ( <FormItem> <FormLabel>Position Level</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select level" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="Internship">Internship</SelectItem> <SelectItem value="Entry-level">Entry-level</SelectItem> <SelectItem value="Mid-level">Mid-level</SelectItem> <SelectItem value="Senior">Senior-level</SelectItem> <SelectItem value="Lead">Lead</SelectItem> <SelectItem value="Manager">Manager</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="experienceRequired" render={({ field }) => ( <FormItem> <FormLabel>Experience Required</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select experience" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="0-1 years">0-1 years</SelectItem> <SelectItem value="1-3 years">1-3 years</SelectItem> <SelectItem value="3-5 years">3-5 years</SelectItem> <SelectItem value="5+ years">5+ years</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormField control={form.control} name="employmentType" render={({ field }) => ( <FormItem> <FormLabel>Employment Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select type" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="Full-time">Full-time</SelectItem> <SelectItem value="Part-time">Part-time</SelectItem> <SelectItem value="Contract">Contract</SelectItem> <SelectItem value="Internship">Internship</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="workMode" render={({ field }) => ( <FormItem> <FormLabel>Work Mode</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select mode" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="On-site">On-site</SelectItem> <SelectItem value="Remote">Remote</SelectItem> <SelectItem value="Hybrid">Hybrid</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
        </div>
        
        <FormField
            control={form.control}
            name="isSalaryNegotiable"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Salary is negotiable
                    </FormLabel>
                </div>
                </FormItem>
            )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 120000" {...field} disabled={isSalaryNegotiable} />
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
                        <Input type="number" placeholder="e.g. 180000" {...field} disabled={isSalaryNegotiable} />
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
