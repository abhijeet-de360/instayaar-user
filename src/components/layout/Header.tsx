"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LogOut, User, Settings, FileText, Calendar, CreditCard, Star, HelpCircle, Plus, Target, Heart, Image as ImageIcon, Briefcase, } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { MobileDashboardSidebar } from "@/components/mobile/MobileDashboardSidebar";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import { getFreelancerProfile, getUserProfile, setGpsPromptShown, setLogout, } from "@/store/authSlice";
import { getCategories } from "@/store/categorySlice";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { useGeolocated } from "react-geolocated";
import { AppLauncher } from "@capacitor/app-launcher";


export function useUniversalLocation() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsRequired, setGpsRequired] = useState(false);

  const webLocation = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  const dispatch = useDispatch<AppDispatch>();
  const gpsPromptShown = useSelector((state: RootState) => state.auth.gpsPromptShown);

  useEffect(() => {
    const getLocation = async () => {
      if (!Capacitor.isNativePlatform() || gpsPromptShown) return; 

      try {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 7000,
        });

        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch (err) {
        console.warn("Location error:", err);

        // ✅ Only show popup once
        if (!gpsPromptShown) {
          setGpsRequired(true);
          dispatch(setGpsPromptShown(true)); 
        }
      }
    };

    getLocation();
  }, [gpsPromptShown]);

  const openGpsSettings = async () => {
    if (!Capacitor.isNativePlatform()) {
      alert("Please enable location manually in your browser settings.");
      return;
    }

    const platform = Capacitor.getPlatform();
    try {
      if (platform === "android") {
        await AppLauncher.openUrl({ url: "android.settings.LOCATION_SOURCE_SETTINGS" });
      } else if (platform === "ios") {
        await AppLauncher.openUrl({ url: "app-settings:" });
      }
    } catch (err) {
      console.error("Failed to open GPS settings:", err);
      alert("Unable to open settings. Enable GPS manually.");
    }
  };

  return {
    coords:
      coords ||
      (webLocation.coords
        ? { latitude: webLocation.coords.latitude, longitude: webLocation.coords.longitude }
        : null),
    gpsRequired,
    openGpsSettings,
  };
}

