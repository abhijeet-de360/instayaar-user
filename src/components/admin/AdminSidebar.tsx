import React from 'react';
import { 
  LayoutDashboard, Users, Briefcase, CreditCard, ShoppingBag, 
  AlertTriangle, Settings, Tags, MessageCircle, BarChart3, LogOut, Wrench, 
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isCollapsed = false
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employer', label: 'Employer', icon: Users },
    { id: 'freelancer', label: 'Freelancer', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'bookings', label: 'Bookings', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-primary text-primary-foreground h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-primary-foreground/20">
        <h2 className={cn(
          "font-bold text-xl text-center",
          isCollapsed && "text-sm"
        )}>
          {isCollapsed ? "AP" : "Admin Panel"}
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
              activeTab === item.id 
                ? "bg-primary-foreground text-primary" 
                : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-foreground/20">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};