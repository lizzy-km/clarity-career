
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection } from '@/firebase';
import type { Company } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const reviewFormSchema = z.object({
  companyId: z.string().min(1, "Company is required."),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(5, "Title must be at least 5 characters"),
  pros: z.string().min(10, "Pros must be at least 10 characters"),
  cons: z.string().min(10, "Cons must be at least 10 characters"),
  cultureInsight: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { data: companies, loading: loadingCompanies } = useCollection<Company>('companies');
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
        companyId: "",
        rating: 3,
        title: "",
        pros: "",
        cons: "",
        cultureInsight: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Overall Rating</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map(r => <SelectItem key={r} value={String(r)}>{r} Star{r>1 && 's'}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 'Great place to grow'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pros"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pros</FormLabel>
              <FormControl>
                <Textarea placeholder="What are the best things about working here?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cons</FormLabel>
              <FormControl>
                <Textarea placeholder="What are the downsides of working here?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cultureInsight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Culture Insight (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any insights into the company culture?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
}
