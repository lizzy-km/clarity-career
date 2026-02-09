
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  logoUrl: z.string().url("Please enter a valid URL for the logo."),
  website: z.string().url("Please enter a valid URL for the website.").optional().or(z.literal('')),
  description: z.string().min(10, "Description must be at least 10 characters.").optional().or(z.literal('')),
  employeeSize: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
}

export function CompanyForm({ onSubmit }: CompanyFormProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      website: "",
      description: "",
      employeeSize: "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="employeeSize"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Employee Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a size range" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="1-50">1-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1001+">1001+ employees</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Company'}
        </Button>
      </form>
    </Form>
  );
}
