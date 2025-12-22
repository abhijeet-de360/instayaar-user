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

interface FreelancerCardMobileTwoProps {
  freelancer: Freelancer;
  showPrice?: boolean;
  className?: string;
}

export const FreelancerCardMobileTwo = ({
  freelancer,
  showPrice = true,
  className = "",
}: FreelancerCardMobileTwoProps) => {
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
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/freelancer-profile/${freelancer.freelancerId._id}`);
  };

  // Generate consistent profile image
  const getFreelancerImage = () => {
    if (
      freelancer.image &&
      freelancer.image.trim() !== "" &&
      (freelancer.image.startsWith("http") || freelancer.image.startsWith("/"))
    ) {
      return freelancer.image;
    }

    const imageIds = [
      // 'photo-1500648767791-00dcc994a43e',
      // 'photo-1494790108755-2616b2c0c8e8',
      // 'photo-1472099645785-5658abf4ff4e',
      // 'photo-1438761681033-6461ffad8d80',
      // 'photo-1507003211169-0a1dd7228f2d',
      // 'photo-1544005313-94ddf0286df2',
      // 'photo-1519345182560-3f2917c472ef',
      // 'photo-1487412720507-e7ab37603c6f',
      // 'photo-1535713875002-d1d0cf377fde',
      // 'photo-1508214751196-bcfd4ca60f91',
      // 'photo-1560250097-0b93528c311a',
      // 'photo-1573496359142-b8d87734a5a2',
      // 'photo-1506794778202-cad84cf45f2f',
      // 'photo-1544725176-7c40e5a71c5e',
      // 'photo-1566492031773-4f4e44671d66'
    ];

    const imageIndex = Math.abs(freelancer.id) % imageIds.length;
    return `https://images.unsplash.com/${imageIds[imageIndex]}?auto=format&fit=crop&w=300&h=400&q=80`;
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
                      <h3 className="font-semibold text-base leading-tight">{`${freelancer?.freelancerId?.firstName} ${freelancer?.freelancerId?.lastName}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        {freelancer?.categoryId?.name} | Available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs ">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {freelancer.averageRating || 0.0}
                      </span>
                      <span className="text-muted-foreground">
                        ({freelancer?.freelancerId?.averageRating})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {freelancer?.location}
                      </span>
                    </div>
                  </div>

                  {showPrice && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-base font-bold text-primary">
                        ₹{freelancer?.price}/hr
                      </span>
                    </div>
                  )}
                </div>
                <img
                  src={freelancer?.freelancerId?.profile}
                  alt={freelancer?.freelancerId?.firstName}
                  className="w-22 rounded-lg h-[105px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="px-3 flex-1"
                  onClick={() => handleHireNow(freelancer?.freelancerId?._id)}
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
                {/* <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleShortlist}
                >
                  <Heart
                    className={`h-10 w-10 transition-colors ${
                      isShortlisted(freelancer.id)
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
        onLoginSuccess={() => {}}
        isMobile={true}
      />
    </>
  );
};