
'use client'

import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { query, where, collection, getDocs } from "firebase/firestore";
import type { Job, Application, UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { JobForm, JobFormData } from '@/components/forms/job-form';
import { addJob } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from "lucide-react";

function PostedJobCard({ job, appCount }: { job: Job, appCount: number }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.location}</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{appCount}</p>
                        <p className="text-sm text-muted-foreground">Applicants</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Link href={`/dashboard/posted-jobs/${job.id}`}>
                    <Button className="w-full">View Applications</Button>
                </Link>
            </CardContent>
        </Card>
    )
}

export default function PostedJobsPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isJobFormOpen, setJobFormOpen] = useState(false);
    const { toast } = useToast();

    const fetchJobsAndApps = async () => {
        if (!user || user.role !== 'employer') return;
        setLoading(true);
        const companiesRef = collection(firestore, 'companies');
        const companiesQuery = query(companiesRef, where('ownerId', '==', user.uid));
        const companySnap = await getDocs(companiesQuery);
        const companyIds = companySnap.docs.map(doc => doc.id);

        if (companyIds.length > 0) {
            const jobsRef = collection(firestore, 'jobs');
            const jobsQuery = query(jobsRef, where('companyId', 'in', companyIds));
            const jobsSnap = await getDocs(jobsQuery);
            const postedJobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
            setJobs(postedJobs);

            const appsRef = collection(firestore, 'applications');
            const appsQuery = query(appsRef, where('companyId', 'in', companyIds));
            const appsSnap = await getDocs(appsQuery);
            const companyApps = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
            setApplications(companyApps);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && user.role === 'employer') {
            fetchJobsAndApps();
        } else if (!userLoading) {
            if(user && user.role !== 'employer') router.push('/dashboard');
        }
    }, [user, userLoading, firestore, router]);

    const getApplicationCount = (jobId: string) => {
        return applications.filter(app => app.jobId === jobId).length;
    };

    const handleJobSubmit = (data: JobFormData) => {
        if (!user) return;
        addJob(firestore, user as UserProfile, data);
        toast({
          title: "Success!",
          description: "Your job has been posted.",
        });
        setJobFormOpen(false);
        // Refetch jobs after submission to show the new one
        fetchJobsAndApps();
    }

    if (!userLoading && user?.role !== 'employer') {
        return null;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Posted Jobs</h1>
                    <p className="text-muted-foreground">View and manage your company's job listings.</p>
                </div>
                <Dialog open={isJobFormOpen} onOpenChange={setJobFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post a Job
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] max-h-[100%] overflow-scroll ">
                        <DialogHeader>
                            <DialogTitle>Post a New Job</DialogTitle>
                            <DialogDescription>Fill out the form below to post a new job opening.</DialogDescription>
                        </DialogHeader>
                        <JobForm onSubmit={handleJobSubmit} />
                    </DialogContent>
                </Dialog>
            </div>

             {loading && <div className="grid md:grid-cols-2 gap-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>}
            
            {!loading && jobs.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <PostedJobCard key={job.id} job={job} appCount={getApplicationCount(job.id)} />
                    ))}
                </div>
            )}
            
            {!loading && jobs.length === 0 && (
                <div className="mt-8 text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                    <p className="font-semibold">No jobs posted yet.</p>
                    <p>Post your first job to see it here.</p>
                </div>
            )}
        </div>
    )
}
