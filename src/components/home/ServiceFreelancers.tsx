import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import freelancerData from "@/data/freelancerData.json";
import type { FreelancerData, Freelancer } from "@/types/freelancerTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useShortlist } from "@/hooks/useShortlist";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { toast } from "sonner";
import { FreelancerCard } from "@/components/shared/FreelancerCard";
import { FreelancerCardMobileTwo } from "../shared/FreelancerCardMobileTwo";

export const ServiceFreelancers = ({ props }: any) => {
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const {
    userRole,
    setUserRole,
    setIsLoggedIn
  } = useUserRole();
  const {
    isMobile,
    showLoginModal,
    setShowLoginModal,
    checkAuth
  } = useAuthCheck();
  const { isShortlisted, toggleShortlist } = useShortlist();

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 3000);
    };
    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Cleanup on unmount
    return () => stopAutoScroll();
  }, [api]);
  // const freelancers = (freelancerData as FreelancerData).freelancers.filter(f =>
  //   f.primaryService === props?.category?.name || f.service === props.category?.name
  // ) || [];

  // if (freelancers.length === 0) return null;

  const handleShortlist = (freelancerId: number) => {
    if (!checkAuth(() => handleShortlistAfterAuth(freelancerId))) {
      return;
    }
    handleShortlistAfterAuth(freelancerId);
  };

  const handleShortlistAfterAuth = (freelancerId: number) => {
    if (userRole !== 'employer') {
      toast.error("Only employers can shortlist freelancers");
      return;
    }

    const success = toggleShortlist(freelancerId);
    if (success) {
      const wasShortlisted = isShortlisted(freelancerId);
      if (wasShortlisted) {
        toast.success("Freelancer removed from shortlist");
      } else {
        toast.success("Freelancer added to shortlist");
      }
    }
  };
  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };
  const handleHireNow = (freelancerId: number) => {
    checkAuth(() => navigate(`/freelancer-services/${freelancerId}`));
  };

  return <section className="py-6">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">
          <span className="md:hidden">{props?.category?.name}s</span>
          <span className="hidden md:inline">Popular {props?.category?.name}s Near You</span>
        </h2>
        {/* <span className="text-sm text-primary cursor-pointer hover:text-primary/80 transition-colors" onClick={() => navigate(`/discover?service=${encodeURIComponent("kk")}`)}>
          View All →
        </span> */}
      </div>

      {/* Auto-scrolling Carousel */}
      <Carousel setApi={setApi} opts={{
        align: "start",
        loop: true
      }} className="w-full" onMouseEnter={() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }} onMouseLeave={() => {
        if (api && !intervalRef.current) {
          intervalRef.current = setInterval(() => {
            api.scrollNext();
          }, 3000);
        }
      }}>
        <CarouselContent className="-ml-3">
          {props?.services?.map(freelancer =>
            <CarouselItem key={freelancer._id} className="pl-3 basis-auto">
              {/* Desktop Card */}
              <div className="hidden md:block w-[280px]">
                <FreelancerCard
                  freelancer={freelancer}
                  variant="default"
                  showPrice={true}
                />
              </div>

              {/* Mobile Card */}
              <div className="md:hidden w-full max-w-[350px]">
                <FreelancerCardMobileTwo
                  freelancer={freelancer}
                  showPrice={true}
                />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </div>

    <LoginModal isOpen={showLoginModal} onClose={setShowLoginModal} onLoginSuccess={handleLogin} isMobile={isMobile} />
  </section>;
};