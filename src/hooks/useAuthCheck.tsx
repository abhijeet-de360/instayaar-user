import { useState, useEffect } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const { isLoggedIn, setUserRole, setIsLoggedIn } = useUserRole();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const checkAuth = (callback?: () => void) => {
    if (!isLoggedIn) {
      if (callback) {
        setPendingCallback(() => callback);
      }
      setShowLoginModal(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
    
    // Execute pending callback if it exists
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
      setShowLoginModal(false);
    } else {
      setShowLoginModal(false);
      // Navigate to role-specific home page only if no pending callback
      if (role === 'employer') {
        navigate('/discover');
      } else if (role === 'freelancer') {
        navigate('/browse-jobs');
      }
    }
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPendingCallback(null);
  };

  return {
    isLoggedIn,
    isMobile,
    showLoginModal,
    setShowLoginModal: handleModalClose,
    checkAuth,
    handleLogin
  };
};