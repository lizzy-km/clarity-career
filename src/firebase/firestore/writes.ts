
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, Firestore, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Job, UserProfile } from '@/lib/types';
import type { ReviewFormData } from '@/components/forms/review-form';
import type { InterviewFormData } from '@/components/forms/interview-form';
import type { SalaryFormData } from '@/app/(main)/salaries/page';
import type { CompanyFormData } from '@/components/forms/company-form';
import type { JobFormData } from '@/components/forms/job-form';
import type { ApplicationFormData } from '@/components/forms/application-form';


export async function addReview(db: Firestore, user: UserProfile, data: ReviewFormData) {
    const companySnap = await getDoc(doc(db, 'companies', data.companyId));
    if (!companySnap.exists()) {
        throw new Error("Company not found");
    }
    const companyData = companySnap.data();

    const reviewRef = collection(db, 'reviews');
    addDoc(reviewRef, {
        ...data,
        company: companyData.name,
        rating: Number(data.rating),
        userId: user.uid,
        author: user.displayName,
        createdAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'reviews',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function addInterviewExperience(db: Firestore, user: UserProfile, data: InterviewFormData) {
    const companySnap = await getDoc(doc(db, 'companies', data.companyId));
    if (!companySnap.exists()) {
        throw new Error("Company not found");
    }
    const companyData = companySnap.data();
    
    const interviewRef = collection(db, 'interviews');
    addDoc(interviewRef, {
        ...data,
        company: companyData.name,
        userId: user.uid,
        author: user.displayName,
        createdAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'interviews',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function addSalary(db: Firestore, user: UserProfile | null, data: SalaryFormData) {
    const salaryRef = collection(db, 'salaries');

    const companySnap = await getDoc(doc(db, 'companies', data.companyId));
    if (!companySnap.exists()) {
        throw new Error("Company not found");
    }
    const companyData = companySnap.data();

    addDoc(salaryRef, {
        ...data,
        salary: Number(data.salary),
        yearsOfExperience: Number(data.yearsOfExperience),
        userId: user?.uid, // Can be anonymous
        submittedAt: serverTimestamp(),
        company: companyData?.name,
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'salaries',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function submitApplication(db: Firestore, user: UserProfile, job: Job, applicationData: ApplicationFormData) {
    const applicationRef = collection(db, 'applications');
    addDoc(applicationRef, {
        // Job info
        jobId: job.id,
        companyId: job.companyId,
        jobTitle: job.title,
        company: job.company,
        companyLogoUrl: job.companyLogoUrl,
        // Applicant Info
        applicantId: user.uid,
        applicantName: applicationData.name,
        applicantEmail: applicationData.email,
        applicantPhone: applicationData.phone,
        applicantPortfolio: applicationData.portfolioUrl,
        coverLetter: applicationData.coverLetter,
        // resumeUrl: applicationData.resumeUrl, // Add when file upload is ready
        // Status
        status: 'Applied',
        submittedAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: applicationRef.path,
            operation: 'create',
            requestResourceData: applicationData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}


export function updateApplicationStatus(db: Firestore, applicationId: string, status: string) {
  const applicationRef = doc(db, 'applications', applicationId);
  const dataToUpdate = { status };

  updateDoc(applicationRef, dataToUpdate)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: applicationRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function addCompany(db: Firestore, user: UserProfile, data: CompanyFormData) {
    const companyRef = collection(db, 'companies');
    addDoc(companyRef, {
        ...data,
        ownerId: user.uid,
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'companies',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function addJob(db: Firestore, user: UserProfile, data: JobFormData) {
    const companySnap = await getDoc(doc(db, 'companies', data.companyId));
    if (!companySnap.exists()) {
        throw new Error("Company not found");
    }
    const companyData = companySnap.data();

    // Security check: ensure the user owns the company
    if (companyData.ownerId !== user.uid) {
        const permissionError = new FirestorePermissionError({
            path: 'jobs',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        return;
    }


    const jobRef = collection(db, 'jobs');
    addDoc(jobRef, {
        title: data.title,
        companyId: data.companyId,
        location: data.location,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        industry: data.industry,
        description: data.description,
        company: companyData?.name,
        companyLogoUrl: companyData?.logoUrl,
        postedAt: serverTimestamp(),
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'jobs',
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateUserProfile(db: Firestore, userId: string, data: Partial<UserProfile>) {
  const profileRef = doc(db, 'users', userId);
  updateDoc(profileRef, data)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: profileRef.path,
            operation: 'update',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

