import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';

export const useRoleBasedNavigation = () => {
  const navigate = useNavigate();
  const { userRole, isLoggedIn } = useUserRole();

  const getHomePage = () => {
    if (!isLoggedIn) return '/';
    if (userRole === 'employer') return '/discover';
    if (userRole === 'freelancer') return '/browse-jobs';
    return '/';
  };

  const navigateToHome = () => {
    const homePage = getHomePage();
    navigate(homePage);
  };

  const getHomePageName = () => {
    if (!isLoggedIn) return 'Home';
    if (userRole === 'employer') return 'Discover';
    if (userRole === 'freelancer') return 'Browse';
    return 'Home';
  };

  return {
    getHomePage,
    navigateToHome,
    getHomePageName
  };
};