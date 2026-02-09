
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useUser, useFirestore } from '@/firebase';
import type { Job, Company } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { MapPin, Briefcase, DollarSign, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ApplicationForm, ApplicationFormData } from '@/components/forms/application-form';
import { useToast } from '@/hooks/use-toast';
import { submitApplication, toggleSaveJob } from '@/firebase/firestore/writes';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const { data: job, loading: jobLoading } = useDoc<Job>('jobs', jobId);
    const { data: company, loading: companyLoading } = useDoc<Company>('companies', job?.companyId);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [isApplyFormOpen, setApplyFormOpen] = useState(false);
    
    const isSaved = user?.savedJobs?.includes(jobId) || false;

    const handleSaveToggle = () => {
        if (!user) {
            toast({ variant: "destructive", title: "Login required", description: "You need to be logged in to save jobs." });
            return;
        }
        toggleSaveJob(firestore, user.uid, jobId);
        toast({ title: "Updated", description: "Your saved jobs list is updated." });
    };

    const handleOpenApplyDialog = () => {
        if (!user) {
            toast({ variant: "destructive", title: "Authentication required", description: "You must be logged in to apply for jobs."});
            router.push('/login');
            return;
        }
        setApplyFormOpen(true);
    };

    const handleApplicationSubmit = (data: ApplicationFormData) => {
        if (!user || !job) return;
        submitApplication(firestore, user, job, data);
        toast({ title: "Applied!", description: `Your application for ${job.title} has been submitted.` });
        setApplyFormOpen(false);
    }

    const loading = jobLoading || companyLoading;

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        );
    }
// 
    // console.log(user)

    if (!job) {
        return <div className="container text-center py-16">Job not found.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Image src={job.companyLogoUrl} alt={`${job.company} logo`} width={64} height={64} className="rounded-xl border" data-ai-hint="company logo"/>
                    <div>
                        <h1 className="text-4xl font-bold font-headline">{job.title}</h1>
                        <p className="text-xl text-muted-foreground">{job.company}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 text-muted-foreground mt-4">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span>{job.location}</span></div>
                    <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> <span>{job.industry}</span></div>
                    <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> <span>{`$${(job.salaryMin / 1000)}k - $${(job.salaryMax / 1000)}k`}</span></div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                        <p className="text-foreground/80 whitespace-pre-wrap">{job.description}</p>
                    </div>
                </div>

                <aside>
                    <Card>
                        <CardHeader>
                            <CardTitle>Apply for this position</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                             {user && company && user.uid !== company.ownerId && (
                                <>
                                <Button size="lg" onClick={handleOpenApplyDialog}>Apply Now</Button>
                                <Button size="lg" variant="outline" onClick={handleSaveToggle}>
                                    <Heart className={`mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                                    {isSaved ? 'Saved' : 'Save Job'}
                                </Button>
                                </>
                            )}
                            {user && company && user.uid === company.ownerId && (
                                <p className="text-sm text-muted-foreground">You cannot apply to a job you posted.</p>
                            )}
                            {!user && <p className="text-sm text-muted-foreground">Log in to apply for this job.</p>}
                        </CardContent>
                    </Card>
                </aside>
            </div>
             <Dialog open={isApplyFormOpen} onOpenChange={setApplyFormOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Apply for {job?.title}</DialogTitle>
                        <DialogDescription>Submit your application for {job?.title} at {job?.company}.</DialogDescription>
                    </DialogHeader>
                    {user && job && <ApplicationForm user={user} job={job} onSubmit={handleApplicationSubmit} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
