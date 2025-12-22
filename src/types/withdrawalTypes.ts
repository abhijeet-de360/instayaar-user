export interface WithdrawalData {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerEmail: string;
  freelancerPhone: string;
  amount: number;
  availableBalance: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentMethod: 'bank_transfer' | 'upi' | 'wallet';
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  upiDetails?: {
    upiId: string;
    upiName: string;
  };
  walletDetails?: {
    walletType: string;
    walletId: string;
  };
  processedDate?: string;
  processedBy?: string;
  rejectionReason?: string;
  transactionId?: string;
  adminNotes?: string;
  earnings: {
    totalEarned: number;
    platformFees: number;
    previousWithdrawals: number;
    taxDeductions: number;
    netAmount: number;
  };
}