import { NavLink } from "react-router-dom";
import { Home, Search, FileText, Calendar, MessageCircle, User, Target, Wrench, Zap, DollarSign, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import { Capacitor } from "@capacitor/core";

interface MobileBottomNavProps {
  onProfileClick?: () => void;
}

// Navigation items for employers/service seekers
const employerNavItems = [
  { name: 'Discover', href: '/discover', icon: Search },
  { name: 'My Posts', href: '/my-posts', icon: FileText },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Chat', href: '/messages', icon: MessageCircle },
  { name: 'Dashboard', href: '/employer-dashboard', icon: User },
];

// Navigation items for freelancers/service providers
const freelancerNavItems = [
  { name: 'Browse', href: '/browse-jobs', icon: Target },
  { name: 'Services', href: '/my-services', icon: Wrench },
  { name: 'Jobs', href: '/my-jobs', icon: Zap },
  { name: 'Chat', href: '/messages', icon: MessageCircle },
  { name: 'Dashboard', href: '/freelancer-dashboard', icon: LayoutDashboard, },
];

// Default navigation for guests
const guestNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Yaars', href: '/discover', icon: Search },
  { name: 'Post', href: '/browse-jobs', icon: FileText, requiresAuth: true },
  { name: 'Chat', href: '/messages', icon: MessageCircle, requiresAuth: true },
  { name: 'Login', href: '#', icon: User, requiresAuth: true, isLoginButton: true },
];

export const MobileBottomNav = ({ onProfileClick }: MobileBottomNavProps) => {
  const authVar = useSelector((state: RootState) => state?.auth)

  // Get navigation items based on user role
  const getNavItems = () => {
    if (authVar?.isAuthenticated === false) return guestNavItems;
    if (localService.get('role') === 'user') return employerNavItems;
    if (localService.get('role') === 'freelancer') return freelancerNavItems;
    return guestNavItems;
  };

  const navItems = getNavItems();

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.requiresAuth && !authVar.isAuthenticated) {
      e.preventDefault();
      onProfileClick?.();
    }
    if ((item as any).isLoginButton) {
      e.preventDefault();
      onProfileClick?.();
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40"
      style={{
        paddingBottom: Capacitor.getPlatform() === "ios"
          ? "calc(10px + env(safe-area-inset-bottom))"
          : "",
      }}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={(e) => handleNavClick(item, e)}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center h-full px-2 py-1 text-xs transition-colors",
                isActive && !item.requiresAuth
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
