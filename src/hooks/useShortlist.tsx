import { useState, useEffect } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import freelancerData from '@/data/freelancerData.json';

export const useShortlist = () => {
  const { userRole, userId, isLoggedIn } = useUserRole();
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);

  // Load shortlisted IDs from localStorage on mount
  useEffect(() => {
    if (isLoggedIn && userRole && userId) {
      const storageKey = `shortlist_${userRole}_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          setShortlistedIds(Array.isArray(ids) ? ids : []);
        } catch {
          setShortlistedIds([]);
        }
      }
    } else {
      setShortlistedIds([]);
    }
  }, [isLoggedIn, userRole, userId]);

  // Save to localStorage whenever shortlistedIds changes
  useEffect(() => {
    if (isLoggedIn && userRole && userId) {
      const storageKey = `shortlist_${userRole}_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(shortlistedIds));
    }
  }, [shortlistedIds, isLoggedIn, userRole, userId]);

  const addToShortlist = (freelancerId: number) => {
    if (!isLoggedIn || userRole !== 'employer') return false;
    
    setShortlistedIds(prev => {
      if (prev.includes(freelancerId)) return prev;
      return [...prev, freelancerId];
    });
    return true;
  };

  const removeFromShortlist = (freelancerId: number) => {
    setShortlistedIds(prev => prev.filter(id => id !== freelancerId));
  };

  const isShortlisted = (freelancerId: number) => {
    return shortlistedIds.includes(freelancerId);
  };

  const getShortlistedFreelancers = () => {
    return freelancerData.freelancers.filter(freelancer => 
      shortlistedIds.includes(freelancer.id)
    );
  };

  const toggleShortlist = (freelancerId: number) => {
    if (!isLoggedIn || userRole !== 'employer') return false;
    
    if (isShortlisted(freelancerId)) {
      removeFromShortlist(freelancerId);
    } else {
      addToShortlist(freelancerId);
    }
    return true;
  };

  return {
    shortlistedIds,
    addToShortlist,
    removeFromShortlist,
    isShortlisted,
    getShortlistedFreelancers,
    toggleShortlist,
    shortlistCount: shortlistedIds.length
  };
};