export const Header = ({ onLogin, className }: any) => {
  const authVar = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { navigateToHome } = useRoleBasedNavigation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { coords, gpsRequired, openGpsSettings } = useUniversalLocation();
  const [locationName, setLocationName] = useState<string>("Fetching location...");

  useEffect(() => {
    const getLocationName = async () => {
      if (!coords) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
        );
        const data = await res.json();
        if (data?.address) {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;
          const state = data.address.state;
          setLocationName(`${city || "Unknown"}, ${state || ""}`);
        } else {
          setLocationName("Unknown location");
        }
      } catch (err) {
        setLocationName("Unable to fetch");
      }
    };
    getLocationName();
  }, [coords]);

  const getRoleBasedButtonText = () => {
    if (!authVar?.isAuthenticated) return "Login / Sign Up";
    if (localService.get("role") === "user") return "Post a Job";
    if (localService.get("role") === "freelancer") return "Browse Jobs";
    return "Get Started";
  };

  const handleButtonClick = () => {
    if (!authVar?.isAuthenticated) {
      setShowLoginModal(true);
    } else {
      if (localService.get("role") === "user") {
        navigate("/post-job");
      } else {
        navigate("/browse-jobs");
      }
    }
  };

  const handleLogout = () => {
    dispatch(setLogout(navigate));
  };

  const getDropdownItems = () => {
    if (localService.get("role") === "user") {
      return [
        { icon: User, label: "My Dashboard", href: "/employer-dashboard" },
        { icon: Plus, label: "Post a Job", href: "/post-job" },
        { icon: FileText, label: "My Posts", href: "/my-posts" },
        { icon: Calendar, label: "My Bookings", href: "/my-bookings" },
        { icon: Heart, label: "My Shortlist", href: "/shortlist-freelancers" },
        { icon: CreditCard, label: "Payment History", href: "/payment-history" },
        { icon: Star, label: "Reviews & Ratings", href: "/reviews-ratings" },
        { icon: Settings, label: "Account Settings", href: "/user-account-settings" },
        { icon: HelpCircle, label: "Help & Support", href: "/help-support" },
      ];
    } else if (localService.get("role") === "freelancer") {
      return [
        { icon: User, label: "Dashboard", href: "/freelancer-dashboard" },
        { icon: Target, label: "My Services", href: "/my-services" },
        { icon: ImageIcon, label: "Portfolio Gallery", href: "/portfolio-gallery" },
        { icon: FileText, label: "Applied Jobs", href: "/applied-jobs" },
        { icon: Briefcase, label: "Active Jobs", href: "/my-jobs" },
        { icon: Heart, label: "My Shortlist", href: "/shortlist-jobs" },
        { icon: CreditCard, label: "Earnings & Withdrawals", href: "/wallet" },
        { icon: Star, label: "Reviews & Ratings", href: "/freelancer-reviews" },
        { icon: Settings, label: "Account Settings", href: "/account-settings" },
        { icon: HelpCircle, label: "Help & Support", href: "/help-support" },
      ];
    }
    return [];
  };

  useEffect(() => {
    if (authVar?.isAuthenticated && localService.get("role") === "user") {
      dispatch(getUserProfile());
    } else if (authVar?.isAuthenticated && localService.get("role") === "freelancer") {
      dispatch(getFreelancerProfile());
    }
    dispatch(getCategories());
  }, [authVar?.isAuthenticated]);

  return (
    <>
      {/* Mobile Header */}
      {!(
        (!authVar?.isAuthenticated &&
          (window.location.pathname === "/discover" ||
            window.location.pathname === "/browse-jobs")) ||
        window.location.pathname === "/account-settings" ||
        window.location.pathname === "/user-account-settings" ||
        window.location.pathname === "/help-support"
      ) && (
          <header className="md:hidden sticky top-0 z-30 bg-card border-b border-border justify-between flex items-center">
            <div className="flex items-center justify-between px-4 py-2 w-full min-h-12">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm truncate">{locationName}</span>
                </div>
              </div>
              {authVar?.isAuthenticated && <MobileDashboardSidebar />}
            </div>
          </header>
        )}

      {/* Desktop Header */}
      <header className={`hidden md:block sticky top-0 z-30 bg-card border-b border-border ${className ?? ""}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center space-x-6">
              <button onClick={navigateToHome} className="text-xl font-bold text-primary">
                InstaYaar
              </button>
              <div className="flex items-center space-x-2 w-32">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{locationName}</span>
              </div>
            </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {authVar?.isAuthenticated && localService.get("role") === "user" && (
                <>
                  <Link to="/discover" className="text-sm font-medium hover:text-primary transition-colors">
                    Discover
                  </Link>
                  <Link to="/my-posts" className="text-sm font-medium hover:text-primary transition-colors">
                    My Posts
                  </Link>
                  <Link to="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
              {authVar?.isAuthenticated && localService.get("role") === "freelancer" && (
                <>
                  <Link to="/browse-jobs" className="text-sm font-medium hover:text-primary transition-colors">
                    Browse Jobs
                  </Link>
                  <Link to="/my-services" className="text-sm font-medium hover:text-primary transition-colors">
                    My Services
                  </Link>
                  <Link to="/applied-jobs" className="text-sm font-medium hover:text-primary transition-colors">
                    Applied Jobs
                  </Link>
                </>
              )}
            </nav>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search services..." className="pl-10 w-64" />
              </div>

              {authVar && authVar?.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Button onClick={handleButtonClick} variant="outline">
                    {getRoleBasedButtonText()}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/01.png" alt="Profile" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {localService.get("role") === "user"
                              ? authVar?.user?.firstName?.slice(0, 1) || "U"
                              : authVar?.freelancer?.firstName?.slice(0, 1) || "F"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-card border border-border z-50" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {localService.get("role") === "user"
                              ? authVar?.user?.firstName || "Guest"
                              : authVar?.freelancer?.firstName || "Guest"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      {getDropdownItems().map((item, index) => (
                        <DropdownMenuItem key={index} asChild>
                          <Link to={item.href} className="flex items-center cursor-pointer">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button onClick={handleButtonClick}>{getRoleBasedButtonText()}</Button>
              )}
            </div>
          </div>
        </div>
      </header>

    
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={onLogin}
        isMobile={false}
      />
    </>
  );
};

