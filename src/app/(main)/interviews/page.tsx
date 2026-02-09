import { placeholderInterviews } from '@/lib/placeholder-data';
import type { InterviewExperience } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
                <CardDescription>Shared by {interview.author} on {new Intl.DateTimeFormat('en-US').format(interview.createdAt)}</CardDescription>
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

export default function InterviewsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline mb-2">Interview Experiences</h1>
          <p className="text-lg text-muted-foreground">Prepare for your next interview with these real-life accounts.</p>
        </div>
        <Button>Share Your Experience</Button>
      </div>

      <div className="space-y-6">
        {placeholderInterviews.map(interview => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </div>
  );
}
