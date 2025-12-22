export interface JobApplication {
  id: string;
  jobId: number;
  freelancerId: string;
  freelancerName: string;
  bidAmount: number;
  proposal: string;
  estimatedDays: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  appliedTime: string;
  freelancerRating?: number;
  freelancerCompletedJobs?: number;
}

export interface Job {
  id: number;
  title: string;
  category: string;
  budget: string;
  location: string;
  timePosted: string;
  applicants: number;
  description: string;
}