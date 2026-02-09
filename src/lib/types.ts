
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'employee' | 'employer';
  phone?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: string[];
  savedJobs?: string[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Company {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
    description?: string;
    ownerId?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  industry: string;
  description: string;
  postedAt: Date;
  companyLogoUrl: string;
}

export interface CompanyReview {
  id: string;
  company: string;
  companyId?: string;
  author: string;
  userId?: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  cultureInsight: string;
  createdAt: Date;
}

export interface SalaryData {
  id: string;
  jobTitle: string;
  location: string;
  salary: number;
  yearsOfExperience: number;
  submittedAt: Date;
  userId?: string;
  company?: string;
  companyId?: string;
}

export interface InterviewExperience {
  id: string;
  company: string;
  companyId?: string;
  jobTitle: string;
  author: string;
  userId?: string;
  difficulty: 'Easy' | 'Average' | 'Difficult';
  questions: string;
  experience: string;
  createdAt: Date;
}

export interface Application {
  id: string;
  jobId: string;
  companyId: string;
  applicantId: string;
  status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  submittedAt: Date;
  // Denormalized job data
  jobTitle: string;
  company: string;
  companyLogoUrl: string;
  // Applicant data snapshot
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantPortfolio?: string;
  coverLetter?: string;
  resumeUrl?: string;
}
