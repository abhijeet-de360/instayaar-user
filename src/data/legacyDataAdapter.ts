// Legacy data adapter for compatibility with existing components
import freelancerData from './freelancerData.json';
import type { FreelancerData } from '@/types/freelancerTypes';

const data = freelancerData as FreelancerData;

// Export in legacy format for components that haven't been updated yet
export const serviceCategories = data.serviceCategories;
export const recentJobs = data.recentJobs;
export const testimonials = data.testimonials;

// Create legacy serviceFreelancers object grouped by service name
export const serviceFreelancers = data.freelancers.reduce((acc, freelancer) => {
  // Handle both primaryService and service field names for compatibility
  const serviceName = freelancer.primaryService || (freelancer as any).service;
  
  if (!acc[serviceName]) {
    acc[serviceName] = [];
  }
  
  // Add price property for backward compatibility
  const freelancerWithPrice = {
    ...freelancer,
    service: serviceName,
    primaryService: serviceName,
    price: '₹500/hr' // Default price for backward compatibility
  };
  acc[serviceName].push(freelancerWithPrice);
  return acc;
}, {} as Record<string, any[]>);

// Export services in legacy format
export const mockFreelancerServices = data.services;