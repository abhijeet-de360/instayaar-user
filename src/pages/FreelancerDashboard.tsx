import { useEffect, useState } from "react";
import { FreelancerDashboard } from "@/components/dashboard/FreelancerDashboard";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import MobileFreelancerDashboard from "@/components/mobile/MobileFreelancerDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const FreelancerDashboardPage = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const authVar = useSelector((state: RootState) => state?.auth)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Use mobile component on small screens
  if (isMobile) {
    return <MobileFreelancerDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      <FreelancerDashboard />
      <MobileBottomNav />
    </div>
  );
};

export default FreelancerDashboardPage;