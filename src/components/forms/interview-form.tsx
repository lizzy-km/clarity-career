"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const interviewFormSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  difficulty: z.enum(['Easy', 'Average', 'Difficult']),
  questions: z.string().min(10, "Please provide some sample questions."),
  experience: z.string().min(20, "Please describe your experience in more detail."),
});

export type InterviewFormData = z.infer<typeof interviewFormSchema>;

interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => void;
}

export function InterviewForm({ onSubmit }: InterviewFormProps) {
  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
        company: "",
        jobTitle: "",
        difficulty: "Average",
        questions: "",
        experience: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. DataStream" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Backend Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Interview Difficulty</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                    >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Easy" />
                        </FormControl>
                        <FormLabel className="font-normal">Easy</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Average" />
                        </FormControl>
                        <FormLabel className="font-normal">Average</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Difficult" />
                        </FormControl>
                        <FormLabel className="font-normal">Difficult</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
          control={form.control}
          name="questions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Questions</FormLabel>
              <FormControl>
                <Textarea placeholder="What questions were you asked? (e.g., 'Tell me about a time you handled a conflict.')" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the interview process from start to finish." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Experience'}
        </Button>
      </form>
    </Form>
  );
}
