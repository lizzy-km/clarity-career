
'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import type { Job, UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { MapPin, Briefcase, DollarSign, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { saveApplication, addJob } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { JobForm, JobFormData } from '@/components/forms/job-form';

function JobCard({ job, onSave }: { job: Job, onSave: (job: Job) => void }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image src={job.companyLogoUrl} alt={`${job.company} logo`} width={50} height={50} className="rounded-lg border" data-ai-hint="company logo" />
        <div>
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <CardDescription className="text-base">{job.company}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" /> <span>{job.industry}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" /> <span>{`$${(job.salaryMin / 1000)}k - $${(job.salaryMax / 1000)}k`}</span>
        </div>
        <p className="pt-2 text-sm text-foreground/80 line-clamp-3">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          Posted {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(job.postedAt as any))}
        </span>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onSave(job)}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
            </Button>
            <Button size="sm">Apply Now</Button>
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
                    <Skeleton className="h-9 w-24" />
                </div>
            </CardFooter>
        </Card>
    )
}

export default function JobsPage() {
  const { data: jobs, loading } = useCollection<Job>('jobs');
  const industries = [...new Set(jobs?.map(job => job.industry) || [])];
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isFormOpen, setFormOpen] = useState(false);

  const handleSaveJob = (job: Job) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication required",
            description: "You must be logged in to save jobs.",
        });
        router.push('/login');
        return;
    }
    saveApplication(firestore, user.uid, job);
    toast({
        title: "Job Saved!",
        description: `${job.title} has been added to your applications.`,
    });
  };

  const handleJobSubmit = (data: JobFormData) => {
    if (!user) return;
    addJob(firestore, user as UserProfile, data);
    toast({
      title: "Success!",
      description: "Your job has been posted.",
    });
    setFormOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Find Your Next Opportunity</h1>
            <p className="text-lg text-muted-foreground mb-8">Search through thousands of open positions.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
                <Button disabled={!user}>Post a Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                    <DialogDescription>Fill out the form below to post a new job opening.</DialogDescription>
                </DialogHeader>
                <JobForm onSubmit={handleJobSubmit} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 border rounded-lg bg-card">
        <Input placeholder="Job title, keywords..." className="md:col-span-2 h-12" />
        <Input placeholder="Location (e.g., San Francisco)" className="h-12" />
        <Select>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(industry => <SelectItem key={industry} value={industry}>{industry}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 md:col-span-4">
          <Input type="number" placeholder="Min Salary" className="h-12" />
          <span className="text-muted-foreground">-</span>
          <Input type="number" placeholder="Max Salary" className="h-12" />
          <Button className="md:col-start-4 h-12 w-full md:w-auto">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && <> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> <JobCardSkeleton /> </>}
        {jobs?.map(job => (
          <JobCard key={job.id} job={job} onSave={handleSaveJob} />
        ))}
      </div>
    </div>
  );
}
