'use client';
import { useCollection, useUser, useFirestore } from '@/firebase';
import type { SalaryData, UserProfile, Company } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addSalary } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const salaryFormSchema = z.object({
    jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
    companyId: z.string().min(1, { message: "Please select a company." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    salary: z.coerce.number().min(1, { message: "Please enter a valid salary." }),
    yearsOfExperience: z.coerce.number().min(0, { message: "Years of experience cannot be negative." }),
});

export type SalaryFormData = z.infer<typeof salaryFormSchema>;

export default function SalariesPage() {
  const { data: salaries, loading } = useCollection<SalaryData>('salaries');
  const { data: companies, loading: loadingCompanies } = useCollection<Company>('companies');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<SalaryFormData>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      jobTitle: "",
      companyId: "",
      location: "",
      salary: undefined,
      yearsOfExperience: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (data: SalaryFormData) => {
    addSalary(firestore, user as UserProfile | null, data);
    toast({
        title: "Contribution Received!",
        description: "Thank you for sharing your salary data.",
    });
    form.reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MMK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold font-headline mb-2">Salary Insights</h1>
        <p className="text-lg text-muted-foreground mb-8">Know your worth. Explore salary data by job title and location.</p>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Years of Exp.</TableHead>
                <TableHead className="text-right">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {salaries?.map(salary => (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">{salary.jobTitle}</TableCell>
                  <TableCell>{salary.company}</TableCell>
                  <TableCell>{salary.location}</TableCell>
                  <TableCell>{salary.yearsOfExperience}</TableCell>
                  <TableCell className="text-right">{formatCurrency(salary.salary)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Contribute Your Salary</CardTitle>
            <CardDescription>Anonymously share your salary to help the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Software Engineer" {...field} />
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
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., New York, NY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Montaly Salary (MMK)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 120000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearsOfExperience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
                    </Button>
                </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
