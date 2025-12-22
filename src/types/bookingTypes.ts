export interface PaymentDetails {
  totalAmount: number;
  advanceAmount?: number;
  remainingAmount?: number;
  paymentMethod: 'platform' | 'advance' | 'cash';
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid';
  platformFee?: number;
  freelancerEarning?: number;
}

export interface OTPDetails {
  startOTP?: string;
  endOTP?: string;
  otpGenerated?: boolean;
}

export interface BookingData {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  freelancerId: string;
  freelancerName: string;
  freelancerImage?: string;
  employerId: string;
  employerName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  requirements?: string;
  payment: PaymentDetails;
  otp: OTPDetails;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rating?: {
    score: number;
    review: string;
    ratedAt: string;
  };
}

export interface WalletEarning {
  bookingId: string;
  amount: number;
  status: 'pending' | 'available' | 'withdrawn';
  earnedAt: string;
  description: string;
}