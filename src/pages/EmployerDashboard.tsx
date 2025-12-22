import { EmployerDashboard } from "@/components/dashboard/EmployerDashboard";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";

const EmployerDashboardPage = () => {


  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={null} />
      
      <div className="pb-20 md:pb-0">
        <EmployerDashboard />
      </div>
      
      <MobileBottomNav />
    </div>
  );
};

export default EmployerDashboardPage;