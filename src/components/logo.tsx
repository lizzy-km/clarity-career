import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold text-primary", className)}>
      <Briefcase className="h-6 w-6" />
      <span className="font-headline">ClarityCareer</span>
    </Link>
  );
}
