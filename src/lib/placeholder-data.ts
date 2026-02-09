// This file is now deprecated as we are using live data from Firebase.
// It is kept for reference but can be deleted.

import type { Job, CompanyReview, SalaryData, InterviewExperience } from './types';

export const placeholderJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Innovate Inc.',
    location: 'San Francisco, CA',
    salaryMin: 120000,
    salaryMax: 160000,
    industry: 'Technology',
    description: 'Join our team to build the next generation of web applications using React and Next.js. We are looking for a passionate developer with a keen eye for design and performance.',
    postedAt: new Date('2024-07-20T10:00:00Z'),
    companyLogoUrl: 'https://picsum.photos/seed/logo1/100/100',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Solutions Co.',
    location: 'New York, NY',
    salaryMin: 110000,
    salaryMax: 150000,
    industry: 'Software',
    description: 'We are seeking an experienced Product Manager to guide the success of our flagship product and lead the cross-functional team that is responsible for improving it.',
    postedAt: new Date('2024-07-19T14:30:00Z'),
    companyLogoUrl: 'https://picsum.photos/seed/logo2/100/100',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Creative Minds',
    location: 'Remote',
    salaryMin: 90000,
    salaryMax: 120000,
    industry: 'Design',
    description: 'Design beautiful and intuitive user experiences for our mobile and web platforms. A strong portfolio of successful UX/UI design projects is essential.',
    postedAt: new Date('2024-07-18T09:00:00Z'),
    companyLogoUrl: 'https://picsum.photos/seed/logo3/100/100',
  },
    {
    id: '4',
    title: 'Backend Engineer (Go)',
    company: 'DataStream',
    location: 'Austin, TX',
    salaryMin: 130000,
    salaryMax: 170000,
    industry: 'Big Data',
    description: 'Develop and maintain scalable backend services and APIs using Go. Experience with cloud platforms like AWS or GCP is a plus.',
    postedAt: new Date('2024-07-17T11:00:00Z'),
    companyLogoUrl: 'https://picsum.photos/seed/logo4/100/100',
  },
];

export const placeholderReviews: CompanyReview[] = [
  {
    id: '1',
    company: 'Innovate Inc.',
    author: 'Current Employee',
    rating: 4.5,
    title: 'Great place to grow',
    pros: 'Amazing team, challenging projects, and great work-life balance. Management is very supportive.',
    cons: 'Compensation could be more competitive with top-tier companies in the bay area.',
    cultureInsight: 'Very collaborative and transparent culture. Everyone is willing to help.',
    createdAt: new Date('2024-06-15T00:00:00Z'),
  },
  {
    id: '2',
    company: 'Solutions Co.',
    author: 'Former Employee',
    rating: 3,
    title: 'Fast-paced environment',
    pros: 'You learn a lot in a short amount of time. Good benefits package.',
    cons: 'High-pressure environment, can lead to burnout. Bureaucracy can slow down decision making.',
    cultureInsight: 'Results-driven culture. Less focus on personal development.',
    createdAt: new Date('2024-05-20T00:00:00Z'),
  },
];

export const placeholderSalaries: SalaryData[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    salary: 145000,
    yearsOfExperience: 5,
    submittedAt: new Date('2024-06-01T00:00:00Z'),
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    location: 'New York, NY',
    salary: 130000,
    yearsOfExperience: 4,
    submittedAt: new Date('2024-05-10T00:00:00Z'),
  },
  {
    id: '3',
    jobTitle: 'UX/UI Designer',
    location: 'Remote',
    salary: 105000,
    yearsOfExperience: 3,
    submittedAt: new Date('2024-04-25T00:00:00Z'),
  },
];

export const placeholderInterviews: InterviewExperience[] = [
  {
    id: '1',
    company: 'Innovate Inc.',
    jobTitle: 'Senior Frontend Developer',
    author: 'Anonymous',
    difficulty: 'Average',
    questions: 'Standard technical questions on React hooks, state management, and a small take-home project.',
    experience: 'The process was smooth. Three rounds: HR screen, technical interview with a senior dev, and a final interview with the team lead. Everyone was friendly and the feedback was constructive.',
    createdAt: new Date('2024-05-30T00:00:00Z'),
  },
  {
    id: '2',
    company: 'Solutions Co.',
    jobTitle: 'Product Manager',
    author: 'Anonymous',
    difficulty: 'Difficult',
    questions: 'Several case studies on market entry, feature prioritization, and root cause analysis. Also a presentation round.',
    experience: 'Very demanding interview process with 5 rounds. The case studies were challenging but relevant. Be prepared to think on your feet and defend your decisions.',
    createdAt: new Date('2024-04-15T00:00:00Z'),
  },
];
