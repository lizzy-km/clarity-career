import { placeholderJobs } from '@/lib/placeholder-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

type TrackedApplication = {
  id: string;
  jobTitle: string;
  company: string;
  companyLogoUrl: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  date: string;
};

const trackedApplications: TrackedApplication[] = [
  { ...placeholderJobs[0], status: 'Interviewing', date: '2024-07-22' },
  { ...placeholderJobs[2], status: 'Applied', date: '2024-07-20' },
  { ...placeholderJobs[1], status: 'Saved', date: '2024-07-19' },
];

const statusStyles = {
    'Saved': 'default',
    'Applied': 'secondary',
    'Interviewing': 'default',
    'Offered': 'default',
    'Rejected': 'destructive',
} as const;

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
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
                <TableHead>Date Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackedApplications.map((app) => (
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
                     <Select defaultValue={app.status}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Saved"><Badge variant={statusStyles['Saved']}>Saved</Badge></SelectItem>
                            <SelectItem value="Applied"><Badge variant={statusStyles['Applied']}>Applied</Badge></SelectItem>
                            <SelectItem value="Interviewing"><Badge variant={statusStyles['Interviewing']}>Interviewing</Badge></SelectItem>
                            <SelectItem value="Offered"><Badge className="bg-green-500 hover:bg-green-600">Offered</Badge></SelectItem>
                            <SelectItem value="Rejected"><Badge variant={statusStyles['Rejected']}>Rejected</Badge></SelectItem>
                        </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell className="text-right">
                    <Link href="#" className="text-primary hover:underline text-sm font-medium">View Job</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
