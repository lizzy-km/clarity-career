'use client';
import { useCollection } from '@/firebase';
import type { CompanyReview } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}


function ReviewCard({ review }: { review: CompanyReview }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{review.company}</CardTitle>
                <CardDescription className="font-medium">{review.title}</CardDescription>
            </div>
            <StarRating rating={review.rating} />
        </div>
        <p className="text-xs text-muted-foreground pt-2">By {review.author} on {new Intl.DateTimeFormat('en-US').format(review.createdAt)}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <h4 className="font-semibold text-green-600">Pros</h4>
            <p className="text-sm text-muted-foreground">{review.pros}</p>
        </div>
        <div>
            <h4 className="font-semibold text-red-600">Cons</h4>
            <p className="text-sm text-muted-foreground">{review.cons}</p>
        </div>
        <div>
            <h4 className="font-semibold">Culture Insight</h4>
            <p className="text-sm text-muted-foreground">{review.cultureInsight}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Skeleton className="h-5 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div>
                    <Skeleton className="h-5 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function ReviewsPage() {
  const { data: reviews, loading } = useCollection<CompanyReview>('reviews');
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline mb-2">Company Reviews</h1>
          <p className="text-lg text-muted-foreground">Get the real story from people on the inside.</p>
        </div>
        <Button>Write a Review</Button>
      </div>

      <div className="space-y-6">
        {loading && <> <ReviewCardSkeleton/> <ReviewCardSkeleton/> </>}
        {reviews?.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
