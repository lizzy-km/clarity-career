
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useCollection, useDoc, useFirestore } from '@/firebase';
import { query, where, collection } from 'firebase/firestore';
import type { Application, Job } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { updateApplicationStatus } from '@/firebase/firestore/writes';
import { useEffect } from 'react';

const statusStyles = {
    'Applied': 'secondary',
    'Interviewing': 'default',
    'Offered': 'default',
    'Rejected': 'destructive',
} as const;

export default function JobApplicationsPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId as string;
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const { data: job, loading: jobLoading } = useDoc<Job>('jobs', jobId);
    
    const applicationsQuery = jobId ? query(
        collection(firestore, 'applications'),
        where('jobId', '==', jobId)
    ) : null;
    const { data: applications, loading: appsLoading } = useCollection<Application>('applications', applicationsQuery);

    const handleStatusChange = (applicationId: string, status: string) => {
        if (!user) return;
        updateApplicationStatus(applicationId, status);
        toast({ title: "Status Updated", description: `The application status has been changed to ${status}.`});
    }

    // Basic security check: if the app query returns nothing, the user probably doesn't have access
    useEffect(() => {
        if (!userLoading && !appsLoading && user?.role !== 'employer') {
            router.push('/dashboard');
        }
    }, [user, userLoading, appsLoading, router]);

    const loading = userLoading || appsLoading || jobLoading;

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline">Applications for {job?.title || '...'}</h1>
            <p className="text-muted-foreground mb-8">Review and manage applications for this job posting.</p>
            
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && <TableRow><TableCell colSpan={4}><Skeleton className="h-24 w-full" /></TableCell></TableRow>}
                            {applications?.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="font-medium">{app.applicantName}</div>
                                        <div className="text-sm text-muted-foreground">{app.applicantEmail}</div>
                                    </TableCell>
                                    <TableCell>{app.submittedAt ? new Intl.DateTimeFormat('en-US').format(new Date(app.submittedAt as any)) : '-'}</TableCell>
                                    <TableCell>
                                        <Select defaultValue={app.status} onValueChange={(value) => handleStatusChange(app.id, value)}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Applied"><Badge variant={statusStyles['Applied']}>Applied</Badge></SelectItem>
                                                <SelectItem value="Interviewing"><Badge variant={statusStyles['Interviewing']}>Interviewing</Badge></SelectItem>
                                                <SelectItem value="Offered"><Badge className="bg-green-500 hover:bg-green-600">Offered</Badge></SelectItem>
                                                <SelectItem value="Rejected"><Badge variant={statusStyles['Rejected']}>Rejected</Badge></SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <a href={`mailto:${app.applicantEmail}`} className="text-primary hover:underline">Email</a>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && applications?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">No applications yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
