
'use client'

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export default function PostedJobsPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    if (!loading && user?.role !== 'employer') {
        router.push('/dashboard');
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline">Posted Jobs</h1>
            <p className="text-muted-foreground">View and manage your company's job listings.</p>
            {/* Job listing and management UI will go here */}
            <div className="mt-8 text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>Job management interface coming soon!</p>
            </div>
        </div>
    )
}

