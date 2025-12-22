// Compatibility layer - redirects to new types and data
export type {
  ServiceBooking,
  FreelancerService,
  WalletTransaction,
  WithdrawalRequest
} from '@/types/freelancerTypes';

export { mockFreelancerServices } from './legacyDataAdapter';