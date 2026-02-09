'use client';
import { useState } from 'react';
import { useCollection, useUser } from '@/firebase';
import type { InterviewExperience, UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InterviewForm, InterviewFormData } from '@/components/forms/interview-form';
import { useFirestore } from '@/firebase';
import { addInterviewExperience } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';

function InterviewCard({ interview }: { interview: InterviewExperience }) {
    const getBadgeVariant = (difficulty: 'Easy' | 'Average' | 'Difficult') => {
        switch(difficulty) {
            case 'Easy': return 'default';
            case 'Average': return 'secondary';
            case 'Difficult': return 'destructive';
        }
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{interview.jobTitle} at {interview.company}</CardTitle>
                <CardDescription>Shared by {interview.author} on {new Intl.DateTimeFormat('en-US').format(new Date(interview.createdAt as any))}</CardDescription>
            </div>
            <Badge variant={getBadgeVariant(interview.difficulty)}>{interview.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h4 className="font-semibold">Interview Questions</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interview.questions}</p>
        </div>
        <div>
            <h4 className="font-semibold">Experience Description</h4>
            <p className="text-sm text-muted-foreground">{interview.experience}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InterviewCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-6 w-64 mb-2" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                </div>
                <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function InterviewsPage() {
  const { data: interviews, loading } = useCollection<InterviewExperience>('interviews');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  
  const handleInterviewSubmit = (data: InterviewFormData) => {
    if (!user) return;
    addInterviewExperience(firestore, user as UserProfile, data);
    toast({
      title: "Success!",
      description: "Your interview experience has been shared.",
    });
    setFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline mb-2">Interview Experiences</h1>
          <p className="text-lg text-muted-foreground">Prepare for your next interview with these real-life accounts.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
                <Button disabled={!user}>Share Your Experience</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Share Your Interview Experience</DialogTitle>
                    <DialogDescription>Help others by sharing your interview process.</DialogDescription>
                </DialogHeader>
                <InterviewForm onSubmit={handleInterviewSubmit} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {loading && <> <InterviewCardSkeleton /> <InterviewCardSkeleton /> </>}
        {interviews?.map(interview => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </div>
  );
}
