
'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import type { Job, UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { addJob, submitApplication, toggleSaveJob } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { JobForm, JobFormData } from '@/components/forms/job-form';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';


function JobCard({ job, user, onSave, isSaved }: { job: Job, user: UserProfile | null, onSave: (jobId: string) => void, isSaved: boolean }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image src={job.companyLogoUrl} alt={`${job.company} logo`} width={50} height={50} className="rounded-lg border" data-ai-hint="company logo" />
        <div>
          <CardTitle className="text-xl hover:underline"><Link href={`/jobs/${job.id}`}>{job.title}</Link></CardTitle>
          <CardDescription className="text-base">{job.company}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" /> <span>{job.industry}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" /> 
            {job.isSalaryNegotiable ? (
                <span>Negotiable</span>
            ) : (
                <span>{formatCurrency(job.salaryMin, job.currency)} - {formatCurrency(job.salaryMax, job.currency)}</span>
            )}
        </div>
         <div className="flex flex-wrap gap-2 pt-2">
            {job.workMode && <Badge variant="outline">{job.workMode}</Badge>}
            {job.employmentType && <Badge variant="outline">{job.employmentType}</Badge>}
            {job.positionLevel && <Badge variant="outline">{job.positionLevel}</Badge>}
        </div>
        <p className="pt-2 text-sm text-foreground/80 line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Posted {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(job.postedAt as any))}
        </span>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
            </Button>
            {user && (
                <Button variant="ghost" size="icon" onClick={() => onSave(job.id)}>
                    <Heart className={isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}

function JobCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4">
                <Skeleton className="h-[50px] w-[50px] rounded-lg border" />
                <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                </div>
            </CardFooter>
        </Card>
    )
}

function JobsPageContent() {
  const { data: jobs, loading } = useCollection<Job>('jobs');
  const industries = [...new Set(jobs?.map(job => job.industry) || [])];
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for forms/dialogs
  const [isJobFormOpen, setJobFormOpen] = useState(false);
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('all');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');


  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    return jobs.filter(job => {
      const minSal = minSalary ? parseInt(minSalary, 10) : 0;
      const maxSal = maxSalary ? parseInt(maxSalary, 10) : Infinity;

      return (
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
         job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        job.location.toLowerCase().includes(location.toLowerCase()) &&
        (industry === 'all' || job.industry === industry) &&
        (job.salaryMax ? job.salaryMax >= minSal : true) &&
        (job.salaryMin ? job.salaryMin <= maxSal : true)
      );
    });
  }, [jobs, searchTerm, location, industry, minSalary, maxSalary]);

  
  const handleSaveToggle = (jobId: string) => {
    if (!user) {
        toast({ variant: "destructive", title: "Login required", description: "You need to be logged in to save jobs." });
        return;
    }
    toggleSaveJob(firestore, user.uid, jobId);
    toast({ title: "Updated", description: "Your saved jobs list is updated." });
  }

  const handleJobSubmit = (data: JobFormData) => {
    if (!user) return;
    addJob(firestore, user as UserProfile, data);
    toast({
      title: "Success!",
      description: "Your job has been posted.",
    });
    setJobFormOpen(false);
  }
  
  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setIndustry('all');
    setMinSalary('');
    setMaxSalary('');
    router.replace('/jobs');
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Find Your Next Opportunity</h1>
            <p className="text-lg text-muted-foreground mb-8">Search through thousands of open positions.</p>
        </div>
        {user?.role === 'employer' && (
            <Dialog open={isJobFormOpen} onOpenChange={setJobFormOpen}>
                <DialogTrigger asChild>
                    <Button>Post a Job</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] max-h-[100%] overflow-scroll ">
                    <DialogHeader>
                        <DialogTitle>Post a New Job</DialogTitle>
                        <DialogDescription>Fill out the form below to post a new job opening.</DialogDescription>
                    </DialogHeader>
                    <JobForm onSubmit={handleJobSubmit} />
                </DialogContent>
            </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 border rounded-lg bg-card">
        <Input 
            placeholder="Job title, keywords..." 
            className="md:col-span-2 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input 
            placeholder="Location (e.g., San Francisco)" 
            className="h-12" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
        />
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(industry => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 md:col-span-4">
          <Input 
            type="number" 
            placeholder="Min Salary" 
            className="h-12" 
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input 
            type="number" 
            placeholder="Max Salary" 
            className="h-12" 
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
          <Button onClick={clearFilters} variant="outline" className="md:col-start-4 h-12 w-full md:w-auto">Clear Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && <> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> </>}
        {filteredJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onSave={handleSaveToggle} 
            isSaved={user?.savedJobs?.includes(job.id) || false} 
            user={user} 
          />
        ))}
         {!loading && filteredJobs.length === 0 && (
            <div className="lg:col-span-2 text-center text-muted-foreground py-16">
                <p className="text-lg font-semibold">No jobs found</p>
                <p>Try adjusting your search filters or clearing them.</p>
            </div>
        )}
      </div>
    </div>
  );
}


export default function JobsPage() {
    const loadingSkeletons = <> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> </>;
    return (
        <Suspense fallback={loadingSkeletons}>
            <JobsPageContent />
        </Suspense>
    )
}
