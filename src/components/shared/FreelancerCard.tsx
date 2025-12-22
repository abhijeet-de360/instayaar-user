import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShortlist } from "@/hooks/useShortlist";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useUserRole } from "@/contexts/UserRoleContext";
import { toast } from "sonner";
import type { Freelancer } from "@/types/freelancerTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import { LoginModal } from "../auth/LoginModal";
import { useState } from "react";

interface FreelancerCardProps {
  freelancer: Freelancer;
  variant?: "default" | "compact";
  showPrice?: boolean;
  className?: string;
}

export const FreelancerCard = ({ freelancer, variant = "default", showPrice = true, className = "" }: FreelancerCardProps) => {
  const navigate = useNavigate();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { checkAuth } = useAuthCheck();
  const { userRole } = useUserRole();
  const authVar = useSelector((state: RootState) => state.auth);

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAuth(() => handleShortlistAfterAuth())) {
      return;
    }
    handleShortlistAfterAuth();
  };

  const handleShortlistAfterAuth = () => {
    if (userRole !== 'employer') {
      toast.error("Only employers can shortlist freelancers");
      return;
    }

    const wasShortlisted = isShortlisted(freelancer.id);
    const success = toggleShortlist(freelancer.id);
    if (success) {
      if (wasShortlisted) {
        toast.success("Freelancer removed from shortlist");
      } else {
        toast.success("Freelancer added to shortlist");
      }
    } 
  };

  const handleHireNow = (freelancerId: string) => {
    if (authVar?.isAuthenticated) {
      if (localService.get('role') === 'user') {
        navigate(`/freelancer-services/${freelancerId}`);
      } else {
        toast.error("Only users can hire freelancers");
      }
    } else {
      setShowLoginModal (true);
    }
  }

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/freelancer-profile/${freelancer.freelancerId._id}`);
  };



  if (variant === "compact") {
    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <CardContent className="p-0">
          <div className="flex">
            {freelancer.categoryId}
            {/* Image Section */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={freelancer.images[0]}
                alt={freelancer.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-base leading-tight">{freelancer.freelancerId.firstName}</h3>
                  <p className="text-sm text-muted-foreground">{freelancer.primaryService} | Available</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleShortlist}
                >
                  <Heart className={`h-4 w-4 transition-colors ${isShortlisted(freelancer.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`} />
                </Button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{freelancer.rating}</span>
                  <span className="text-muted-foreground">({freelancer.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{freelancer.location}</span>
                </div>
              </div>

              {showPrice && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-muted-foreground line-through">₹600/hr</span>
                  <span className="text-base font-bold text-primary">₹500/hr</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="px-3 flex-1"
                  // onClick={handleHireNow}
                >
                  Hire Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 flex-1"
                  onClick={handleViewProfile}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="aspect-[4/3] relative">
          <img
            src={(freelancer?.images && freelancer.images.length > 0 ? freelancer?.images[0] : 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg')}
            alt={freelancer.name}
            className="w-full h-full object-cover"

          />
          {/* <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={handleShortlist}
          >
            <Heart className={`h-4 w-4 transition-colors ${isShortlisted(freelancer.id) ? 'text-red-500 fill-current' : 'text-gray-600'
              }`} />
          </Button>
        </div> */}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{`${freelancer.freelancerId?.firstName} ${freelancer.freelancerId?.lastName}`}</h3>
          <p className="text-muted-foreground text-sm mb-3">{freelancer?.categoryId?.name} | Available</p>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{freelancer.freelancerId?.averageRating}</span>
              <span className="text-sm text-muted-foreground">({freelancer.freelancerId?.totalReview})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{freelancer.location} </span>
            </div>
          </div>

          {showPrice && (
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-bold text-primary">₹{freelancer.price}/hr</div>
              </div>
              <Button
                size="sm"
                onClick={() => handleHireNow(freelancer?.freelancerId?._id)}
              >
                Hire Now
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => { }}
        isMobile={false}
      />
    </>
  );
};