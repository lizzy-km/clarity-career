
'use client';

import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Company } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Pen, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            </CardContent>
        </Card>
    );
}

export default function MyCompaniesPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const firestore = useFirestore();

    const companiesQuery = user ? query(
        collection(firestore, 'companies'),
        where('ownerId', '==', user.uid)
    ) : null;

    const { data: companies, loading: companiesLoading } = useCollection<Company>('companies', companiesQuery);

    if (!userLoading && user?.role !== 'employer') {
        router.push('/dashboard');
        return null;
    }
    
    const loading = userLoading || companiesLoading;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">My Companies</h1>
                    <p className="text-muted-foreground">Manage your company profiles.</p>
                </div>
                <Link href="/companies">
                    <Button>
                        <PlusCircle className="mr-2" />
                        Add Company
                    </Button>
                </Link>
            </div>
            
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CompanyCardSkeleton />
                    <CompanyCardSkeleton />
                </div>
            )}

            {!loading && companies && companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companies.map(company => (
                        <Card key={company.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
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
                                    </div>
                                     <Button variant="ghost" size="icon">
                                        <Pen className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            {company.description && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            ) : !loading && (
                 <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                    <p className="font-semibold">No companies found.</p>
                    <p>Add your first company profile to start posting jobs.</p>
                </div>
            )}
        </div>
    )
}
