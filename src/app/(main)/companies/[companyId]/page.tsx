
'use client';

import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Company, Job, CompanyReview, SalaryData, UserProfile } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Users, Heart, Star } from 'lucide-react';
import { toggleSaveJob } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';


function JobListItem({ job, user, onSave, isSaved }: { job: Job, user: UserProfile | null, onSave: (jobId: string) => void, isSaved: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg hover:underline"><Link href={`/jobs/${job.id}`}>{job.title}</Link></CardTitle>
                <CardDescription>{job.location}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{`$${(job.salaryMin / 1000)}k - $${(job.salaryMax / 1000)}k`}</span>
                {user && user.role === 'employee' && (
                    <Button variant="ghost" size="icon" onClick={() => onSave(job.id)}>
                        <Heart className={isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                    </Button>
                )}
            </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

function ReviewListItem({ review }: { review: CompanyReview }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{review.title}</CardTitle>
                <CardDescription className="text-sm">By {review.author} on {new Intl.DateTimeFormat('en-US').format(new Date(review.createdAt as any))}</CardDescription>
            </div>
            <StarRating rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
            <h4 className="font-semibold text-green-600">Pros</h4>
            <p className="text-sm text-muted-foreground">{review.pros}</p>
        </div>
        <div>
            <h4 className="font-semibold text-red-600">Cons</h4>
            <p className="text-sm text-muted-foreground">{review.cons}</p>
        </div>
        {review.cultureInsight && <div>
            <h4 className="font-semibold">Culture Insight</h4>
            <p className="text-sm text-muted-foreground">{review.cultureInsight}</p>
        </div>}
      </CardContent>
    </Card>
  );
}


export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const { data: company, loading: companyLoading } = useDoc<Company>('companies', companyId);

  const jobsQuery = useMemo(() => (companyId ? query(collection(firestore, 'jobs'), where('companyId', '==', companyId)) : null), [firestore, companyId]);
  const { data: jobs, loading: jobsLoading } = useCollection<Job>('jobs', jobsQuery);

  const reviewsQuery = useMemo(() => (companyId ? query(collection(firestore, 'reviews'), where('companyId', '==', companyId)) : null), [firestore, companyId]);
  const { data: reviews, loading: reviewsLoading } = useCollection<CompanyReview>('reviews', reviewsQuery);

  const salariesQuery = useMemo(() => (companyId ? query(collection(firestore, 'salaries'), where('companyId', '==', companyId)) : null), [firestore, companyId]);
  const { data: salaries, loading: salariesLoading } = useCollection<SalaryData>('salaries', salariesQuery);

  const loading = companyLoading || jobsLoading || reviewsLoading || salariesLoading;

  const handleSaveToggle = (jobId: string) => {
    if (!user) {
        toast({ variant: "destructive", title: "Login required", description: "You need to be logged in to save jobs." });
        return;
    }
    toggleSaveJob(firestore, user.uid, jobId);
    toast({ title: "Updated", description: "Your saved jobs list is updated." });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MMK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  if (loading) {
      return (
          <div className="container mx-auto py-8">
              <div className="flex items-center gap-6 mb-4">
                  <Skeleton className="h-20 w-20 rounded-xl" />
                  <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                  </div>
              </div>
              <Skeleton className="h-5 w-full mb-8" />
              <div className="space-y-6">
                  <Skeleton className="h-12 w-96 mb-4" />
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-32 w-full" />
              </div>
          </div>
      );
  }

  if (!company) {
    return <div className="container text-center py-16">Company not found.</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-6 mb-4">
            <Image src={company.logoUrl} alt={`${company.name} logo`} width={80} height={80} className="rounded-xl border" data-ai-hint="company logo"/>
            <div>
                <h1 className="text-4xl font-bold font-headline">{company.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mt-2">
                    {company.website && (
                         <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                            <Globe className="h-4 w-4" /> <span>{company.website.replace(/https?:\/\//, '')}</span>
                         </a>
                    )}
                    {company.employeeSize && (
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> <span>{company.employeeSize} employees</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
        {company.description && <p className="text-foreground/80">{company.description}</p>}
      </header>

      <Tabs defaultValue="jobs">
          <TabsList className="mb-4">
              <TabsTrigger value="jobs">Jobs ({jobs?.length || 0})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
              <TabsTrigger value="salaries">Salaries ({salaries?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
              <div className="space-y-4">
                  {jobs?.length ? jobs.map(job => (
                      <JobListItem 
                        key={job.id} 
                        job={job}
                        user={user}
                        onSave={handleSaveToggle}
                        isSaved={user?.savedJobs?.includes(job.id) || false} 
                      />
                  )) : <p className="text-muted-foreground text-center py-8">No open positions at the moment.</p>}
              </div>
          </TabsContent>
          <TabsContent value="reviews">
              <div className="space-y-4">
                   {reviews?.length ? reviews.map(review => (
                      <ReviewListItem key={review.id} review={review} />
                  )) : <p className="text-muted-foreground text-center py-8">No reviews have been submitted for this company yet.</p>}
              </div>
          </TabsContent>
          <TabsContent value="salaries">
              <Card>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Years of Exp.</TableHead>
                              <TableHead className="text-right">Salary</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salaries?.length ? salaries.map(salary => (
                              <TableRow key={salary.id}>
                                  <TableCell className="font-medium">{salary.jobTitle}</TableCell>
                                  <TableCell>{salary.location}</TableCell>
                                  <TableCell>{salary.yearsOfExperience}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(salary.salary)}</TableCell>
                              </TableRow>
                          )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No salary data available.</TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                  </Table>
              </Card>
          </TabsContent>
      </Tabs>

    </div>
  );
}
