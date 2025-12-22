export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'pending';
  requestedBy?: {
    id: string;
    name: string;
    type: 'employer' | 'freelancer';
  };
  createdAt: string;
  updatedAt: string;
  totalServices: number;
  totalJobs: number;
  adminNotes?: string;
}

export interface CategoryFilters {
  status: string;
  requestType: string;
  search: string;
}