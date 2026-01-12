import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  User,
  Plus,
  FileText,
  Calendar,
  Heart,
  CreditCard,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Target,
  Briefcase,
  Image as ImageIcon,
  Shield,
  Calendar1,
  User2Icon,
  Zap,
} from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import { setAuth } from "@/store/authSlice";

export const MobileDashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const authVar = useSelector((state: RootState) => state.auth);
  const handleLogout = () => {
    localService.clearAll();
    setIsOpen(false);
    navigate("/");
    dispatch(setAuth(false));
  };

  const getMenuItems = () => {
    if (localService.get("role") === "user") {
      return [
        // { icon: Heart, label: 'My Shortlist', href: '/shortlist-freelancers' },
        {
          icon: CreditCard,
          label: "Payment History",
          href: "/payment-history",
        },
        // { icon: Star, label: 'Reviews & Ratings', href: '/reviews-ratings' },
        { icon: User2Icon, label: "Profile", href: "/user-account-settings" },
        { icon: Zap, label: "Instant Booking", href: "/instant-booking" },
        { icon: HelpCircle, label: "Help & Support", href: "/help-support" },
      ];
    } else if (localService.get("role") === "freelancer") {
      return [
        // { icon: User, label: 'Dashboard', href: '/freelancer-dashboard' },
        // { icon: Target, label: 'My Services', href: '/my-services' },
        // { icon: ImageIcon, label: 'Portfolio Gallery', href: '/portfolio-gallery' },
        // { icon: FileText, label: 'Applied Jobs', href: '/applied-jobs' },
        // { icon: Briefcase, label: 'Active Jobs', href: '/my-jobs' },
        // { icon: Heart, label: 'My Shortlist', href: '/shortlist-jobs' },
        { icon: Shield, label: "My Earnings", href: "/earnings" },
        { icon: CreditCard, label: "Payouts", href: "/wallet" },
        {
          icon: Star,
          label: "Reviews & Ratings",
          href: `/freelancer-reviews/${authVar?.freelancer?._id}`,
        },
        { icon: User2Icon, label: "Profile", href: "/account-settings" },
        { icon: Calendar1, label: "Blocked Dates", href: "/offday" },
        { icon: Zap, label: "Instant Booking", href: "/instant-booking" },
        { icon: HelpCircle, label: "Help & Support", href: "/help-support" },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  if (!authVar.isAuthenticated) {
    return null;
  }


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="text-left">
          <Link
            to={
              localService.get("role") === "user"
                ? "/user-account-settings"
                : "/account-settings"
            }
            className="flex items-center gap-3 pb-4"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  localService.get("role") === "user"
                    ? authVar?.user?.profile
                    : authVar?.freelancer?.profile
                }
                alt="Profile"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {localService.get("role") === "user" ? "U" : "F"}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-lg">
                {localService.get("role") === "user"
                  ? authVar?.user?.firstName || "Guest"
                  : authVar?.freelancer?.firstName || "Guest"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                {localService.get("role") === "user"
                  ? authVar?.user?.email || "No email"
                  : authVar?.freelancer?.email || "No email"}
              </p>
            </div>
          </Link>
        </SheetHeader>

        <div className="space-y-2 mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={(e) => {
                if (localService.get("role") === "user") {
                  if (item.href === "/instant-booking" && authVar.user.status !== 'active') {
                    e.preventDefault();
                    setIsOpen(false);
                    navigate("/user-account-settings");
                    return;
                  }
                }

                if(localService.get('role') === 'freelancer'){
                  if (item.href === "/offday" && authVar.freelancer.status !== 'active') {
                    e.preventDefault();
                    setIsOpen(false);
                    navigate("/account-settings");
                    return;
                  }
                }

                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-gradient-to-br to-primary from-secondary-foreground text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-3 py-3 text-sm font-medium"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
