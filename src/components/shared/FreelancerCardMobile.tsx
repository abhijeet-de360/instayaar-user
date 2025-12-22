import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShortlist } from "@/hooks/useShortlist";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useUserRole } from "@/contexts/UserRoleContext";
import { toast } from "sonner";
import type { Freelancer } from "@/types/freelancerTypes";
import { LoginModal } from "../auth/LoginModal";
import { useState } from "react";
import { localService } from "@/shared/_session/local";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface FreelancerCardMobileProps {
  freelancer: Freelancer;
  showPrice?: boolean;
  className?: string;
}

export const FreelancerCardMobile = ({
  freelancer,
  showPrice = true,
  className = "",
}: FreelancerCardMobileProps) => {
  const navigate = useNavigate();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const { checkAuth } = useAuthCheck();
  const { userRole, isLoggedIn } = useUserRole();
  const authVar = useSelector((state: RootState) => state.auth);

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAuth(() => handleShortlistAfterAuth())) {
      return;
    }
    handleShortlistAfterAuth();
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleShortlistAfterAuth = () => {
    if (userRole !== "employer") {
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
      if (localService.get("role") === "user") {
        navigate(`/freelancer-services/${freelancerId}`);
      } else {
        toast.error("Only users can hire freelancers");
      }
    } else {
      setShowLoginModal(true);
    }

    if (authVar?.isAuthenticated) {
      if (!authVar?.user?.firstName) {
        navigate('/user-account-settings')
      }
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/freelancer-profile/${freelancer?._id}`);
  };



  return (
    <>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}
      >
        <CardContent className="p-0 h-full">
          <div className="flex h-full min-h-[140px]">
            {/* Content Section - Now comes first */}
            <div className="flex-1 p-4 space-y-2 ">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3 leading-tight">{freelancer?.skills[0]}</h3>
                      <h3 className="text-sm">{`${freelancer?.firstName} ${freelancer?.lastName}`}</h3>
                      <p className="text-xs text-muted-foreground">
                        {freelancer?.services?.map((s) => s?.category).join(", ")}
                      </p>

                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs ">

                    {/* <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {freelancer?.city}, {freelancer?.state}
                      </span>
                    </div> */}
                  </div>

                  {showPrice && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-base font-bold text-primary">
                        ₹{freelancer?.lowestPrice}
                      </span>&nbsp;
                      <span className="text-gray-400">|</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium ">
                          {freelancer.averageRating || 0.0}
                        </span>
                        <span className="text-muted-foreground">
                          ({freelancer?.totalReview})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {freelancer?.profile &&
                  <img
                    src={freelancer?.profile}
                    alt={freelancer?.freelancerId?.firstName}
                    className="w-22 rounded-lg h-[105px] aspect-square object-cover"
                  />
                }
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="px-3 flex-1"
                  onClick={() => handleHireNow(freelancer?._id)}
                >
                  Hire Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 flex-1"
                  onClick={handleViewProfile}
                >
                  Profile
                </Button>
                {/* <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleShortlist}
                >
                  <Heart
                    className={`h-10 w-10 transition-colors ${isShortlisted(freelancer.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                      }`}
                  />
                </Button> */}
              </div>
            </div>

            {/* Image Section - Full height, no gaps */}
            {/* <div className="relative w-20 flex-shrink-0 rounded-r-lg overflow-hidden">
              <img
                src={freelancer?.images[0] || 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg'}
                alt={freelancer.name}
                className="w-full h-full object-cover min-h-[140px]"
              />
            </div> */}
          </div>
        </CardContent>
      </Card>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => { }}
        isMobile={true}
      />
    </>
  );
};
