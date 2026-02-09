
'use client';
import { useCollection, useUser, useFirestore } from '@/firebase';
import type { Application } from '@/lib/types';
import { updateApplicationStatus } from '@/firebase/firestore/writes';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { query, where } from 'firebase/firestore';

const statusStyles = {
    'Applied': 'secondary',
    'Interviewing': 'default',
    'Offered': 'default',
    'Rejected': 'destructive',
} as const;


function ApplicationRowSkeleton() {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md border" />
                    <div>
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="h-9 w-[150px]" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell className="text-right">
                <Skeleton className="h-5 w-16 ml-auto" />
            </TableCell>
        </TableRow>
    );
}

export default function ApplicationsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const applicationsQuery = user ? query(
    collection(firestore, 'applications'),
    where('applicantId', '==', user.uid)
  ) : null;
  
  const { data: applications, loading } = useCollection<Application>(`applications`, applicationsQuery);

  const { toast } = useToast();

  const handleStatusChange = (applicationId: string, status: string) => {
    if (!user) return;
    updateApplicationStatus(applicationId, status);
    toast({
        title: "Status Updated",
        description: `The application status has been changed to ${status}.`
    });
  }

  return (
    <div className="space-y-8 px-4">
       <div>
        <h1 className="text-3xl font-bold font-headline">My Applications</h1>
        <p className="text-muted-foreground">Keep track of your job applications all in one place.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({length: 3}).map((_, i) => <ApplicationRowSkeleton key={i} />)}
              {applications?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image src={app.companyLogoUrl} alt={`${app.company} logo`} width={40} height={40} className="rounded-md border" data-ai-hint="company logo" />
                      <div>
                        <div className="font-medium">{app.jobTitle}</div>
                        <div className="text-sm text-muted-foreground">{app.company}</div>
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell>{app.submittedAt ? new Intl.DateTimeFormat('en-US').format(new Date(app.submittedAt as any)) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/jobs/${app.jobId}`} className="text-primary hover:underline text-sm font-medium">View Job</Link>
                  </TableCell>
                </TableRow>
              ))}
               {!loading && applications?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-16">
                        You haven't applied to any jobs yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

