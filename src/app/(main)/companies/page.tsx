
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useUser, useFirestore } from '@/firebase';
import type { Company, UserProfile } from '@/lib/types';
import { addCompany } from '@/firebase/firestore/writes';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CompanyForm, CompanyFormData } from '@/components/forms/company-form';
import { Globe } from 'lucide-react';

function CompanyCard({ company }: { company: Company }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <Image src={company.logoUrl} alt={`${company.name} logo`} width={50} height={50} className="rounded-lg border" data-ai-hint="company logo" />
        <div>
          <CardTitle>{company.name}</CardTitle>
          {company.website && (
            <Link href={company.website} target="_blank" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <Globe className="h-3 w-3" />
                {company.website}
            </Link>
          )}
        </div>
      </CardHeader>
      {company.description && (
        <CardContent>
            <CardDescription>{company.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
}

function CompanyCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4">
                <Skeleton className="h-[50px] w-[50px] rounded-lg" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
            </CardContent>
        </Card>
    );
}

export default function CompaniesPage() {
  const { data: companies, loading } = useCollection<Company>('companies');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);

  const handleCompanySubmit = (data: CompanyFormData) => {
    if (!user) return;
    addCompany(firestore, user as UserProfile, data);
    toast({
      title: "Success!",
      description: "The company has been added.",
    });
    setFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline mb-2">Companies</h1>
          <p className="text-lg text-muted-foreground">Browse companies and see what they're about.</p>
        </div>
        {user?.role === 'employer' && (
          <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                  <Button>Add a Company</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                      <DialogTitle>Add a Company</DialogTitle>
                      <DialogDescription>Add a new company profile to our database.</DialogDescription>
                  </DialogHeader>
                  <CompanyForm onSubmit={handleCompanySubmit} />
              </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)}
        {companies?.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
