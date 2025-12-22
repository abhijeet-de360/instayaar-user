// TypeScript interfaces for freelancer data structure

export interface ServiceCategory {
  id: number;
  name: string;
  icon: string;
  popular: boolean;
  image: string;
}

export interface Freelancer {
  _id: string;
  categoryId: any;
  freelancerId: any;
  averageRating: number;
  totalReview: number;
  lat: any;
  lon: any;
  images: any;
  id: number;
  name: string;
  primaryService?: string;
  service?: string;
  rating: number;
  reviews: number;
  location: string;
  image?: string; // Make image optional since some freelancers don't have it
  servicesOffered?: string[];
  price?: string;
}

export interface FreelancerService {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  duration: string;
  images: string[];
  location: string;
  availability: string[];
  skills: string[];
  rating: number;
  completedJobs: number;
  isActive: boolean;
}

export interface RecentJob {
  id: number;
  title: string;
  category: string;
  budget: string;
  location: string;
  timePosted: string;
  applicants: number;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  service: string;
  text: string;
  rating: number;
  location: string;
}

export interface FreelancerData {
  serviceCategories: ServiceCategory[];
  freelancers: Freelancer[];
  services: FreelancerService[];
  recentJobs: RecentJob[];
  testimonials: Testimonial[];
}

// Legacy interfaces for compatibility
export interface ServiceBooking {
  id: string;
  serviceName: string;
  freelancerId: string;
  freelancerName: string;
  freelancerImage: string;
  employerId: string;
  employerName: string;
  basePrice: number;
  platformCommission: number;
  tax: number;
  totalAmount: number;
  advancePayment: number;
  remainingPayment: number;
  status: 'pending' | 'advance_paid' | 'full_paid' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'advance_paid' | 'full_paid';
  bookingDate: string;
  serviceDate: string;
  location: string;
  startOtp?: string;
  endOtp?: string;
  rating?: number;
  review?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'pending';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  bookingId?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}