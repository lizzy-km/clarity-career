
'use client';
import { useUser, useCollection, useFirestore, useDoc } from '@/firebase';
import type { Job, UserProfile } from '@/lib/types';
import { collection, query, where, documentId } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toggleSaveJob } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';

function JobCard({ job, onSave, isSaved }: { job: Job, onSave: (jobId: string) => void, isSaved: boolean }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image src={job.companyLogoUrl} alt={`${job.company} logo`} width={50} height={50} className="rounded-lg border" data-ai-hint="company logo"/>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          Posted {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(job.postedAt as any))}
        </span>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}`}>View Details</Link>
            </Button>
             <Button variant="ghost" size="icon" onClick={() => onSave(job.id)}>
                <Heart className={isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
            </Button>
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

export default function SavedJobsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { data: userData } = useDoc<UserProfile>('users', user?.uid);

    const savedJobIds = userData?.savedJobs || [];

    const jobsQuery = savedJobIds.length > 0 ? query(
        collection(firestore, 'jobs'),
        where(documentId(), 'in', savedJobIds)
    ) : null;

    const { data: savedJobs, loading } = useCollection<Job>('jobs', jobsQuery);

    const handleSaveToggle = (jobId: string) => {
        if (!user) return;
        toggleSaveJob(firestore, user.uid, jobId);
        toast({
            title: "Updated",
            description: "Your saved jobs have been updated."
        })
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Saved Jobs</h1>
            <p className="text-lg text-muted-foreground mb-8">Your saved jobs are here for you to review.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading && Array.from({length: 2}).map((_, i) => <JobCardSkeleton key={i} />)}
                {savedJobs && savedJobs.map(job => (
                    <JobCard 
                        key={job.id} 
                        job={job}
                        onSave={handleSaveToggle}
                        isSaved={true}
                    />
                ))}
                {!loading && (!savedJobs || savedJobs.length === 0) && (
                    <div className="lg:col-span-2 text-center text-muted-foreground py-16">
                        <p className="text-lg font-semibold">No saved jobs</p>
                        <p>You haven't saved any jobs yet. Start exploring!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
