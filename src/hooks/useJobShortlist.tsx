import { useState, useEffect } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { recentJobs } from '@/data/staticData';

export const useJobShortlist = () => {
  const { userRole, userId, isLoggedIn } = useUserRole();
  const [shortlistedJobIds, setShortlistedJobIds] = useState<number[]>([]);

  // Load shortlisted job IDs from localStorage on mount
  useEffect(() => {
    if (isLoggedIn && userRole === 'freelancer' && userId) {
      const storageKey = `job_shortlist_freelancer_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          setShortlistedJobIds(Array.isArray(ids) ? ids : []);
        } catch {
          setShortlistedJobIds([]);
        }
      }
    } else {
      setShortlistedJobIds([]);
    }
  }, [isLoggedIn, userRole, userId]);

  // Save to localStorage whenever shortlistedJobIds changes
  useEffect(() => {
    if (isLoggedIn && userRole === 'freelancer' && userId) {
      const storageKey = `job_shortlist_freelancer_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(shortlistedJobIds));
    }
  }, [shortlistedJobIds, isLoggedIn, userRole, userId]);

  const addJobToShortlist = (jobId: number) => {
    if (!isLoggedIn || userRole !== 'freelancer') return false;
    
    setShortlistedJobIds(prev => {
      if (prev.includes(jobId)) return prev;
      return [...prev, jobId];
    });
    return true;
  };

  const removeJobFromShortlist = (jobId: number) => {
    setShortlistedJobIds(prev => prev.filter(id => id !== jobId));
  };

  const isJobShortlisted = (jobId: number) => {
    return shortlistedJobIds.includes(jobId);
  };

  const getShortlistedJobs = () => {
    return recentJobs.filter(job => 
      shortlistedJobIds.includes(job.id)
    );
  };

  const toggleJobShortlist = (jobId: number) => {
    if (!isLoggedIn || userRole !== 'freelancer') return false;
    
    if (isJobShortlisted(jobId)) {
      removeJobFromShortlist(jobId);
    } else {
      addJobToShortlist(jobId);
    }
    return true;
  };

  return {
    shortlistedJobIds,
    addJobToShortlist,
    removeJobFromShortlist,
    isJobShortlisted,
    getShortlistedJobs,
    toggleJobShortlist,
    shortlistCount: shortlistedJobIds.length
  };
};