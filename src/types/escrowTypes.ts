
export interface EscrowAccount {
  id: string;
  bookingId: string;
  freelancerId: string;
  employerId: string;
  totalBookingAmount: number;
  platformAmount: number; // Amount held by platform (30% or 100%)
  directAmount: number; // Amount to be paid directly (70% or 0%)
  escrowStatus: 'holding' | 'released' | 'disputed' | 'partial_release';
  commissionAmount: number;
  gstOnCommission: number;
  netPayoutAmount: number;
  releaseConditions: {
    requiresOTP: boolean;
    requiresRating: boolean;
    requiresAdminApproval: boolean;
    directPaymentConfirmed: boolean;
  };
  createdAt: string;
  releasedAt?: string;
  releaseNotes?: string;
}

export interface PayoutCalculation {
  bookingId: string;
  totalBookingAmount: number;
  platformAmount: number;
  commissionRate: number;
  commissionAmount: number;
  gstRate: number;
  gstAmount: number;
  totalDeductions: number;
  netPayout: number;
  paymentMethod: 'full_platform' | 'split_platform';
  breakdown: {
    platformHeld: number;
    commissionDeducted: number;
    gstDeducted: number;
    finalPayout: number;
  };
}
