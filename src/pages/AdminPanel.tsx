import React, { useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { EmployerManagement } from '@/components/admin/EmployerManagement';
import { FreelancerManagement } from '@/components/admin/FreelancerManagement';
import { JobManagement } from '@/components/admin/JobManagement';
import { ServiceManagement } from '@/components/admin/ServiceManagement';
import { BookingManagement } from '@/components/admin/BookingManagement';
import { PaymentManagement } from '@/components/admin/PaymentManagement';
import { WithdrawalManagement } from '@/components/admin/WithdrawalManagement';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { MessageManagement } from '@/components/admin/MessageManagement';
import { DisputeManagement } from '@/components/admin/DisputeManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsManagement } from '@/components/admin/AnalyticsManagement';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  
  // Get tab from URL parameter or default to 'dashboard'
  const urlParams = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'dashboard');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleLogin = (credentials: { username: string; password: string }) => {   
    // Simple auth check - accept admin/admin123 OR admin/admin
    if (
      (credentials.username === 'admin' && credentials.password === 'admin123') ||
      (credentials.username === 'admin' && credentials.password === 'admin')
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome to Admin Panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use admin/admin123 or admin/admin",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setActiveTab('dashboard');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'employer':
        return <EmployerManagement />;
      case 'freelancer':
        return <FreelancerManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'withdrawals':
        return <WithdrawalManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'disputes':
        return <DisputeManagement />;
      case 'analytics':
        return <AnalyticsManagement />;
      case 'messages':
        return <MessageManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (isMobile) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-primary shadow-sm border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary-foreground">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full bg-primary" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1 overflow-auto p-4">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
